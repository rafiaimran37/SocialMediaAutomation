from fastapi import APIRouter
from app.models.publish_request import PublishRequest
from app.services.ai_service import AIService

router = APIRouter()

ai = AIService()


@router.post("/ai/caption")
def generate(request: PublishRequest):

    caption = ai.generate_caption(request.message)

    return {
        "caption": caption
    }