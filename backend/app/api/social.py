from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import Follow, User
from app.schemas.user import UserOut
from typing import List

router = APIRouter(prefix="/social", tags=["social"])


async def get_current_user_id(request) -> int:
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    from app.core.security import decode_access_token
    payload = decode_access_token(auth[7:])
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return int(payload["sub"])


@router.post("/follow/{user_id}")
async def follow_user(user_id: int, db: AsyncSession = Depends(get_db), request = None):
    current_user_id = await get_current_user_id(request)
    if current_user_id == user_id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    
    existing = await db.execute(
        select(Follow).where(
            Follow.follower_id == current_user_id,
            Follow.following_id == user_id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already following")
    
    follow = Follow(follower_id=current_user_id, following_id=user_id)
    db.add(follow)
    await db.commit()
    return {"message": "Followed successfully"}


@router.delete("/follow/{user_id}")
async def unfollow_user(user_id: int, db: AsyncSession = Depends(get_db), request = None):
    current_user_id = await get_current_user_id(request)
    result = await db.execute(
        select(Follow).where(
            Follow.follower_id == current_user_id,
            Follow.following_id == user_id
        )
    )
    follow = result.scalar_one_or_none()
    if not follow:
        raise HTTPException(status_code=404, detail="Not following")
    await db.delete(follow)
    await db.commit()
    return {"message": "Unfollowed successfully"}


@router.get("/following", response_model=List[UserOut])
async def get_following(db: AsyncSession = Depends(get_db), request = None):
    current_user_id = await get_current_user_id(request)
    result = await db.execute(
        select(Follow).where(Follow.follower_id == current_user_id)
    )
    follows = result.scalars().all()
    
    users = []
    for f in follows:
        user_result = await db.execute(select(User).where(User.id == f.following_id))
        users.append(user_result.scalar_one())
    return users


@router.get("/followers", response_model=List[UserOut])
async def get_followers(db: AsyncSession = Depends(get_db), request = None):
    current_user_id = await get_current_user_id(request)
    result = await db.execute(
        select(Follow).where(Follow.following_id == current_user_id)
    )
    follows = result.scalars().all()
    
    users = []
    for f in follows:
        user_result = await db.execute(select(User).where(User.id == f.follower_id))
        users.append(user_result.scalar_one())
    return users


@router.get("/leaderboard", response_model=List[UserOut])
async def get_leaderboard(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).order_by(User.streak.desc()).limit(10))
    return result.scalars().all()
