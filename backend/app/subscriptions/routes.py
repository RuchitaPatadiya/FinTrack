from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_user
from backend.app.accounts.models import User
from backend.app.subscriptions.models import Subscription
from backend.app.subscriptions.schemas import (
    SubscriptionCreate,
    SubscriptionUpdate,
    SubscriptionResponse,
    SubscriptionSummaryResponse
)

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])

@router.get("", response_model=List[SubscriptionResponse])
def get_subscriptions(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status: active, paused, cancelled"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all recurring subscriptions for the authenticated user.
    """
    query = db.query(Subscription).filter(Subscription.user_id == current_user.id)
    if status_filter:
        query = query.filter(Subscription.status == status_filter.strip().lower())
    
    subscriptions = query.order_by(Subscription.next_billing_date.asc(), Subscription.id.asc()).all()
    return subscriptions

@router.get("/summary", response_model=SubscriptionSummaryResponse)
def get_subscriptions_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Compute total monthly recurring burn (₹) and upcoming renewal counts.
    """
    subscriptions = db.query(Subscription).filter(
        Subscription.user_id == current_user.id,
        Subscription.status == "active"
    ).all()

    today = date.today()
    total_monthly_burn = 0.0
    upcoming_count = 0

    for sub in subscriptions:
        cycle = (sub.billing_cycle or "monthly").lower()
        if cycle == "annual" or cycle == "yearly":
            total_monthly_burn += round(sub.amount / 12.0, 2)
        elif cycle == "weekly":
            total_monthly_burn += round(sub.amount * 4.33, 2)
        else:
            total_monthly_burn += sub.amount

        try:
            renewal_date = datetime.strptime(sub.next_billing_date, "%Y-%m-%d").date()
            days_until = (renewal_date - today).days
            if 0 <= days_until <= 3:
                upcoming_count += 1
        except Exception:
            pass

    return SubscriptionSummaryResponse(
        total_monthly_burn=round(total_monthly_burn, 2),
        total_active_count=len(subscriptions),
        upcoming_renewals_count=upcoming_count
    )

@router.post("", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
def create_subscription(
    data: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new recurring subscription for the authenticated user.
    """
    new_sub = Subscription(
        user_id=current_user.id,
        name=data.name.strip(),
        amount=round(float(data.amount), 2),
        billing_cycle=(data.billing_cycle or "monthly").strip().lower(),
        next_billing_date=data.next_billing_date.strip(),
        category=data.category.strip() if data.category else None,
        payment_method=data.payment_method.strip() if data.payment_method else None,
        status=(data.status or "active").strip().lower()
    )
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    return new_sub

@router.put("/{subscription_id}", response_model=SubscriptionResponse)
def update_subscription(
    subscription_id: int,
    data: SubscriptionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update an existing subscription (name, amount, cycle, next renewal date, status, etc.).
    """
    sub = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()

    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found or unauthorized."
        )

    if data.name is not None:
        sub.name = data.name.strip()
    if data.amount is not None:
        sub.amount = round(float(data.amount), 2)
    if data.billing_cycle is not None:
        sub.billing_cycle = data.billing_cycle.strip().lower()
    if data.next_billing_date is not None:
        sub.next_billing_date = data.next_billing_date.strip()
    if data.category is not None:
        sub.category = data.category.strip() if data.category else None
    if data.payment_method is not None:
        sub.payment_method = data.payment_method.strip() if data.payment_method else None
    if data.status is not None:
        sub.status = data.status.strip().lower()

    db.commit()
    db.refresh(sub)
    return sub

@router.delete("/{subscription_id}", status_code=status.HTTP_200_OK)
def delete_subscription(
    subscription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently delete a subscription for the authenticated user.
    """
    sub = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()

    if not sub:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscription not found or unauthorized."
        )

    db.delete(sub)
    db.commit()
    return {"message": "Subscription deleted successfully"}
