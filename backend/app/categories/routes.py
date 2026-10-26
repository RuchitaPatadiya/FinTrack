from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_user
from backend.app.accounts.models import User
from backend.app.categories.models import Category
from backend.app.categories.schemas import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse
)

router = APIRouter(prefix="/categories", tags=["Categories"])

SYSTEM_CATEGORIES = [
    {"name": "Housing & Rent", "icon": "🏠", "color": "purple", "type": "expense"},
    {"name": "Groceries & Provisions", "icon": "🛒", "color": "mint", "type": "expense"},
    {"name": "Food & Dining", "icon": "🍽️", "color": "peach", "type": "expense"},
    {"name": "Utilities & Bills", "icon": "⚡", "color": "sky", "type": "expense"},
    {"name": "Transportation & Fuel", "icon": "🚗", "color": "yellow", "type": "expense"},
    {"name": "Shopping", "icon": "🛍️", "color": "pink", "type": "expense"},
    {"name": "Entertainment & Subscriptions", "icon": "🎬", "color": "purple", "type": "expense"},
    {"name": "Health & Pharmacy", "icon": "💊", "color": "mint", "type": "expense"},
    {"name": "Salary & Income", "icon": "💼", "color": "mint", "type": "income"},
    {"name": "Investments & Dividends", "icon": "📈", "color": "sky", "type": "income"},
    {"name": "General / Other", "icon": "📦", "color": "slate", "type": "expense"},
]

def ensure_system_categories(db: Session):
    """Seed default system categories if table is empty."""
    count = db.query(Category).filter(Category.is_system == True).count()
    if count == 0:
        for item in SYSTEM_CATEGORIES:
            cat = Category(
                name=item["name"],
                icon=item["icon"],
                color=item["color"],
                type=item["type"],
                is_system=True,
                user_id=None
            )
            db.add(cat)
        db.commit()

@router.get("", response_model=List[CategoryResponse])
def get_categories(
    type: Optional[str] = Query(None, description="Filter by 'income' or 'expense'"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all categories available to the user (global system categories + custom user categories).
    """
    ensure_system_categories(db)

    query = db.query(Category).filter(
        or_(
            Category.is_system == True,
            Category.user_id == current_user.id
        )
    )

    if type:
        query = query.filter(Category.type == type.strip().lower())

    categories = query.order_by(Category.is_system.desc(), Category.name.asc()).all()
    return categories

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    data: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new custom category for the authenticated user.
    """
    # Check for duplicate category name for this user
    existing = db.query(Category).filter(
        func.lower(Category.name) == data.name.strip().lower(),
        or_(Category.is_system == True, Category.user_id == current_user.id)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A category named '{data.name.strip()}' already exists."
        )

    new_cat = Category(
        user_id=current_user.id,
        name=data.name.strip(),
        icon=data.icon or "📦",
        color=data.color or "slate",
        type=data.type.strip().lower(),
        is_system=False
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a custom category owned by the authenticated user.
    System categories cannot be modified.
    """
    cat = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Custom category not found or unauthorized (system categories cannot be edited)."
        )

    if data.name is not None:
        cat.name = data.name.strip()
    if data.icon is not None:
        cat.icon = data.icon
    if data.color is not None:
        cat.color = data.color
    if data.type is not None:
        cat.type = data.type.strip().lower()

    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/{category_id}", status_code=status.HTTP_200_OK)
def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a custom category owned by the authenticated user.
    System categories cannot be deleted.
    """
    cat = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == current_user.id
    ).first()

    if not cat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Custom category not found or unauthorized (system categories cannot be deleted)."
        )

    db.delete(cat)
    db.commit()
    return {"message": "Category deleted successfully"}
