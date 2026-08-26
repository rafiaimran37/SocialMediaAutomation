from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.published_post import PublishedPost


router = APIRouter()


@router.get("/published-posts")
def get_published_posts(
    db: Session = Depends(get_db)
):

    posts = db.query(
        PublishedPost
    ).all()


    return posts