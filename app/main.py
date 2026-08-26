from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.controllers.client_controller import router as client_router

from pathlib import Path

from app.controllers.facebook_controller import router as facebook_router
from app.controllers.linkedin_controller import router as linkedin_router
from app.controllers.instagram_controller import router as instagram_router

from app.mcp.server import router as mcp_router
from app.controllers.ai_controller import router as ai_router
from app.controllers.auth_controller import router as auth_router

from app.controllers.facebook_auth_controller import router as facebook_auth_router
from app.controllers.instagram_auth_controller import router as instagram_auth_router
from app.controllers.linkedin_auth_controller import router as linkedin_auth_router

from app.controllers.social_account_controller import router as social_account_router

from app.controllers.published_post_controller import router as published_post_router
from app.controllers.approval_queue_controller import router as approval_queue_router
from app.controllers.scheduled_post_controller import router as scheduled_post_router

from app.models import published_post
from app.models import approval_queue
from app.models import scheduled_post
from app.models import scheduled_post_client


from app.scheduler.scheduler import start_scheduler, shutdown_scheduler

from app.config.database import (
    Base,
    engine,
    ensure_media_columns,
    ensure_clients_table
)


# Create the FastAPI application instance with API metadata.
app = FastAPI(
    title="Social Media Automation API",
    description="Enterprise backend for social media automation and integration workflows.",
    version="1.0.0",
)


# ==============================
# Uploads
# ==============================

UPLOAD_ROOT = Path(__file__).resolve().parent / "uploads"

UPLOAD_ROOT.mkdir(
    parents=True,
    exist_ok=True
)

app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOAD_ROOT)),
    name="uploads"
)


# ==============================
# Application Startup
# ==============================

@app.on_event("startup")
def startup_event():

    ensure_media_columns()

    ensure_clients_table()

    start_scheduler()


# ==============================
# Application Shutdown
# ==============================

@app.on_event("shutdown")
def shutdown_event():

    shutdown_scheduler()


# ==============================
# Create Database Tables
# ==============================

Base.metadata.create_all(
    bind=engine
)


# ==============================
# CORS
# ==============================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==============================
# Routers
# ==============================

app.include_router(
    facebook_router
)

app.include_router(
    linkedin_router
)

app.include_router(
    instagram_router
)

app.include_router(
    mcp_router
)

app.include_router(
    ai_router
)

app.include_router(
    auth_router
)

app.include_router(
    facebook_auth_router
)

app.include_router(
    social_account_router
)

app.include_router(
    instagram_auth_router
)

app.include_router(
    linkedin_auth_router
)

app.include_router(
    published_post_router
)

app.include_router(
    approval_queue_router
)

app.include_router(
    scheduled_post_router
)

app.include_router(client_router)

# ==============================
# Root Health Endpoint
# ==============================

@app.get("/")
async def root() -> dict[str, str]:

    return {
        "status": "running",
        "project": "Social Media Automation API",
        "message": "Welcome to Social Media Automation Backend",
    }