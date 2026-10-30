from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_user
from backend.app.accounts.models import User
from backend.app.goals.models import SavingsGoal
from backend.app.goals.schemas import (
    GoalCreate,
    GoalUpdate,
    GoalResponse
)
from backend.app.notifications.services import check_goal_triggers

router = APIRouter(prefix="/goals", tags=["Savings Goals"])

@router.get("", response_model=List[GoalResponse])
def get_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all savings goals for the authenticated user.
    """
    goals = db.query(SavingsGoal).filter(
        SavingsGoal.user_id == current_user.id
    ).order_by(SavingsGoal.id.asc()).all()
    return goals

@router.post("", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(
    data: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new savings goal tied to the authenticated user.
    """
    new_goal = SavingsGoal(
        user_id=current_user.id,
        name=data.name.strip(),
        emoji=data.emoji or "🎯",
        target=round(float(data.target), 2),
        current=round(float(data.current or 0.0), 2),
        color=data.color or "mint",
        deadline=data.deadline.strip() if data.deadline else None
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    try:
        check_goal_triggers(db, current_user.id, new_goal.name, new_goal.current, new_goal.target)
    except Exception:
        pass

    return new_goal

@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int,
    data: GoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a savings goal or make a deposit for the authenticated user.
    """
    goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id,
        SavingsGoal.user_id == current_user.id
    ).first()

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Savings goal not found or unauthorized."
        )

    if data.name is not None:
        goal.name = data.name.strip()
    if data.emoji is not None:
        goal.emoji = data.emoji
    if data.target is not None:
        goal.target = round(float(data.target), 2)
    if data.color is not None:
        goal.color = data.color
    if data.deadline is not None:
        goal.deadline = data.deadline.strip() if data.deadline else None

    # Handle deposit (increment) or explicit current set
    if data.deposit is not None:
        goal.current = round(float(goal.current or 0.0) + float(data.deposit), 2)
    elif data.current is not None:
        goal.current = round(float(data.current), 2)

    db.commit()
    db.refresh(goal)

    try:
        check_goal_triggers(db, current_user.id, goal.name, goal.current, goal.target)
    except Exception:
        pass

    return goal

@router.delete("/{goal_id}", status_code=status.HTTP_200_OK)
def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a savings goal owned by the authenticated user.
    """
    goal = db.query(SavingsGoal).filter(
        SavingsGoal.id == goal_id,
        SavingsGoal.user_id == current_user.id
    ).first()

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Savings goal not found or unauthorized."
        )

    db.delete(goal)
    db.commit()
    return {"message": "Savings goal deleted successfully"}
