from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.config.database import Base


class PostStatus(Base):

    __tablename__ = "PostStatuses"

    Id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    PostId = Column(
        Integer,
        nullable=False
    )

    ClientId = Column(
        Integer,
        nullable=False
    )

    Platform = Column(
        String(50),
        nullable=False
    )

    Status = Column(
        String(50),
        nullable=False,
        default="Pending"
    )

    PlatformPostId = Column(
        String,
        nullable=True
    )

    ErrorMessage = Column(
        String,
        nullable=True
    )

    PublishedAt = Column(
        DateTime,
        nullable=True
    )

    CreatedAt = Column(
        DateTime,
        server_default=func.now()
    )