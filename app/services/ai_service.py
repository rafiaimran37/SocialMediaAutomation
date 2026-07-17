from google import genai
from app.config.settings import GEMINI_API_KEY


class AIService:

    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)

    def generate_caption(self, topic):

        prompt = f"""
Generate a professional social media caption.

Topic:
{topic}

Include:
- Emojis
- Marketing tone
- 3-5 hashtags

Only return the caption.
"""

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text