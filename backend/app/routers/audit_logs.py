"""
Audit Logs Router (SUPER_ADMIN Only)
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.permissions import require_super_admin
from backend.app.db.mongodb import get_database

router = APIRouter(prefix="/admin/audit-logs", tags=["Audit Logs"])


@router.get("")
async def list_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0),
    current_admin: Dict[str, Any] = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves chronological security and administrative action logs."""
    cursor = db["audit_logs"].find().sort("timestamp", -1).skip(skip).limit(limit)
    total = await db["audit_logs"].count_documents({})
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return {"total": total, "items": items, "limit": limit, "skip": skip}
