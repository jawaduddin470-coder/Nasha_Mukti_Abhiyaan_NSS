"""
Awareness Messages Router
NSS MJCET Nasha Mukti Abhiyaan
Serves dynamic post-quiz awareness messages and enables Super Admin management.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.permissions import require_editor_or_above
from backend.app.db.mongodb import get_database
from backend.app.schemas.awareness_messages import (
    AwarenessMessageResponse,
    AwarenessMessageCreate,
    AwarenessMessageUpdate,
)
from backend.app.utils.audit import record_audit_log

router = APIRouter(tags=["Awareness Messages"])


# Public Endpoint
@router.get("/awareness-messages", response_model=List[AwarenessMessageResponse])
async def list_published_awareness_messages(
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves all published awareness messages for end-of-quiz presentation."""
    cursor = db["awareness_messages"].find({"publicationStatus": "published"}).sort("displayOrder", 1)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(AwarenessMessageResponse(**doc))
    return results


# Protected CMS Endpoints
@router.get("/admin/awareness-messages", response_model=List[AwarenessMessageResponse])
async def list_all_awareness_messages_cms(
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves all awareness messages across draft, published, and archived states."""
    cursor = db["awareness_messages"].find().sort("displayOrder", 1)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(AwarenessMessageResponse(**doc))
    return results


@router.post("/admin/awareness-messages", response_model=AwarenessMessageResponse, status_code=status.HTTP_201_CREATED)
async def create_awareness_message_cms(
    payload: AwarenessMessageCreate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Creates a new post-quiz awareness message."""
    now_iso = datetime.now(timezone.utc).isoformat()
    msg_id = f"msg-{int(datetime.now().timestamp() * 1000) % 1000000}"

    doc = payload.model_dump()
    doc["id"] = msg_id
    doc["createdAt"] = now_iso
    doc["updatedAt"] = now_iso

    await db["awareness_messages"].insert_one(doc)
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="create_awareness_message",
        module="awareness_messages",
        record_id=msg_id,
        metadata={"title": payload.title, "category": payload.category},
    )

    doc["_id"] = str(doc.get("_id", ""))
    return AwarenessMessageResponse(**doc)


@router.put("/admin/awareness-messages/{id}", response_model=AwarenessMessageResponse)
async def update_awareness_message_cms(
    id: str,
    payload: AwarenessMessageUpdate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Updates an awareness message title, body, call-to-action, or status."""
    target = await db["awareness_messages"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Awareness message '{id}' not found.")

    update_dict = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_dict["updatedAt"] = datetime.now(timezone.utc).isoformat()

    await db["awareness_messages"].update_one({"id": id}, {"$set": update_dict})
    updated_doc = await db["awareness_messages"].find_one({"id": id})

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="update_awareness_message",
        module="awareness_messages",
        record_id=id,
        metadata={"changes": list(update_dict.keys())},
    )

    updated_doc["_id"] = str(updated_doc["_id"])
    return AwarenessMessageResponse(**updated_doc)


@router.delete("/admin/awareness-messages/{id}", status_code=status.HTTP_200_OK)
async def delete_awareness_message_cms(
    id: str,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Permanently deletes an awareness message."""
    target = await db["awareness_messages"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Awareness message '{id}' not found.")

    await db["awareness_messages"].delete_one({"id": id})
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="delete_awareness_message",
        module="awareness_messages",
        record_id=id,
        metadata={"title": target.get("title")},
    )

    return {"message": f"Awareness message '{id}' has been removed successfully."}
