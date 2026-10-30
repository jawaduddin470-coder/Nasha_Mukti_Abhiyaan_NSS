"""
FastAPI Main Application Entrypoint
NSS MJCET Nasha Mukti Abhiyaan Backend API
"""

import os
from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.db.mongodb import connect_to_mongo, close_mongo_connection, db_manager
from backend.app.db.indexes import create_indexes
from backend.app.routers import (
    auth,
    admin_users,
    activities,
    gallery,
    developers,
    quiz,
    awareness_messages,
    analytics,
    audit_logs,
    settings as site_settings,
    uploads,
    media,
    homepage,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("nmba_backend.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for startup and shutdown events."""
    logger.info("Initializing NSS MJCET Backend...")
    # Ensure media directory exists
    os.makedirs(settings.MEDIA_UPLOAD_DIR, exist_ok=True)
    # Connect to MongoDB Atlas
    await connect_to_mongo()
    # Verify indexes
    if db_manager.database is not None:
        await create_indexes(db_manager.database)
    logger.info("NSS MJCET Backend initialized successfully.")

    yield

    logger.info("Shutting down NSS MJCET Backend...")
    await close_mongo_connection()
    logger.info("NSS MJCET Backend shutdown complete.")


app = FastAPI(
    title="NSS MJCET Nasha Mukti Abhiyaan API",
    description="Production-grade REST API and Content Management System for collegiate substance awareness and prevention.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory for media uploads
uploads_dir = os.path.abspath(settings.MEDIA_UPLOAD_DIR)
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


# Health & Readiness Endpoints
@app.get("/health", status_code=status.HTTP_200_OK, tags=["System"])
@app.get("/api/v1/health", status_code=status.HTTP_200_OK, tags=["System"])
async def health_check():
    """Health check endpoint indicating service availability and database status."""
    db_connected = False
    if db_manager.database is not None:
        try:
            await db_manager.database.command("ping")
            db_connected = True
        except Exception:
            db_connected = False

    return {
        "status": "healthy" if db_connected else "degraded",
        "service": "nss-mjcet-nasha-mukti-backend",
        "version": "1.0.0",
        "database": "connected" if db_connected else "disconnected",
        "environment": settings.ENVIRONMENT,
    }


# Register Versioned API Routers
API_V1_PREFIX = "/api/v1"
app.include_router(auth.router, prefix=API_V1_PREFIX)
app.include_router(admin_users.router, prefix=API_V1_PREFIX)
app.include_router(activities.router, prefix=API_V1_PREFIX)
app.include_router(gallery.router, prefix=API_V1_PREFIX)
app.include_router(developers.router, prefix=API_V1_PREFIX)
app.include_router(quiz.router, prefix=API_V1_PREFIX)
app.include_router(awareness_messages.router, prefix=API_V1_PREFIX)
app.include_router(analytics.router, prefix=API_V1_PREFIX)
app.include_router(audit_logs.router, prefix=API_V1_PREFIX)
app.include_router(site_settings.router, prefix=API_V1_PREFIX)
app.include_router(uploads.router, prefix=API_V1_PREFIX)
app.include_router(media.router, prefix=API_V1_PREFIX)
app.include_router(homepage.router, prefix=API_V1_PREFIX)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
