from dotenv import load_dotenv
import os
from urllib.parse import urlparse

load_dotenv()

# Facebook Settings
FACEBOOK_APP_ID = os.getenv("FACEBOOK_APP_ID")
FACEBOOK_APP_SECRET = os.getenv("FACEBOOK_APP_SECRET")
FACEBOOK_ACCESS_TOKEN = os.getenv("FACEBOOK_ACCESS_TOKEN")
FACEBOOK_PAGE_ID = os.getenv("FACEBOOK_PAGE_ID")
FACEBOOK_REDIRECT_URI = os.getenv("FACEBOOK_REDIRECT_URI")

# Instagram Settings
INSTAGRAM_APP_ID = os.getenv("INSTAGRAM_APP_ID")
print("INSTAGRAM_APP_ID:", INSTAGRAM_APP_ID)
INSTAGRAM_APP_SECRET = os.getenv("INSTAGRAM_APP_SECRET")
INSTAGRAM_REDIRECT_URI = os.getenv("INSTAGRAM_REDIRECT_URI")

# LinkedIn Settings
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
LINKEDIN_REDIRECT_URI = os.getenv("LINKEDIN_REDIRECT_URI")

# Gemini AI Settings
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


def _public_base_from_redirect_uri(redirect_uri: str | None):
	if not redirect_uri:
		return None

	parsed = urlparse(redirect_uri)

	if not parsed.scheme or not parsed.netloc:
		return None

	return f"{parsed.scheme}://{parsed.netloc}"


PUBLIC_MEDIA_BASE_URL = (
	_public_base_from_redirect_uri(FACEBOOK_REDIRECT_URI)
	or _public_base_from_redirect_uri(INSTAGRAM_REDIRECT_URI)
	or _public_base_from_redirect_uri(LINKEDIN_REDIRECT_URI)
	or "https://geek-jimmy-spinner.ngrok-free.dev"
)


# SQL Server Settings
DB_SERVER = os.getenv("DB_SERVER")
DB_NAME = os.getenv("DB_NAME")
DB_DRIVER = os.getenv("DB_DRIVER")
DB_TRUSTED_CONNECTION = os.getenv("DB_TRUSTED_CONNECTION")
DB_TRUST_SERVER_CERTIFICATE = os.getenv("DB_TRUST_SERVER_CERTIFICATE")