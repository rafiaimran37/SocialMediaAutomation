from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.config.database import Base


class Post(Base):

    __tablename__ = "Posts"

    Id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    UserId = Column(
        Integer,
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

    CreatedAt = Column(
        DateTime,
        server_default=func.now()
    )