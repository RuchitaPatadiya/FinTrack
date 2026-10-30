from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from backend.app.core.database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    billing_cycle = Column(String(50), nullable=False, default="monthly")  # monthly, annual, weekly
    next_billing_date = Column(String(10), nullable=False)  # YYYY-MM-DD
    category = Column(String(100), nullable=True)
    payment_method = Column(String(100), nullable=True)
    status = Column(String(20), nullable=False, default="active")  # active, paused, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
