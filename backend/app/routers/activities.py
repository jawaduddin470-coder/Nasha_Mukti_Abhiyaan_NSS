"""
Activities Router
NSS MJCET Nasha Mukti Abhiyaan
Public activity browsing and authorized CMS management.
"""

import os
import re
import uuid
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.permissions import require_editor_or_above
from backend.app.core.config import settings
from backend.app.db.mongodb import get_database
from backend.app.schemas.activities import ActivityResponse, ActivityCreate, ActivityUpdate
from backend.app.utils.audit import record_audit_log

logger = logging.getLogger("nmba_backend.activities")

router = APIRouter(tags=["Activities"])


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    return s.strip("-")


# Public Endpoints
@router.get("/activities", response_model=List[ActivityResponse])
async def list_public_activities(
    category: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    featuredOnly: Optional[bool] = Query(False),
    searchQuery: Optional[str] = Query(None),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves all published campaign activities for public viewing."""
    query: Dict[str, Any] = {"publicationStatus": {"$in": ["published", "Published"]}}

    if category and category != "all":
        query["category"] = category
    if status_filter and status_filter != "all":
        query["status"] = {"$regex": f"^{re.escape(status_filter)}$", "$options": "i"}
    if featuredOnly:
        query["featured"] = True
    if searchQuery and searchQuery.strip():
        q_regex = {"$regex": searchQuery.strip(), "$options": "i"}
        query["$or"] = [
            {"title": q_regex},
            {"summary": q_regex},
            {"venue": q_regex},
            {"tags": q_regex},
        ]

    cursor = db["activities"].find(query).sort("displayOrder", 1)
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(ActivityResponse(**doc))
    return results


@router.get("/activities/{slug}", response_model=ActivityResponse)
async def get_public_activity_by_slug(
    slug: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves a single published activity by its unique SEO slug or ID."""
    doc = await db["activities"].find_one({
        "$or": [{"slug": slug}, {"id": slug}],
        "publicationStatus": {"$in": ["published", "Published"]},
    })
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Activity '{slug}' not found.",
        )
    doc["_id"] = str(doc["_id"])
    return ActivityResponse(**doc)


# Protected CMS Endpoints (SUPER_ADMIN or EDITOR)
@router.get("/admin/activities", response_model=List[ActivityResponse])
async def list_all_activities_cms(
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves all activities across all publication states (draft, published, archived)."""
    cursor = db["activities"].find().sort([("displayOrder", 1), ("createdAt", -1)])
    results = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        results.append(ActivityResponse(**doc))
    return results


@router.get("/admin/activities/{id}", response_model=ActivityResponse)
async def get_activity_cms(
    id: str,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves an activity record by ID regardless of publication status."""
    doc = await db["activities"].find_one({"id": id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Activity '{id}' not found.")
    doc["_id"] = str(doc["_id"])
    return ActivityResponse(**doc)


@router.post("/admin/activities", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
async def create_activity_cms(
    payload: ActivityCreate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Creates a new activity record. Validates <= 5 images total."""
    slug = payload.slug.strip() if payload.slug else slugify(payload.title)
    existing = await db["activities"].find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{uuid.uuid4().hex[:6]}"

    now_iso = datetime.now(timezone.utc).isoformat()
    activity_id = f"act-{slugify(payload.title)[:20]}-{int(datetime.now().timestamp())}-{uuid.uuid4().hex[:6]}"

    doc = payload.model_dump()
    doc["id"] = activity_id
    doc["slug"] = slug
    doc["createdAt"] = now_iso
    doc["updatedAt"] = now_iso

    await db["activities"].insert_one(doc)
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="create_activity",
        module="activities",
        record_id=activity_id,
        metadata={"title": payload.title, "publicationStatus": payload.publicationStatus},
    )

    doc["_id"] = str(doc.get("_id", ""))
    return ActivityResponse(**doc)


@router.put("/admin/activities/{id}", response_model=ActivityResponse)
async def update_activity_cms(
    id: str,
    payload: ActivityUpdate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Updates an existing activity record. Enforces maximum 5 images."""
    target = await db["activities"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Activity '{id}' not found.")

    update_dict = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_dict["updatedAt"] = datetime.now(timezone.utc).isoformat()

    # Re-verify image limit across partial updates
    cover_image = update_dict.get("coverImage", target.get("coverImage"))
    gallery_images = update_dict.get("galleryImages", target.get("galleryImages", []))
    total_imgs = (1 if cover_image else 0) + len(gallery_images)
    if total_imgs > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An activity may have at most 5 total images. Found {total_imgs}.",
        )

    await db["activities"].update_one({"id": id}, {"$set": update_dict})
    updated_doc = await db["activities"].find_one({"id": id})

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="update_activity",
        module="activities",
        record_id=id,
        metadata={"changes": list(update_dict.keys())},
    )

    updated_doc["_id"] = str(updated_doc["_id"])
    return ActivityResponse(**updated_doc)


async def cleanup_unreferenced_activity_images(db: AsyncIOMotorDatabase, target: Dict[str, Any]):
    """Safely checks if uploaded images associated with this activity are referenced elsewhere before deleting files."""
    urls_to_check = set()
    cover = target.get("coverImage")
    if cover and isinstance(cover, str) and cover.startswith("/uploads/"):
        urls_to_check.add(cover)
    for g in target.get("galleryImages", []):
        u = g.get("url") if isinstance(g, dict) else g
        if u and isinstance(u, str) and u.startswith("/uploads/"):
            urls_to_check.add(u)
    for u in target.get("images", []):
        if u and isinstance(u, str) and u.startswith("/uploads/"):
            urls_to_check.add(u)

    for url in urls_to_check:
        ref_act = await db["activities"].count_documents({
            "$or": [
                {"coverImage": url},
                {"galleryImages.url": url},
                {"images": url},
            ]
        })
        ref_gal = await db["gallery_photos"].count_documents({"imageUrl": url})
        ref_med = await db["media_items"].count_documents({"url": url})
        ref_dev = await db["developers"].count_documents({"avatarUrl": url})

        # If zero other references remain across all collections, safely remove physical file
        if (ref_act + ref_gal + ref_med + ref_dev) == 0:
            filename = os.path.basename(url)
            filepath = os.path.join(settings.MEDIA_UPLOAD_DIR, filename)
            if os.path.exists(filepath):
                try:
                    os.remove(filepath)
                    logger.info(f"Safely pruned unreferenced image file {filepath}")
                except Exception as e:
                    logger.warning(f"Could not remove orphan image file {filepath}: {e}")


@router.post("/admin/activities/{id}/archive", status_code=status.HTTP_200_OK)
async def archive_activity_cms(
    id: str,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Moves an activity into archived state, removing it from public-facing views while preserving data."""
    target = await db["activities"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Activity '{id}' not found.")

    now_iso = datetime.now(timezone.utc).isoformat()
    await db["activities"].update_one(
        {"id": id},
        {"$set": {"publicationStatus": "archived", "status": "archived", "updatedAt": now_iso}},
    )

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="archive_activity",
        module="activities",
        record_id=id,
        metadata={"title": target.get("title")},
    )

    return {"message": f"Activity '{id}' has been archived successfully."}


@router.post("/admin/activities/{id}/restore", status_code=status.HTTP_200_OK)
async def restore_activity_cms(
    id: str,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Restores an archived activity back to published status."""
    target = await db["activities"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Activity '{id}' not found.")

    now_iso = datetime.now(timezone.utc).isoformat()
    await db["activities"].update_one(
        {"id": id},
        {"$set": {"publicationStatus": "published", "status": "completed", "updatedAt": now_iso}},
    )

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="restore_activity",
        module="activities",
        record_id=id,
        metadata={"title": target.get("title")},
    )

    return {"message": f"Activity '{id}' has been restored to published status successfully."}


@router.delete("/admin/activities/{id}", status_code=status.HTTP_200_OK)
async def delete_or_archive_activity_cms(
    id: str,
    hard_delete: bool = Query(True),
    permanent: bool = Query(True),
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Permanently deletes an activity record from MongoDB after confirmation, or archives it if requested."""
    target = await db["activities"].find_one({"id": id})
    if not target:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Activity '{id}' not found.")

    is_permanent = hard_delete and permanent

    if is_permanent:
        # Delete activity record
        await db["activities"].delete_one({"id": id})

        # Remove from homepage configurations if present
        await db["homepage_config"].update_many(
            {},
            {
                "$pull": {
                    "publishedConfig.featuredActivities": {"activityId": id},
                    "draftConfig.featuredActivities": {"activityId": id},
                }
            },
        )

        # Check and safely prune orphan image files
        await cleanup_unreferenced_activity_images(db, target)
        action = "hard_delete_activity"
    else:
        now_iso = datetime.now(timezone.utc).isoformat()
        await db["activities"].update_one(
            {"id": id},
            {"$set": {"publicationStatus": "archived", "status": "archived", "updatedAt": now_iso}},
        )
        action = "archive_activity"

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action=action,
        module="activities",
        record_id=id,
        metadata={"title": target.get("title")},
    )

    return {"message": f"Activity '{id}' has been {action.replace('_activity', 'd')} successfully."}
