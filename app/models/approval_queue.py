from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.config.database import Base


class ApprovalQueue(Base):
    __tablename__ = "ApprovalQueue"

    Id = Column(Integer, primary_key=True, index=True)
    UserId = Column(Integer, nullable=False)
    Message = Column(String, nullable=False)
    Platform = Column(String(50), nullable=False)
    MediaPath = Column(String, nullable=True)
    ScheduledDate = Column(String(50), nullable=True)
    ScheduledTime = Column(String(50), nullable=True)
    Status = Column(String(50), default="Pending")
    CreatedAt = Column(DateTime, server_default=func.now())