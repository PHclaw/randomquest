from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import Quest, QuestCategory
from app.schemas.quest import QuestOut
from typing import List
import random

router = APIRouter(prefix="/quests", tags=["quests"])


@router.get("/", response_model=List[QuestOut])
async def list_quests(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Qest).where(Quest.is_active == True))
    return result.scalars().all()


@router.get("/today")
async def get_today_quest(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Quest).where(Quest.is_active == True))
    quests = result.scalars().all()
    if not quests:
        return {"error": "No quests available"}
    quest = random.choice(quests)
    return QuestOut.model_validate(quest)


@router.get("/{quest_id}", response_model=QuestOut)
async def get_quest(quest_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Quest).where(Quest.id == quest_id))
    quest = result.scalar_one_or_none()
    if not quest:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Quest not found")
    return quest


@router.get("/category/{category}")
async def get_by_category(category: QuestCategory, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Quest).where(Quest.category == category, Quest.is_active == True))
    return result.scalars().all()
