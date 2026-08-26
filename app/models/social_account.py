from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class SocialAccount(Base):
    __tablename__ = "SocialAccounts"

    Id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    UserId = Column(
        Integer,
        ForeignKey("Users.Id"),
        nullable=False
    )

    ClientId = Column(
    Integer,
    ForeignKey("Clients.Id"),
    nullable=True
   )

    Platform = Column(
        String(50),
        nullable=False
    )

    AccessToken = Column(
        String,
        nullable=False
    )

    PageId = Column(
        String(100),
        nullable=True
    )

    FacebookUserId = Column(
        String(100),
        nullable=True
    )

    AccountName = Column(
        String(100),
        nullable=True
    )

    Email = Column(
        String(150),
        nullable=True
    )

    Status = Column(
        String(50),
        default="Connected"
    )

    CreatedAt = Column(
        DateTime,
        server_default=func.now()
    )