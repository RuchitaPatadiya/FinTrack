from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_user
from backend.app.accounts.models import User
from backend.app.transactions.models import Transaction
from backend.app.transactions.schemas import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionSummaryResponse
)

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.get("", response_model=List[TransactionResponse])
def get_transactions(
    type: Optional[str] = Query(None, description="Filter by 'income' or 'expense'"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in title, category, or mood"),
    start_date: Optional[str] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve transactions for the authenticated user with optional filtering and search.
    Guarantees strict user-level data isolation.
    """
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)

    if type:
        query = query.filter(Transaction.type == type.strip().lower())
    if category and category.lower() != "all":
        query = query.filter(func.lower(Transaction.category) == category.strip().lower())
    if search:
        search_term = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Transaction.title).ilike(search_term),
                func.lower(Transaction.category).ilike(search_term),
                func.lower(Transaction.mood).ilike(search_term)
            )
        )
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    # Sort newest date first, then newest ID
    transactions = query.order_by(Transaction.date.desc(), Transaction.id.desc()).offset(offset).limit(limit).all()
    return transactions

@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new transaction tied strictly to the authenticated user.
    """
    new_tx = Transaction(
        user_id=current_user.id,
        title=data.title.strip(),
        amount=round(float(data.amount), 2),
        type=data.type.strip().lower(),
        category=data.category.strip(),
        emoji=data.emoji or "💰",
        mood=data.mood.strip() if data.mood else None,
        mood_color=data.mood_color or "mint",
        payment_method=data.payment_method.strip() if data.payment_method else None,
        date=data.date.strip()
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@router.get("/summary", response_model=TransactionSummaryResponse)
def get_transaction_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Compute live aggregate balance, income, expenses, and savings rate for the user.
    """
    tx_list = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    
    total_income = sum(tx.amount for tx in tx_list if tx.type == "income")
    total_expenses = sum(tx.amount for tx in tx_list if tx.type == "expense")
    total_balance = total_income - total_expenses
    
    savings_rate = 0.0
    if total_income > 0:
        savings_rate = round(max(0.0, (total_balance / total_income) * 100), 1)

    return TransactionSummaryResponse(
        total_balance=round(total_balance, 2),
        total_income=round(total_income, 2),
        total_expenses=round(total_expenses, 2),
        savings_rate=savings_rate,
        transaction_count=len(tx_list)
    )

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    data: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a transaction owned by the authenticated user.
    """
    tx = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()

    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found or unauthorized."
        )

    if data.title is not None:
        tx.title = data.title.strip()
    if data.amount is not None:
        tx.amount = round(float(data.amount), 2)
    if data.type is not None:
        tx.type = data.type.strip().lower()
    if data.category is not None:
        tx.category = data.category.strip()
    if data.emoji is not None:
        tx.emoji = data.emoji
    if data.mood is not None:
        tx.mood = data.mood.strip() if data.mood else None
    if data.mood_color is not None:
        tx.mood_color = data.mood_color
    if data.payment_method is not None:
        tx.payment_method = data.payment_method.strip() if data.payment_method else None
    if data.date is not None:
        tx.date = data.date.strip()

    db.commit()
    db.refresh(tx)
    return tx

@router.delete("/{transaction_id}", status_code=status.HTTP_200_OK)
def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a specific transaction owned by the authenticated user.
    """
    tx = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()

    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found or unauthorized."
        )

    db.delete(tx)
    db.commit()
    return {"message": "Transaction deleted successfully"}
