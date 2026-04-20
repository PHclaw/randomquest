from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.models import Checkin, Quest, User, UserAchievement, Achievement
from app.schemas.quest import CheckinCreate, CheckinOut
from typing import List, Optional
from datetime import datetime, timezone, timedelta

router = APIRouter(prefix="/checkins", tags=["checkins"])


async def get_current_user_id(request) -> int:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    from app.core.security import decode_access_token
    payload = decode_access_token(auth[7:])
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return int(payload["sub"])


@router.post("/", response_model=CheckinOut)
async def create_checkin(
    checkin_data: CheckinCreate,
    quest_id: int,
    db: AsyncSession = Depends(get_db),
    request = None
):
    user_id = await get_current_user_id(request)
    
    quest_result = await db.execute(select(Quest).where(Quest.id == quest_id))
    quest = quest_result.scalar_one_or_none()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    
    today = datetime.now(timezone.utc).date()
    existing = await db.execute(
        select(Checkin).where(
            Checkin.user_id == user_id,
            func.date(Checkin.created_at) == today
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already checked in today")
    
    checkin = Checkin(
        user_id=user_id,
        quest_id=quest_id,
        content=checkin_data.content,
        mood=checkin_data.mood,
        image_url=checkin_data.image_url
    )
    db.add(checkin)
    
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalar_one()
    user.total_checkins += 1
    
    yesterday = today - timedelta(days=1)
    yesterday_checkin = await db.execute(
        select(Checkin).where(
            Checkin.user_id == user_id,
            func.date(Checkin.created_at) == yesterday
        )
    )
    if yesterday_checkin.scalar_one_or_none():
        user.streak += 1
    else:
        user.streak = 1
    
    await check_achievements(user_id, user.streak, db)
    
    await db.commit()
    await db.refresh(checkin)
    
    result = await db.execute(select(User).where(User.id == user_id))
    checkin.username = result.scalar_one().username
    return checkin


async def check_achievements(user_id: int, streak: int, db: AsyncSession):
    achievements_data = [
        (7, "bronze", "涓€鍛ㄨ揪浜?),
        (14, "bronze", "鍧氭寔鍗婃湀"),
        (30, "silver", "鏈堝害鎸戞垬鑰?),
        (60, "silver", "鍙屾湀鍧氭寔"),
        (100, "gold", "鐧炬棩鑻遍泟"),
        (365, "diamond", "骞村害浼犲"),
    ]
    
    for req_days, tier, name in achievements_data:
        if streak >= req_days:
            result = await db.execute(
                select(UserAchievement).join(Achievement).where(
                    UserAchievement.user_id == user_id,
                    Achievement.name == name
                )
            )
            if not result.scalar_one_or_none():
                ach_result = await db.execute(select(Achievement).where(Achievement.name == name))
                achievement = ach_result.scalar_one_or_none()
                if achievement:
                    ua = UserAchievement(user_id=user_id, achievement_id=achievement.id)
                    db.add(ua)


@router.get("/my", response_model=List[CheckinOut])
async def my_checkins(db: AsyncSession = Depends(get_db), request = None):
    user_id = await get_current_user_id(request)
    result = await db.execute(select(Checkin).where(Checkin.user_id == user_id).order_by(Checkin.created_at.desc()))
    checkins = result.scalars().all()
    
    for c in checkins:
        user_result = await db.execute(select(User).where(User.id == c.user_id))
        c.username = user_result.scalar_one().username
    return checkins


@router.get("/feed", response_model=List[CheckinOut])
async def get_feed(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Checkin).order_by(Checkin.created_at.desc()).limit(50))
    checkins = result.scalars().all()
    
    for c in checkins:
        user_result = await db.execute(select(User).where(User.id == c.user_id))
        c.username = user_result.scalar_one().username
    return checkins


@router.post("/{checkin_id}/like")
async def like_checkin(checkin_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Checkin).where(Checkin.id == checkin_id))
    checkin = result.scalar_one_or_none()
    if not checkin:
        raise HTTPException(status_code=404, detail="Checkin not found")
    checkin.likes += 1
    await db.commit()
    return {"likes": checkin.likes}
