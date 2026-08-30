from typing import List

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.ai_service import AIService


router = APIRouter()

ai = AIService()


class AIGenerateRequest(BaseModel):

    topic: str | None = ""

    platform: str | None = ""

    tone: str | None = ""

    targetAudience: str | None = ""

    keywords: List[str] = Field(
        default_factory=list
    )


@router.post("/ai/generate")
def generate(request: AIGenerateRequest):

    result = ai.generate_social_content(

        topic=request.topic,

        platform=request.platform,

        tone=request.tone,

        targetAudience=request.targetAudience,

        keywords=request.keywords,
    )

    return {
        "generatedCaption": result["caption"],
        "generatedImage": result["image"]
    }