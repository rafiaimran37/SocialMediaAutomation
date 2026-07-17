from sqlalchemy import Column, Integer, String, DateTime
from app.config.database import Base


class User(Base):
    __tablename__ = "Users"

    Id = Column(Integer, primary_key=True, index=True)
    FullName = Column(String(100))
    Email = Column(String(100), unique=True, index=True)
    Password = Column(String(255))
    Role = Column(String(50))
    CreatedAt = Column(DateTime)