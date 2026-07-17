from fastapi import APIRouter
from app.services.instagram_service import InstagramService

router = APIRouter()

instagram = InstagramService()

@router.get("/instagram/test")
def test():

    return instagram.create_post(
        "Hello Instagram"
    )