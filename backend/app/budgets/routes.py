from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_user
from backend.app.accounts.models import User
from backend.app.transactions.models import Transaction
from backend.app.budgets.models import Budget
from backend.app.budgets.schemas import (
    BudgetCreate,
    BudgetUpdate,
    BudgetStatusResponse,
    MonthlyBudgetOverviewResponse
)

router = APIRouter(prefix="/budgets", tags=["Budgets"])

@router.get("", response_model=MonthlyBudgetOverviewResponse)
def get_budgets(
    month: Optional[str] = Query(None, description="Month format: YYYY-MM (e.g., 2026-10)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve monthly budget overview including overall budget and category-specific budgets,
    joined with live spending calculations from the transactions table.
    """
    current_month = month or datetime.now().strftime("%Y-%m")

    # 1. Fetch all expense transactions for current user in this month
    expenses = db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.date.startswith(current_month)
    ).all()

    total_spent = sum(t.amount for t in expenses)

    # Category spend map
    category_spend_map = {}
    for t in expenses:
        cat_key = (t.category or "").strip().lower()
        category_spend_map[cat_key] = category_spend_map.get(cat_key, 0.0) + t.amount

    # 2. Fetch all budgets configured for this month
    budgets = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month_year == current_month
    ).all()

    overall_budget_resp = None
    category_budgets_resp = []
    total_budgeted = 0.0

    for b in budgets:
        limit = b.amount_limit
        total_budgeted += limit

        if b.category_name is None:
            # Overall master budget
            spent = round(total_spent, 2)
            pct = round((spent / limit) * 100, 1) if limit > 0 else 0.0
            overall_budget_resp = BudgetStatusResponse(
                id=b.id,
                category_id=b.category_id,
                category_name=None,
                amount_limit=limit,
                month_year=b.month_year,
                spent_amount=spent,
                remaining_amount=round(max(0.0, limit - spent), 2),
                percentage_spent=pct,
                is_over_budget=spent > limit,
                is_near_ceiling=pct >= 80.0,
                created_at=b.created_at
            )
        else:
            cat_key = b.category_name.strip().lower()
            spent = round(category_spend_map.get(cat_key, 0.0), 2)
            pct = round((spent / limit) * 100, 1) if limit > 0 else 0.0
            cat_resp = BudgetStatusResponse(
                id=b.id,
                category_id=b.category_id,
                category_name=b.category_name,
                amount_limit=limit,
                month_year=b.month_year,
                spent_amount=spent,
                remaining_amount=round(max(0.0, limit - spent), 2),
                percentage_spent=pct,
                is_over_budget=spent > limit,
                is_near_ceiling=pct >= 80.0,
                created_at=b.created_at
            )
            category_budgets_resp.append(cat_resp)

    return MonthlyBudgetOverviewResponse(
        month_year=current_month,
        overall_budget=overall_budget_resp,
        category_budgets=category_budgets_resp,
        total_spent=round(total_spent, 2),
        total_budgeted=round(total_budgeted, 2)
    )

@router.post("", response_model=BudgetStatusResponse, status_code=status.HTTP_201_CREATED)
def set_budget(
    data: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create or update (upsert) a budget limit for a category or overall month.
    """
    clean_cat_name = data.category_name.strip() if data.category_name else None
    clean_month = data.month_year.strip()

    # Look for existing budget
    existing = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.category_name == clean_cat_name,
        Budget.month_year == clean_month
    ).first()

    if existing:
        existing.amount_limit = round(float(data.amount_limit), 2)
        if data.category_id is not None:
            existing.category_id = data.category_id
        db.commit()
        db.refresh(existing)
        target_budget = existing
    else:
        new_budget = Budget(
            user_id=current_user.id,
            category_id=data.category_id,
            category_name=clean_cat_name,
            amount_limit=round(float(data.amount_limit), 2),
            month_year=clean_month
        )
        db.add(new_budget)
        db.commit()
        db.refresh(new_budget)
        target_budget = new_budget

    # Compute spent
    if target_budget.category_name is None:
        spent = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            Transaction.date.startswith(clean_month)
        ).scalar()
    else:
        spent = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            func.lower(Transaction.category) == target_budget.category_name.lower(),
            Transaction.date.startswith(clean_month)
        ).scalar()

    spent = round(float(spent), 2)
    limit = target_budget.amount_limit
    pct = round((spent / limit) * 100, 1) if limit > 0 else 0.0

    return BudgetStatusResponse(
        id=target_budget.id,
        category_id=target_budget.category_id,
        category_name=target_budget.category_name,
        amount_limit=limit,
        month_year=target_budget.month_year,
        spent_amount=spent,
        remaining_amount=round(max(0.0, limit - spent), 2),
        percentage_spent=pct,
        is_over_budget=spent > limit,
        is_near_ceiling=pct >= 80.0,
        created_at=target_budget.created_at
    )

@router.put("/{budget_id}", response_model=BudgetStatusResponse)
def update_budget(
    budget_id: int,
    data: BudgetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update the amount limit of a specific budget.
    """
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()

    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found or unauthorized."
        )

    budget.amount_limit = round(float(data.amount_limit), 2)
    db.commit()
    db.refresh(budget)

    # Compute spent
    if budget.category_name is None:
        spent = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            Transaction.date.startswith(budget.month_year)
        ).scalar()
    else:
        spent = db.query(func.coalesce(func.sum(Transaction.amount), 0.0)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == "expense",
            func.lower(Transaction.category) == budget.category_name.lower(),
            Transaction.date.startswith(budget.month_year)
        ).scalar()

    spent = round(float(spent), 2)
    limit = budget.amount_limit
    pct = round((spent / limit) * 100, 1) if limit > 0 else 0.0

    return BudgetStatusResponse(
        id=budget.id,
        category_id=budget.category_id,
        category_name=budget.category_name,
        amount_limit=limit,
        month_year=budget.month_year,
        spent_amount=spent,
        remaining_amount=round(max(0.0, limit - spent), 2),
        percentage_spent=pct,
        is_over_budget=spent > limit,
        is_near_ceiling=pct >= 80.0,
        created_at=budget.created_at
    )

@router.delete("/{budget_id}", status_code=status.HTTP_200_OK)
def delete_budget(
    budget_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a specific budget limit.
    """
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()

    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found or unauthorized."
        )

    db.delete(budget)
    db.commit()
    return {"message": "Budget limit deleted successfully"}
