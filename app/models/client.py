from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.config.database import Base


class Client(Base):
    __tablename__ = "Clients"

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

    ClientName = Column(
        String(150),
        nullable=False
    )

    Status = Column(
        String(50),
        default="Active"
    )

    CreatedAt = Column(
        DateTime,
        server_default=func.now()
    )