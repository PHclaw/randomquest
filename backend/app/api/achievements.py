from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import Achievement, UserAchievement
from app.schemas.quest import AchievementOut
from typing import List

router = APIRouter(prefix="/achievements", tags=["achievements"])


async def get_current_user_id(request) -> int:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Not authenticated")
    from app.core.security import decode_access_token
    payload = decode_access_token(auth[7:])
    if not payload:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid token")
    return int(payload["sub"])


@router.get("/", response_model=List[AchievementOut])
async def list_achievements(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Achievement))
    return result.scalars().all()


@router.get("/my", response_model=List[AchievementOut])
async def my_achievements(db: AsyncSession = Depends(get_db), request = None):
    user_id = await get_current_user_id(request)
    result = await db.execute(
        select(UserAchievement).where(UserAchievement.user_id == user_id)
    )
    user_achs = result.scalars().all()
    
    achievements = []
    for ua in user_achs:
        ach_result = await db.execute(select(Achievement).where(Achievement.id == ua.achievement_id))
        ach = ach_result.scalar_one()
        achievements.append(AchievementOut(
            id=ach.id,
            name=ach.name,
            description=ach.description,
            icon=ach.icon,
            tier=ach.tier,
            earned_at=ua.earned_at
        ))
    return achievements
