import os
import base64
from io import BytesIO

from huggingface_hub import InferenceClient

from app.config.settings import HUGGINGFACE_API_KEY


class ImageGenerationService:

    def __init__(self):
        if not HUGGINGFACE_API_KEY:
            raise ValueError(
                "HUGGINGFACE_API_KEY is not configured."
            )

        self.client = InferenceClient(
            provider="auto",
            api_key=HUGGINGFACE_API_KEY
        )

    def generate_image(
        self,
        topic: str,
        caption: str | None = None,
        platform: str | None = None,
    ):
        """
        Generate a social media image using Hugging Face.
        Returns the image as base64.
        """

        prompt = f"""
Create a high-quality social media marketing image.

Topic:
{topic}

Caption:
{caption or "None"}

Platform:
{platform or "Social Media"}

Requirements:
- Create a visually attractive image related to the topic.
- Suitable for a professional social media post.
- Modern and clean visual style.
- The image should complement the caption.
- Avoid unnecessary text inside the image.
- Do not add watermarks.
- Make the subject visually clear.
"""

        image = self.client.text_to_image(
            prompt=prompt,
            model="black-forest-labs/FLUX.1-schnell"
        )

        # Convert PIL image to PNG bytes
        image_bytes = BytesIO()
        image.save(image_bytes, format="PNG")

        # Convert PNG bytes to base64
        image_base64 = base64.b64encode(
            image_bytes.getvalue()
        ).decode("utf-8")

        return image_base64