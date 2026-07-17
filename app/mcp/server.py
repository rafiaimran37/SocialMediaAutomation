from fastapi import APIRouter

from app.models.publish_request import PublishRequest
from app.services.ai_service import AIService

from app.mcp.tools import (
    publish_facebook,
    publish_instagram,
    publish_linkedin,
)

router = APIRouter()

ai = AIService()


@router.post("/publish")

def publish(request: PublishRequest):

    caption = ai.generate_caption(request.message)

    facebook = publish_facebook(caption)

    linkedin = publish_linkedin(caption)

    instagram = publish_instagram(caption)

    return {

        "generated_caption": caption,

        "facebook": facebook,

        "linkedin": linkedin,

        "instagram": instagram

    }