from fastapi import APIRouter
from app.services.facebook_service import FacebookService

router = APIRouter()

facebook = FacebookService()

@router.get("/facebook/test")
def test():

    return facebook.create_post(
        "Hello Facebook"
    )