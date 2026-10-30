"""
FastAPI Main Application Entrypoint
NSS MJCET Nasha Mukti Abhiyaan Backend API
"""

import sys
import os
import types

# Ensure 'backend' namespace is available even when Vercel deploys with root='backend'
if "backend" not in sys.modules:
    _current_dir = os.path.dirname(os.path.abspath(__file__))
    _backend_dir = os.path.dirname(_current_dir) if os.path.basename(_current_dir) == "app" else _current_dir
    _pkg = types.ModuleType("backend")
    _pkg.__path__ = [_backend_dir]
    sys.modules["backend"] = _pkg
    if _backend_dir not in sys.path:
        sys.path.insert(0, _backend_dir)

from contextlib import asynccontextmanager
import logging
import base64
from fastapi import FastAPI, status, Depends, HTTPException
from fastapi.responses import FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.config import settings
from backend.app.db.mongodb import connect_to_mongo, close_mongo_connection, db_manager, get_database
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
    try:
        os.makedirs(settings.MEDIA_UPLOAD_DIR, exist_ok=True)
    except OSError:
        try:
            os.makedirs("/tmp/uploads", exist_ok=True)
        except OSError:
            pass

    # Connect to MongoDB Atlas
    await connect_to_mongo()
    # Verify indexes
    if db_manager.database is not None:
        try:
            await create_indexes(db_manager.database)
        except Exception as e:
            logger.warning(f"Index creation warning: {e}")

    logger.info("NSS MJCET Backend initialized successfully.")

    yield

    logger.info("Shutting down NSS MJCET Backend...")
    try:
        await close_mongo_connection()
    except Exception as e:
        logger.warning(f"Shutdown warning: {e}")
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

# Resilient image serving handler with filesystem and MongoDB binary fallback
@app.get("/uploads/{filename:path}", tags=["Media"])
@app.get("/api/v1/uploads/{filename:path}", tags=["Media"])
async def serve_uploaded_media(
    filename: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Serves uploaded and static assets reliably across serverless environments.
    Checks candidate local filesystem directories first, falling back to
    MongoDB 'uploaded_images' binary persistence for ephemeral lambda instances.
    """
    clean_filename = os.path.basename(filename)
    if not clean_filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    # 1. Search candidate directories on filesystem
    candidate_dirs = [
        "/tmp/uploads",
        os.path.abspath(settings.MEDIA_UPLOAD_DIR),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../uploads")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../uploads")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../public/uploads")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../public")),
    ]
    for directory in candidate_dirs:
        file_path = os.path.join(directory, clean_filename)
        if os.path.isfile(file_path):
            return FileResponse(file_path, headers={"Cache-Control": "public, max-age=31536000, immutable"})

    # 2. Query MongoDB uploaded_images for database-backed persistence
    if db is not None:
        try:
            doc = await db["uploaded_images"].find_one({"filename": clean_filename})
            if doc and "data" in doc:
                raw_data = doc["data"]
                if isinstance(raw_data, str):
                    raw_data = base64.b64decode(raw_data)
                content_type = doc.get("contentType") or doc.get("mimeType")
                if not content_type:
                    ext = os.path.splitext(clean_filename)[1].lower()
                    content_type = "image/png" if ext == ".png" else "image/webp" if ext == ".webp" else "image/jpeg"
                return Response(
                    content=raw_data,
                    media_type=content_type,
                    headers={
                        "Cache-Control": "public, max-age=31536000, immutable",
                        "Content-Disposition": f'inline; filename="{clean_filename}"',
                    },
                )
        except Exception as e:
            logger.warning(f"Error serving {clean_filename} from MongoDB: {e}")

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")


# Health & Readiness Endpoints
@app.get("/", status_code=status.HTTP_200_OK, tags=["System"])
@app.get("/health", status_code=status.HTTP_200_OK, tags=["System"])
@app.get("/api/v1/health", status_code=status.HTTP_200_OK, tags=["System"])
async def health_check():
    """Health check endpoint indicating service availability and database status."""
    db_connected = False
    diag_detail = None
    if db_manager.database is not None:
        try:
            await db_manager.database.command("ping")
            db_connected = True
        except Exception as e:
            db_connected = False
            diag_detail = f"Ping failed: {e}"
    elif not settings.MONGODB_URI:
        diag_detail = "MONGODB_URI is not set in environment variables."
    else:
        diag_detail = "Database client not connected."

    return {
        "status": "healthy" if db_connected else "degraded",
        "service": "nss-mjcet-nasha-mukti-backend",
        "version": "1.0.0",
        "database": "connected" if db_connected else "disconnected",
        "database_name": settings.DATABASE_NAME if db_connected else None,
        "environment": settings.ENVIRONMENT,
        "detail": diag_detail,
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
