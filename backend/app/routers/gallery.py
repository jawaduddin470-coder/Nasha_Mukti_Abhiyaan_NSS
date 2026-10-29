"""
Gallery Photos Router
NSS MJCET Nasha Mukti Abhiyaan
Public photo wall and authorized Gallery CMS management.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.permissions import require_editor_or_above
from backend.app.db.mongodb import get_database
from backend.app.schemas.gallery import GalleryPhotoResponse, GalleryPhotoCreate, GalleryPhotoUpdate
from backend.app.utils.audit import record_audit_log

router = APIRouter(tags=["Gallery"])


# Public Endpoints
@router.get("/gallery", response_model=List[GalleryPhotoResponse])
async def list_public_gallery_photos(
    category: Optional[str] = Query(None),
    featuredOnly: Optional[bool] = Query(False),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves published photographs for the public 3D wall and list view."""
    query: Dict[str, Any] = {"publicationStatus": "published"}

    if category and category != "all":
        query["category"] = category
    if featuredOnly:
        query["featuredIn3D"] = True

    cursor = db["gallery_photos"].find(query).sort("displayOrder", 1)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(GalleryPhotoResponse(**doc))
    return results


@router.get("/gallery/{id}", response_model=GalleryPhotoResponse)
async def get_public_gallery_photo(
    id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves a single published photograph by ID."""
    doc = await db["gallery_photos"].find_one({"id": id, "publicationStatus": "published"})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Photograph '{id}' not found.")
    doc["_id"] = str(doc["_id"])
    return GalleryPhotoResponse(**doc)


# Protected CMS Endpoints
@router.get("/admin/gallery", response_model=List[GalleryPhotoResponse])
async def list_all_gallery_photos_cms(
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves all gallery photographs across all publication statuses."""
    cursor = db["gallery_photos"].find().sort([("displayOrder", 1), ("createdAt", -1)])
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(GalleryPhotoResponse(**doc))
    return results


@router.post("/admin/gallery", response_model=GalleryPhotoResponse, status_code=status.HTTP_201_CREATED)
async def create_gallery_photo_cms(
    payload: GalleryPhotoCreate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Adds a new photograph to the gallery catalog."""
    now_iso = datetime.now(timezone.utc).isoformat()
    photo_id = f"gal-{int(datetime.now().timestamp() * 1000) % 1000000:06d}"

    doc = payload.model_dump()
    doc["id"] = photo_id
    doc["createdAt"] = now_iso
    doc["updatedAt"] = now_iso

    await db["gallery_photos"].insert_one(doc)
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="create_gallery_photo",
        module="gallery",
        record_id=photo_id,
        metadata={"title": payload.title, "category": payload.category},
    )

    doc["_id"] = str(doc.get("_id", ""))
    return GalleryPhotoResponse(**doc)


@router.put("/admin/gallery/{id}", response_model=GalleryPhotoResponse)
async def update_gallery_photo_cms(
    id: str,
    payload: GalleryPhotoUpdate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Updates metadata, caption, category, or order for a photograph."""
    target = await db["gallery_photos"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Photograph '{id}' not found.")

    update_dict = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_dict["updatedAt"] = datetime.now(timezone.utc).isoformat()

    await db["gallery_photos"].update_one({"id": id}, {"$set": update_dict})
    updated_doc = await db["gallery_photos"].find_one({"id": id})

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="update_gallery_photo",
        module="gallery",
        record_id=id,
        metadata={"changes": list(update_dict.keys())},
    )

    updated_doc["_id"] = str(updated_doc["_id"])
    return GalleryPhotoResponse(**updated_doc)


@router.delete("/admin/gallery/{id}", status_code=status.HTTP_200_OK)
async def delete_gallery_photo_cms(
    id: str,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Permanently deletes or archives a photograph record."""
    target = await db["gallery_photos"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Photograph '{id}' not found.")

    await db["gallery_photos"].delete_one({"id": id})
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="delete_gallery_photo",
        module="gallery",
        record_id=id,
        metadata={"title": target.get("title")},
    )

    return {"message": f"Photograph '{id}' has been deleted successfully."}
