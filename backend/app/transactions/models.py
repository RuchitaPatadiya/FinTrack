from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String(20), nullable=False)  # "income" or "expense"
    category = Column(String(100), nullable=False)
    emoji = Column(String(10), default="💰")
    mood = Column(String(100), nullable=True)
    mood_color = Column(String(50), default="mint")
    payment_method = Column(String(100), nullable=True)
    date = Column(String(10), nullable=False)  # YYYY-MM-DD
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", backref="transactions")
