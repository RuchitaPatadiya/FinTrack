from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

class BudgetBase(BaseModel):
    category_id: Optional[int] = None
    category_name: Optional[str] = None  # None indicates master monthly budget
    amount_limit: float = Field(..., gt=0, description="Budget limit must be positive")
    month_year: str = Field(..., pattern=r"^\d{4}-\d{2}$", description="Format: YYYY-MM")

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    amount_limit: float = Field(..., gt=0, description="Budget limit must be positive")

class BudgetStatusResponse(BaseModel):
    id: int
    category_id: Optional[int] = None
    category_name: Optional[str] = None
    amount_limit: float
    month_year: str
    spent_amount: float = 0.0
    remaining_amount: float = 0.0
    percentage_spent: float = 0.0
    is_over_budget: bool = False
    is_near_ceiling: bool = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MonthlyBudgetOverviewResponse(BaseModel):
    month_year: str
    overall_budget: Optional[BudgetStatusResponse] = None
    category_budgets: List[BudgetStatusResponse] = []
    total_spent: float = 0.0
    total_budgeted: float = 0.0
