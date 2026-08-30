from google import genai

from app.config.settings import GEMINI_API_KEY
from app.services.image_generation_service import ImageGenerationService


class AIService:

    def __init__(self):
        # Gemini client for caption generation
        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )

        # Hugging Face image generation service
        self.image_service = ImageGenerationService()

    def generate_caption(
        self,
        topic,
        platform="Facebook",
        tone="Professional",
        targetAudience="General Audience",
        keywords=None
    ):

        keyword_text = ", ".join(keywords) if keywords else "None"

        prompt = f"""
Generate a social media caption.

Topic:
{topic}

Platform:
{platform}

Tone:
{tone}

Target Audience:
{targetAudience}

Keywords:
{keyword_text}

Include:
- Emojis
- Match the selected platform and tone
- 3-5 relevant hashtags

Only return the caption.
"""

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text

    def generate_social_content(
        self,
        topic,
        platform="Facebook",
        tone="Professional",
        targetAudience="General Audience",
        keywords=None
    ):

        # -----------------------------------
        # STEP 1: Generate caption using Gemini
        # -----------------------------------

        caption = self.generate_caption(
            topic=topic,
            platform=platform,
            tone=tone,
            targetAudience=targetAudience,
            keywords=keywords
        )

        # -----------------------------------
        # STEP 2: Generate related image
        # using the same topic + caption
        # -----------------------------------

        image_base64 = self.image_service.generate_image(
            topic=topic,
            caption=caption,
            platform=platform
        )

        # -----------------------------------
        # STEP 3: Return both
        # -----------------------------------

        return {
            "caption": caption,
            "image": image_base64
        }