"""
Developers Router
NSS MJCET Nasha Mukti Abhiyaan
Public contributor profiles and authorized Developer CMS management.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.permissions import require_editor_or_above
from backend.app.db.mongodb import get_database
from backend.app.schemas.developers import DeveloperResponse, DeveloperCreate, DeveloperUpdate
from backend.app.utils.audit import record_audit_log

router = APIRouter(tags=["Developers"])


# Public Endpoints
@router.get("/developers", response_model=List[DeveloperResponse])
async def list_public_developers(
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves all published developer and contributor profiles for the homepage."""
    cursor = db["developers"].find({"publicationStatus": "published"}).sort("displayOrder", 1)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(DeveloperResponse(**doc))
    return results


# Protected CMS Endpoints
@router.get("/admin/developers", response_model=List[DeveloperResponse])
async def list_all_developers_cms(
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves all contributor profiles across all publication statuses."""
    cursor = db["developers"].find().sort("displayOrder", 1)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(DeveloperResponse(**doc))
    return results


@router.post("/admin/developers", response_model=DeveloperResponse, status_code=status.HTTP_201_CREATED)
async def create_developer_cms(
    payload: DeveloperCreate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Adds a new contributor profile."""
    now_iso = datetime.now(timezone.utc).isoformat()
    dev_id = f"dev-{int(datetime.now().timestamp() * 1000) % 1000000:06d}"

    doc = payload.model_dump()
    doc["id"] = dev_id
    doc["createdAt"] = now_iso
    doc["updatedAt"] = now_iso

    await db["developers"].insert_one(doc)
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="create_developer_profile",
        module="developers",
        record_id=dev_id,
        metadata={"fullName": payload.fullName, "role": payload.role},
    )

    doc["_id"] = str(doc.get("_id", ""))
    return DeveloperResponse(**doc)


@router.put("/admin/developers/{id}", response_model=DeveloperResponse)
async def update_developer_cms(
    id: str,
    payload: DeveloperUpdate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Updates an existing developer profile, links, bio, or order."""
    target = await db["developers"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Developer '{id}' not found.")

    update_dict = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_dict["updatedAt"] = datetime.now(timezone.utc).isoformat()

    await db["developers"].update_one({"id": id}, {"$set": update_dict})
    updated_doc = await db["developers"].find_one({"id": id})

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="update_developer_profile",
        module="developers",
        record_id=id,
        metadata={"changes": list(update_dict.keys())},
    )

    updated_doc["_id"] = str(updated_doc["_id"])
    return DeveloperResponse(**updated_doc)


@router.delete("/admin/developers/{id}", status_code=status.HTTP_200_OK)
async def delete_developer_cms(
    id: str,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Deletes or archives a developer profile."""
    target = await db["developers"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Developer '{id}' not found.")

    await db["developers"].delete_one({"id": id})
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="delete_developer_profile",
        module="developers",
        record_id=id,
        metadata={"fullName": target.get("fullName")},
    )

    return {"message": f"Developer '{id}' has been removed successfully."}
