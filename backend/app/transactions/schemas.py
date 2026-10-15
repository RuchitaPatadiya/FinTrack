from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, AliasChoices

class TransactionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    amount: float = Field(..., gt=0, description="Amount must be positive")
    type: str = Field(..., pattern="^(income|expense)$", description="Must be 'income' or 'expense'")
    category: str = Field(..., min_length=1, max_length=100)
    emoji: Optional[str] = "💰"
    mood: Optional[str] = None
    mood_color: Optional[str] = "mint"
    payment_method: Optional[str] = Field(None, validation_alias=AliasChoices('payment_method', 'paymentMethod'))
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Format: YYYY-MM-DD")

    model_config = ConfigDict(populate_by_name=True)

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    amount: Optional[float] = Field(None, gt=0)
    type: Optional[str] = Field(None, pattern="^(income|expense)$")
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    emoji: Optional[str] = None
    mood: Optional[str] = None
    mood_color: Optional[str] = None
    payment_method: Optional[str] = Field(None, validation_alias=AliasChoices('payment_method', 'paymentMethod'))
    date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")

    model_config = ConfigDict(populate_by_name=True)

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class TransactionSummaryResponse(BaseModel):
    total_balance: float
    total_income: float
    total_expenses: float
    savings_rate: float
    transaction_count: int
