from typing import List

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai_service import AIService

router = APIRouter()

ai = AIService()


class AIGenerateRequest(BaseModel):
    topic: str | None = ""
    platform: str | None = ""
    tone: str | None = ""
    targetAudience: str | None = ""
    keywords: List[str] = []


@router.post("/ai/generate")
def generate(request: AIGenerateRequest):

    caption = ai.generate_caption(
        request.topic,
        request.platform,
        request.tone,
        request.targetAudience,
        request.keywords,
    )

    return {
        "generatedCaption": caption
    }