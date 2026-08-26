from sqlalchemy import Column, Integer, ForeignKey

from app.config.database import Base


class ScheduledPostClient(Base):

    __tablename__ = "ScheduledPostClients"

    Id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    ScheduledPostId = Column(
        Integer,
        ForeignKey("ScheduledPosts.Id"),
        nullable=False
    )

    ClientId = Column(
        Integer,
        ForeignKey("Clients.Id"),
        nullable=False
    )