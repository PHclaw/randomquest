from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.models import QuestCategory


class CheckinCreate(BaseModel):
    content: str
    mood: str = "馃槉"
    image_url: Optional[str] = ""


class CheckinOut(BaseModel):
    id: int
    user_id: int
    quest_id: int
    content: str
    mood: str
    image_url: Optional[str]
    likes: int
    created_at: datetime
    username: Optional[str] = None

    class Config:
        from_attributes = True


class QuestOut(BaseModel):
    id: int
    title: str
    description: str
    category: QuestCategory
    difficulty: int
    created_at: datetime

    class Config:
        from_attributes = True


class AchievementOut(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    tier: str
    earned_at: Optional[datetime] = None

    class Config:
        from_attributes = True
