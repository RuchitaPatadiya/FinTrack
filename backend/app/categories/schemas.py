from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    icon: Optional[str] = Field("📦", max_length=10)
    color: Optional[str] = Field("slate", max_length=50)
    type: str = Field("expense", pattern="^(expense|income)$")

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    icon: Optional[str] = Field(None, max_length=10)
    color: Optional[str] = Field(None, max_length=50)
    type: Optional[str] = Field(None, pattern="^(expense|income)$")

class CategoryResponse(CategoryBase):
    id: int
    user_id: Optional[int] = None
    is_system: bool = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
