from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.dependencies import get_current_user
from backend.app.accounts.models import User
from backend.app.notifications.models import Notification
from backend.app.notifications.schemas import (
    NotificationResponse,
    NotificationListResponse
)
from backend.app.notifications.services import check_subscription_renewals

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=NotificationListResponse)
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all notifications for the authenticated user along with the live unread count.
    Also automatically runs subscription renewal checks so users have up-to-the-minute alerts.
    """
    # Auto-check subscription renewals
    try:
        check_subscription_renewals(db, current_user.id)
    except Exception as e:
        # Don't fail the notifications endpoint if background check encounters an issue
        pass

    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc(), Notification.id.desc()).all()

    unread_count = sum(1 for n in notifications if not n.is_read)

    return NotificationListResponse(
        unread_count=unread_count,
        notifications=notifications
    )

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark an individual notification as read.
    """
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()

    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found or unauthorized."
        )

    notif.is_read = True
    db.commit()
    db.refresh(notif)
    return notif

@router.post("/read-all", status_code=status.HTTP_200_OK)
def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark all unread notifications as read for the authenticated user.
    """
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}

@router.delete("/{notification_id}", status_code=status.HTTP_200_OK)
def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a specific notification.
    """
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()

    if not notif:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found or unauthorized."
        )

    db.delete(notif)
    db.commit()
    return {"message": "Notification deleted successfully"}

@router.delete("", status_code=status.HTTP_200_OK)
def clear_all_read_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Clear all read notifications for the authenticated user.
    """
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == True
    ).delete()
    db.commit()
    return {"message": "Read notifications cleared successfully"}
