from fastapi import APIRouter
from app.services.linkedin_service import LinkedInService

router = APIRouter()

linkedin = LinkedInService()

@router.get("/linkedin/test")
def test():

    return linkedin.create_post(
        "Hello LinkedIn"
    )