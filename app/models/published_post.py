from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.config.database import Base


class PublishedPost(Base):

    __tablename__ = "PublishedPosts"


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
        String,
        nullable=False
    )


    Message = Column(
        String,
        nullable=False
    )


    PostId = Column(
        String,
        nullable=True
    )


    Status = Column(
        String,
        default="Published"
    )


    CreatedAt = Column(
        DateTime,
        default=datetime.utcnow
    )