"""
MongoDB Collection Indexes Setup
NSS MJCET Nasha Mukti Abhiyaan
Ensures optimal query performance, unique constraints, and rapid lookups.
"""

import logging
from motor.motor_asyncio import AsyncIOMotorDatabase
import pymongo

logger = logging.getLogger("nmba_backend.indexes")


async def create_indexes(db: AsyncIOMotorDatabase) -> None:
    """Creates indexes for all core collections idempotently."""
    logger.info("Verifying and creating MongoDB indexes...")

    # admin_users
    await db["admin_users"].create_index([("email", pymongo.ASCENDING)], unique=True)
    await db["admin_users"].create_index([("role", pymongo.ASCENDING)])
    await db["admin_users"].create_index([("status", pymongo.ASCENDING)])

    # activities
    await db["activities"].create_index([("slug", pymongo.ASCENDING)], unique=True)
    await db["activities"].create_index([("id", pymongo.ASCENDING)], unique=True)
    await db["activities"].create_index([("publicationStatus", pymongo.ASCENDING)])
    await db["activities"].create_index([("category", pymongo.ASCENDING)])
    await db["activities"].create_index([("displayOrder", pymongo.ASCENDING)])

    # gallery_photos
    await db["gallery_photos"].create_index([("id", pymongo.ASCENDING)], unique=True)
    await db["gallery_photos"].create_index([("publicationStatus", pymongo.ASCENDING)])
    await db["gallery_photos"].create_index([("category", pymongo.ASCENDING)])
    await db["gallery_photos"].create_index([("displayOrder", pymongo.ASCENDING)])

    # developers
    await db["developers"].create_index([("id", pymongo.ASCENDING)], unique=True)
    await db["developers"].create_index([("publicationStatus", pymongo.ASCENDING)])
    await db["developers"].create_index([("displayOrder", pymongo.ASCENDING)])

    # quiz_questions
    await db["quiz_questions"].create_index([("id", pymongo.ASCENDING)], unique=True)
    await db["quiz_questions"].create_index([("publicationStatus", pymongo.ASCENDING)])
    await db["quiz_questions"].create_index([("displayOrder", pymongo.ASCENDING)])

    # quiz_attempts
    await db["quiz_attempts"].create_index([("attemptId", pymongo.ASCENDING)], unique=True)
    await db["quiz_attempts"].create_index([("submittedAt", pymongo.DESCENDING)])
    await db["quiz_attempts"].create_index([("participant.email", pymongo.ASCENDING)])

    # awareness_messages
    await db["awareness_messages"].create_index([("id", pymongo.ASCENDING)], unique=True)
    await db["awareness_messages"].create_index([("publicationStatus", pymongo.ASCENDING)])
    await db["awareness_messages"].create_index([("displayOrder", pymongo.ASCENDING)])

    # audit_logs
    await db["audit_logs"].create_index([("timestamp", pymongo.DESCENDING)])
    await db["audit_logs"].create_index([("actorEmail", pymongo.ASCENDING)])
    await db["audit_logs"].create_index([("module", pymongo.ASCENDING)])

    # site_settings
    await db["site_settings"].create_index([("key", pymongo.ASCENDING)], unique=True)

    # media_items
    await db["media_items"].create_index([("id", pymongo.ASCENDING)], unique=True)
    await db["media_items"].create_index([("category", pymongo.ASCENDING)])
    await db["media_items"].create_index([("createdAt", pymongo.DESCENDING)])

    logger.info("MongoDB indexes verified and ready.")
