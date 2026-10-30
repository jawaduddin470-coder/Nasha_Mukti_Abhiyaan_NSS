"""
MongoDB Async Connection Manager
NSS MJCET Nasha Mukti Abhiyaan
Manages connection lifecycle with connection pooling and TLS certificates.
"""

import asyncio
import logging
from typing import Optional
import certifi
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fastapi import HTTPException, status
from backend.app.core.config import settings

logger = logging.getLogger("nmba_backend.db")


class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None


db_manager = MongoDB()


def init_mongo_client() -> Optional[AsyncIOMotorDatabase]:
    """Initialize MongoDB Atlas client synchronously if not already initialized."""
    if not settings.MONGODB_URI or not settings.MONGODB_URI.strip():
        logger.warning("MONGODB_URI is not set. Database connection skipped.")
        return None

    try:
        if db_manager.client is not None:
            try:
                db_manager.client.close()
            except Exception:
                pass

        db_manager.client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000,
            maxPoolSize=20,
            minPoolSize=0,
        )
        db_manager.database = db_manager.client[settings.DATABASE_NAME]
        logger.info(f"Initialized MongoDB Atlas client: database='{settings.DATABASE_NAME}'")
        return db_manager.database
    except Exception as e:
        logger.error(f"Failed to initialize MongoDB Atlas client: {e}")
        return None


async def connect_to_mongo() -> None:
    """Initialize MongoDB Atlas connection pool and verify connectivity."""
    db = init_mongo_client()
    if db is not None:
        try:
            await db.command("ping")
            logger.info(f"Connected and pinged MongoDB Atlas: database='{settings.DATABASE_NAME}'")
        except Exception as e:
            logger.error(f"Failed to ping MongoDB Atlas: {e}")


async def close_mongo_connection() -> None:
    """Close MongoDB connection pool gracefully."""
    logger.info("Closing MongoDB connection pool...")
    if db_manager.client:
        try:
            db_manager.client.close()
        except Exception:
            pass
        db_manager.client = None
        db_manager.database = None
        logger.info("MongoDB connection closed.")


def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency to retrieve the active database instance with on-demand fallback."""
    current_loop = None
    try:
        current_loop = asyncio.get_running_loop()
    except RuntimeError:
        pass

    needs_reinit = False
    if db_manager.client is None or db_manager.database is None:
        needs_reinit = True
    elif hasattr(db_manager.client, "_io_loop") and db_manager.client._io_loop is not None:
        if db_manager.client._io_loop.is_closed():
            needs_reinit = True
        elif current_loop is not None and db_manager.client._io_loop != current_loop:
            needs_reinit = True

    if needs_reinit:
        init_mongo_client()

    if db_manager.database is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection is not initialized. Please verify MONGODB_URI in environment variables.",
        )
    return db_manager.database
