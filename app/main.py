"""FastAPI application entrypoint for SocialMediaAutomation.

This module defines the ASGI application object that Uvicorn will serve.
"""

from fastapi import FastAPI
from app.controllers.facebook_controller import router as facebook_router
from app.controllers.linkedin_controller import router as linkedin_router
from app.controllers.instagram_controller import router as instagram_router
from app.mcp.server import router as mcp_router
from app.controllers.ai_controller import router as ai_router
from app.controllers.auth_controller import router as auth_router
from fastapi.middleware.cors import CORSMiddleware


# Create the FastAPI application instance with API metadata.
app = FastAPI(
    title="Social Media Automation API",
    description="Enterprise backend for social media automation and integration workflows.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(facebook_router)
app.include_router(linkedin_router)
app.include_router(instagram_router)
app.include_router(mcp_router)
app.include_router(ai_router)
app.include_router(auth_router)
# Root health/welcome endpoint used to verify the service is running.
@app.get("/")
async def root() -> dict[str, str]:
    return {
        "status": "running",
        "project": "Social Media Automation API",
        "message": "Welcome to Social Media Automation Backend",
    }
