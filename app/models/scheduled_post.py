from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.config.database import Base


class ScheduledPost(Base):

    __tablename__ = "ScheduledPosts"

    Id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    UserId = Column(
        Integer,
        nullable=False
    )

    Platform = Column(
        String(50),
        nullable=False
    )

    Message = Column(
        String,
        nullable=False
    )

    MediaPath = Column(
        String,
        nullable=True
    )

    ScheduledDate = Column(
        String(50),
        nullable=False
    )

    ScheduledTime = Column(
        String(50),
        nullable=False
    )

    Status = Column(
        String(50),
        default="Scheduled"
    )

    ApprovalRequired = Column(
        Boolean,
        default=False
    )

    CreatedAt = Column(
        DateTime,
        server_default=func.now()
    )