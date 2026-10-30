"""
MongoDB Async Connection Manager
NSS MJCET Nasha Mukti Abhiyaan
Manages connection lifecycle with connection pooling and TLS certificates.
"""

import logging
from typing import Optional
import certifi
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from backend.app.core.config import settings

logger = logging.getLogger("nmba_backend.db")


class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None


db_manager = MongoDB()


async def connect_to_mongo() -> None:
    """Initialize MongoDB Atlas connection pool."""
    if not settings.MONGODB_URI or not settings.MONGODB_URI.strip():
        logger.warning("MONGODB_URI is not set. Database connection skipped.")
        return

    logger.info("Connecting to MongoDB Atlas...")
    try:
        db_manager.client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000,
            maxPoolSize=20,
            minPoolSize=1,
        )
        db_manager.database = db_manager.client[settings.DATABASE_NAME]
        # Verify connection with ping
        await db_manager.database.command("ping")
        logger.info(f"Connected to MongoDB Atlas: database='{settings.DATABASE_NAME}'")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB Atlas: {e}")


async def close_mongo_connection() -> None:
    """Close MongoDB connection pool gracefully."""
    logger.info("Closing MongoDB connection pool...")
    if db_manager.client:
        db_manager.client.close()
        logger.info("MongoDB connection closed.")


def get_database() -> AsyncIOMotorDatabase:
    """FastAPI dependency to retrieve the active database instance."""
    if db_manager.database is None:
        raise RuntimeError("MongoDB connection is not initialized.")
    return db_manager.database
