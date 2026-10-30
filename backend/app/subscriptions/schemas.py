from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class SubscriptionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Subscription name (e.g., Netflix, Spotify)")
    amount: float = Field(..., gt=0, description="Amount in INR (₹)")
    billing_cycle: str = Field("monthly", description="Billing cycle: monthly, annual, or weekly")
    next_billing_date: str = Field(..., description="Next billing date in format YYYY-MM-DD")
    category: Optional[str] = Field(None, description="Category name (e.g. Entertainment, Utilities)")
    payment_method: Optional[str] = Field(None, description="Payment method (e.g. UPI, Credit Card)")
    status: Optional[str] = Field("active", description="Status: active, paused, or cancelled")

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    amount: Optional[float] = Field(None, gt=0)
    billing_cycle: Optional[str] = None
    next_billing_date: Optional[str] = None
    category: Optional[str] = None
    payment_method: Optional[str] = None
    status: Optional[str] = None

class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SubscriptionSummaryResponse(BaseModel):
    total_monthly_burn: float
    total_active_count: int
    upcoming_renewals_count: int
