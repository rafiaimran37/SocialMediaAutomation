from google import genai
from app.config.settings import GEMINI_API_KEY

class AIService:

    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)

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