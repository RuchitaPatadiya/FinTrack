from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class GoalBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    emoji: Optional[str] = "🎯"
    target: float = Field(..., gt=0, description="Target must be positive")
    current: Optional[float] = Field(default=0.0, ge=0, description="Current saved amount")
    color: Optional[str] = "mint"
    deadline: Optional[str] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    emoji: Optional[str] = None
    target: Optional[float] = Field(None, gt=0)
    current: Optional[float] = Field(None, ge=0)
    color: Optional[str] = None
    deadline: Optional[str] = None
    deposit: Optional[float] = Field(None, gt=0, description="Incremental deposit amount to add to current")

class GoalResponse(GoalBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
