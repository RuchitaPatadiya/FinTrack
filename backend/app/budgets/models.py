from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True, index=True)
    category_name = Column(String(100), nullable=True)  # NULL for master/overall monthly ceiling
    amount_limit = Column(Float, nullable=False)
    month_year = Column(String(7), nullable=False, index=True)  # Format: YYYY-MM
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", backref="budgets")
    category = relationship("Category")

    __table_args__ = (
        UniqueConstraint('user_id', 'category_name', 'month_year', name='uq_user_category_month_budget'),
    )
