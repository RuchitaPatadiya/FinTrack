from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str = "info"  # warning, success, alert, info
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationListResponse(BaseModel):
    unread_count: int
    notifications: List[NotificationResponse]

class NotificationCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)
    type: Optional[str] = "info"
