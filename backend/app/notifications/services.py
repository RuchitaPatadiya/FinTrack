from typing import Optional
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.notifications.models import Notification
from backend.app.budgets.models import Budget
from backend.app.transactions.models import Transaction
from backend.app.subscriptions.models import Subscription

def create_notification_if_not_exists(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    type: str = "info",
    recent_hours: int = 72
) -> Optional[Notification]:
    """
    Creates a notification only if an identical title has not been created
    for the user within the last `recent_hours` hours.
    """
    cutoff = datetime.now() - timedelta(hours=recent_hours)
    existing = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.title == title,
        Notification.created_at >= cutoff
    ).first()

    if existing:
        return None

    new_notif = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        is_read=False
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return new_notif

def check_budget_triggers(db: Session, user_id: int, transaction_date: Optional[str] = None):
    """
    Checks if current spending crossed 80% or 100% of master budget or category budgets.
    Triggered when an expense transaction is created or updated.
    """
    month_str = (transaction_date or datetime.now().strftime("%Y-%m"))[:7]

    # 1. Total expenses this month
    monthly_expenses = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.type == "expense",
        Transaction.date.startswith(month_str)
    ).all()

    total_spent = sum(t.amount for t in monthly_expenses)

    # Category spend mapping
    cat_spent = {}
    for t in monthly_expenses:
        ck = (t.category or "").strip()
        cat_spent[ck] = cat_spent.get(ck, 0.0) + t.amount

    # Fetch user's budgets for this month
    budgets = db.query(Budget).filter(
        Budget.user_id == user_id,
        Budget.month_year == month_str
    ).all()

    for b in budgets:
        limit = b.amount_limit
        if limit <= 0:
            continue

        if b.is_overall or not b.category_name:
            spent = total_spent
            name = "Overall Master Budget"
        else:
            spent = cat_spent.get(b.category_name, 0.0)
            name = f'"{b.category_name}" Budget'

        ratio = spent / limit

        if ratio >= 1.0:
            title = f"Budget Exceeded: {name}"
            msg = f"You have exceeded your {name} limit for {month_str}! Spent: ₹{spent:,.2f} of ₹{limit:,.2f} ({int(ratio * 100)}%)."
            create_notification_if_not_exists(db, user_id, title, msg, type="alert", recent_hours=24)
        elif ratio >= 0.8:
            title = f"Nearing Budget Ceiling: {name}"
            msg = f"You have reached {int(ratio * 100)}% of your {name} for {month_str}. Spent: ₹{spent:,.2f} of ₹{limit:,.2f} limit."
            create_notification_if_not_exists(db, user_id, title, msg, type="warning", recent_hours=24)

def check_goal_triggers(db: Session, user_id: int, goal_name: str, current: float, target: float):
    """
    Checks if a savings goal reached 100% funded.
    """
    if target > 0 and current >= target:
        title = f"Goal Achieved: {goal_name} 🎉"
        msg = f"Congratulations! You reached 100% of your savings goal for '{goal_name}' (Target: ₹{target:,.2f})."
        create_notification_if_not_exists(db, user_id, title, msg, type="success", recent_hours=168)

def check_subscription_renewals(db: Session, user_id: int):
    """
    Checks if any active subscription is renewing within 3 days or is due today.
    """
    subs = db.query(Subscription).filter(
        Subscription.user_id == user_id,
        Subscription.status == "active"
    ).all()

    today = date.today()

    for sub in subs:
        try:
            renewal_date = datetime.strptime(sub.next_billing_date, "%Y-%m-%d").date()
            delta_days = (renewal_date - today).days

            if 0 <= delta_days <= 3:
                timing_str = "today" if delta_days == 0 else f"in {delta_days} day{'s' if delta_days > 1 else ''}"
                title = f"Upcoming Renewal: {sub.name}"
                msg = f"{sub.name} is scheduled to renew {timing_str} on {sub.next_billing_date} for ₹{sub.amount:,.2f} ({sub.billing_cycle})."
                create_notification_if_not_exists(db, user_id, title, msg, type="warning", recent_hours=48)
            elif delta_days < 0 and delta_days >= -3:
                # Recently renewed or overdue
                title = f"Renewal Due: {sub.name}"
                msg = f"{sub.name} renewal date was {abs(delta_days)} day(s) ago ({sub.next_billing_date}). Review payment status of ₹{sub.amount:,.2f}."
                create_notification_if_not_exists(db, user_id, title, msg, type="alert", recent_hours=72)
        except Exception:
            continue
