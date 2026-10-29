"""
Central Media Library Router
NSS MJCET Nasha Mukti Abhiyaan
Manages upload, cataloging, search, selection, and deletion of media assets.
"""

import os
import uuid
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.permissions import require_editor_or_above
from backend.app.core.config import settings
from backend.app.db.mongodb import get_database
from backend.app.schemas.media import MediaItemResponse, MediaItemUpdate
from backend.app.utils.audit import record_audit_log

logger = logging.getLogger("nmba_backend.media")

router = APIRouter(prefix="/admin/media", tags=["Media Library"])

ALLOWED_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_FILE_SIZE_BYTES = settings.MAX_MEDIA_FILE_SIZE_MB * 1024 * 1024  # 10 MB


@router.post("/upload", response_model=MediaItemResponse, status_code=status.HTTP_201_CREATED)
async def upload_media_asset(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    category: Optional[str] = Form("general"),
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Uploads a new media asset, persists the file to storage,
    and indexes metadata in MongoDB media_items collection.
    """
    content_type = file.content_type or ""
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image type '{content_type}'. Allowed types: JPG, PNG, WEBP.",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {settings.MAX_MEDIA_FILE_SIZE_MB}MB.",
        )

    ext = ALLOWED_MIME_TYPES[content_type]
    unique_filename = f"{datetime.now().strftime('%Y%m%d')}_{uuid.uuid4().hex[:12]}{ext}"

    os.makedirs(settings.MEDIA_UPLOAD_DIR, exist_ok=True)
    destination_path = os.path.join(settings.MEDIA_UPLOAD_DIR, unique_filename)

    with open(destination_path, "wb") as f:
        f.write(contents)

    public_url = f"/uploads/{unique_filename}"
    now_iso = datetime.now(timezone.utc).isoformat()
    media_id = f"med-{uuid.uuid4().hex[:10]}"

    media_doc = {
        "id": media_id,
        "url": public_url,
        "filename": unique_filename,
        "originalName": file.filename or unique_filename,
        "title": (title.strip() if title else (file.filename or unique_filename)),
        "category": category or "general",
        "mimeType": content_type,
        "sizeBytes": len(contents),
        "uploadedBy": current_admin["email"],
        "createdAt": now_iso,
    }

    await db["media_items"].insert_one(media_doc)

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="upload_media_asset",
        module="media",
        record_id=media_id,
        metadata={"filename": unique_filename, "category": category, "sizeBytes": len(contents)},
    )

    media_doc["_id"] = str(media_doc.get("_id", ""))
    return MediaItemResponse(**media_doc)


@router.get("", response_model=List[MediaItemResponse])
async def list_media_assets(
    category: Optional[str] = Query(None),
    searchQuery: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0),
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Retrieves media assets from the Central Media Library with search and category filtering.
    """
    query: Dict[str, Any] = {}
    if category and category != "all":
        query["category"] = category
    if searchQuery and searchQuery.strip():
        q_regex = {"$regex": searchQuery.strip(), "$options": "i"}
        query["$or"] = [
            {"title": q_regex},
            {"originalName": q_regex},
            {"filename": q_regex},
        ]

    cursor = db["media_items"].find(query).sort("createdAt", -1).skip(skip).limit(limit)
    items = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(MediaItemResponse(**doc))
    return items


@router.delete("/{id}", status_code=status.HTTP_200_OK)
async def delete_media_asset(
    id: str,
    force: bool = Query(False),
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Deletes an asset from the Central Media Library and disk.
    Guards against deleting assets actively referenced by published content.
    """
    media_item = await db["media_items"].find_one({"id": id})
    if not media_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Media asset '{id}' not found.",
        )

    asset_url = media_item.get("url")

    # Check for references in activities, gallery, or developers
    if not force and asset_url:
        referencing_activities = await db["activities"].count_documents(
            {
                "$or": [
                    {"coverImage": asset_url},
                    {"galleryImages.url": asset_url},
                ]
            }
        )
        referencing_gallery = await db["gallery_photos"].count_documents({"imageUrl": asset_url})
        referencing_developers = await db["developers"].count_documents({"avatarUrl": asset_url})

        total_refs = referencing_activities + referencing_gallery + referencing_developers
        if total_refs > 0:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Media asset is referenced by {referencing_activities} activities, {referencing_gallery} gallery photos, and {referencing_developers} developers. Pass force=true to proceed with deletion.",
            )

    # Remove physical file if in uploads directory
    filename = media_item.get("filename")
    if filename:
        filepath = os.path.join(settings.MEDIA_UPLOAD_DIR, filename)
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception as e:
                logger.warning(f"Failed to remove physical file {filepath}: {e}")

    await db["media_items"].delete_one({"id": id})

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="delete_media_asset",
        module="media",
        record_id=id,
        metadata={"filename": filename, "url": asset_url},
    )

    return {"message": f"Media asset '{id}' deleted successfully."}
