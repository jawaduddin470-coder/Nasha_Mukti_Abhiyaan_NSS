"""
Homepage Content Manager Router
NSS MJCET Nasha Mukti Abhiyaan
Enables administrators to select, reorder, toggle, preview, and publish featured
activities and gallery photographs on the public homepage.
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from backend.app.core.permissions import require_editor_or_above
from backend.app.db.mongodb import get_database
from backend.app.schemas.activities import ActivityResponse
from backend.app.schemas.gallery import GalleryPhotoResponse
from backend.app.schemas.homepage import (
    HomepageConfigUpdate,
    HomepagePublicResponse,
    HomepageAdminResponse,
    PopulatedFeaturedActivity,
    PopulatedFeaturedGallery,
)
from backend.app.utils.audit import record_audit_log

router = APIRouter(tags=["Homepage Manager"])


async def ensure_homepage_config(db: AsyncIOMotorDatabase) -> Dict[str, Any]:
    """Retrieves or initializes the singleton homepage content configuration."""
    doc = await db["homepage_config"].find_one({"id": "homepage_config"})
    if not doc:
        now_iso = datetime.now(timezone.utc).isoformat()
        doc = {
            "id": "homepage_config",
            "publishedConfig": {
                "featuredActivities": [],
                "featuredGallery": [],
            },
            "draftConfig": {
                "featuredActivities": [],
                "featuredGallery": [],
            },
            "hasUnpublishedChanges": False,
            "lastPublishedAt": None,
            "lastSavedAt": None,
            "updatedBy": "system",
            "updatedAt": now_iso,
        }
        await db["homepage_config"].insert_one(doc)
    return doc


async def populate_activities(
    db: AsyncIOMotorDatabase,
    items: List[Dict[str, Any]],
    only_published: bool = True,
) -> List[PopulatedFeaturedActivity]:
    """Hydrates featured activity references with actual live database records."""
    if not items:
        return []

    activity_ids = [item["activityId"] for item in items]
    query: Dict[str, Any] = {"id": {"$in": activity_ids}}
    if only_published:
        query["publicationStatus"] = {"$in": ["published", "Published"]}

    cursor = db["activities"].find(query)
    record_map: Dict[str, ActivityResponse] = {}
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        record_map[doc["id"]] = ActivityResponse(**doc)

    populated = []
    # Sort items by displayOrder
    sorted_items = sorted(items, key=lambda x: x.get("displayOrder", 1))
    for it in sorted_items:
        act_id = it["activityId"]
        act_record = record_map.get(act_id)
        # If published filter is active and record isn't published or deleted, skip
        if only_published and not act_record:
            continue
        populated.append(
            PopulatedFeaturedActivity(
                activityId=act_id,
                displayOrder=it.get("displayOrder", 1),
                enabled=it.get("enabled", True),
                activity=act_record,
            )
        )
    return populated


async def populate_gallery(
    db: AsyncIOMotorDatabase,
    items: List[Dict[str, Any]],
    only_published: bool = True,
) -> List[PopulatedFeaturedGallery]:
    """Hydrates featured gallery references with actual live database records."""
    if not items:
        return []

    photo_ids = [item["photoId"] for item in items]
    query: Dict[str, Any] = {"id": {"$in": photo_ids}}
    if only_published:
        query["publicationStatus"] = {"$in": ["published", "Published"]}

    cursor = db["gallery_photos"].find(query)
    record_map: Dict[str, GalleryPhotoResponse] = {}
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        record_map[doc["id"]] = GalleryPhotoResponse(**doc)

    populated = []
    sorted_items = sorted(items, key=lambda x: x.get("displayOrder", 1))
    for it in sorted_items:
        p_id = it["photoId"]
        p_record = record_map.get(p_id)
        if only_published and not p_record:
            continue
        populated.append(
            PopulatedFeaturedGallery(
                photoId=p_id,
                displayOrder=it.get("displayOrder", 1),
                enabled=it.get("enabled", True),
                photo=p_record,
            )
        )
    return populated


# Public Homepage Endpoint
@router.get("/homepage/public", response_model=HomepagePublicResponse)
async def get_public_homepage_content(
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Returns the published homepage activities and gallery photographs.
    Resolves enabled selections in administrative display order.
    Gracefully falls back to top published activities/photos if selections are empty.
    """
    config_doc = await ensure_homepage_config(db)
    pub_cfg = config_doc.get("publishedConfig", {})
    act_items = pub_cfg.get("featuredActivities", [])
    gal_items = pub_cfg.get("featuredGallery", [])

    # Filter enabled items only
    enabled_act_items = [it for it in act_items if it.get("enabled", True)]
    enabled_gal_items = [it for it in gal_items if it.get("enabled", True)]

    populated_acts = await populate_activities(db, enabled_act_items, only_published=True)
    populated_gals = await populate_gallery(db, enabled_gal_items, only_published=True)

    final_activities: List[ActivityResponse] = []
    if populated_acts:
        final_activities = [p.activity for p in populated_acts if p.activity is not None]

    final_gallery: List[GalleryPhotoResponse] = []
    if populated_gals:
        final_gallery = [p.photo for p in populated_gals if p.photo is not None]

    is_customized = bool(final_activities or final_gallery)

    # Intentional Fallback: If no activities selected/enabled, return top 3 published
    if not final_activities:
        cursor = (
            db["activities"]
            .find({"publicationStatus": {"$in": ["published", "Published"]}})
            .sort([("displayOrder", 1), ("createdAt", -1)])
            .limit(3)
        )
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            final_activities.append(ActivityResponse(**doc))

    # Intentional Fallback: If no gallery photos selected/enabled, return top 3 published
    if not final_gallery:
        cursor = (
            db["gallery_photos"]
            .find({"publicationStatus": {"$in": ["published", "Published"]}})
            .sort([("displayOrder", 1), ("createdAt", -1)])
            .limit(3)
        )
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            final_gallery.append(GalleryPhotoResponse(**doc))

    return HomepagePublicResponse(
        featuredActivities=final_activities,
        featuredGallery=final_gallery,
        isCustomized=is_customized,
    )


# Protected Admin Homepage Manager Endpoints
@router.get("/admin/homepage", response_model=HomepageAdminResponse)
async def get_admin_homepage_manager_data(
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves homepage manager configuration, populated drafts, and available published catalogs."""
    config_doc = await ensure_homepage_config(db)

    pub_cfg = config_doc.get("publishedConfig", {})
    draft_cfg = config_doc.get("draftConfig", {})

    # Hydrate draft and published items
    draft_acts = await populate_activities(db, draft_cfg.get("featuredActivities", []), only_published=False)
    draft_gals = await populate_gallery(db, draft_cfg.get("featuredGallery", []), only_published=False)

    pub_acts = await populate_activities(db, pub_cfg.get("featuredActivities", []), only_published=False)
    pub_gals = await populate_gallery(db, pub_cfg.get("featuredGallery", []), only_published=False)

    # Fetch all published activities available to select
    available_acts = []
    act_cursor = (
        db["activities"]
        .find({"publicationStatus": {"$in": ["published", "Published"]}})
        .sort([("displayOrder", 1), ("createdAt", -1)])
    )
    async for doc in act_cursor:
        doc["_id"] = str(doc["_id"])
        available_acts.append(ActivityResponse(**doc))

    # Fetch all published gallery photos available to select
    available_gals = []
    gal_cursor = (
        db["gallery_photos"]
        .find({"publicationStatus": {"$in": ["published", "Published"]}})
        .sort([("displayOrder", 1), ("createdAt", -1)])
    )
    async for doc in gal_cursor:
        doc["_id"] = str(doc["_id"])
        available_gals.append(GalleryPhotoResponse(**doc))

    return HomepageAdminResponse(
        publishedConfig=HomepageConfigUpdate(**pub_cfg),
        draftConfig=HomepageConfigUpdate(**draft_cfg),
        hasUnpublishedChanges=config_doc.get("hasUnpublishedChanges", False),
        lastPublishedAt=config_doc.get("lastPublishedAt"),
        lastSavedAt=config_doc.get("lastSavedAt"),
        updatedBy=config_doc.get("updatedBy"),
        draftActivities=draft_acts,
        draftGallery=draft_gals,
        publishedActivities=pub_acts,
        publishedGallery=pub_gals,
        availableActivities=available_acts,
        availableGallery=available_gals,
    )


@router.put("/admin/homepage/draft", response_model=HomepageAdminResponse)
async def update_homepage_draft(
    payload: HomepageConfigUpdate,
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Saves modified homepage featured activities and gallery selections to draft without publishing."""
    await ensure_homepage_config(db)
    now_iso = datetime.now(timezone.utc).isoformat()

    update_doc = {
        "draftConfig": payload.model_dump(),
        "hasUnpublishedChanges": True,
        "lastSavedAt": now_iso,
        "updatedBy": current_admin["email"],
        "updatedAt": now_iso,
    }

    await db["homepage_config"].update_one({"id": "homepage_config"}, {"$set": update_doc})

    return await get_admin_homepage_manager_data(current_admin, db)


@router.post("/admin/homepage/publish", response_model=HomepageAdminResponse)
async def publish_homepage_changes(
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Publishes current draft homepage selections to live public website."""
    config_doc = await ensure_homepage_config(db)
    draft_cfg = config_doc.get("draftConfig", {"featuredActivities": [], "featuredGallery": []})
    now_iso = datetime.now(timezone.utc).isoformat()

    update_doc = {
        "publishedConfig": draft_cfg,
        "hasUnpublishedChanges": False,
        "lastPublishedAt": now_iso,
        "updatedBy": current_admin["email"],
        "updatedAt": now_iso,
    }

    await db["homepage_config"].update_one({"id": "homepage_config"}, {"$set": update_doc})

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="publish_homepage_config",
        module="homepage",
        record_id="homepage_config",
        metadata={
            "activityCount": len(draft_cfg.get("featuredActivities", [])),
            "galleryCount": len(draft_cfg.get("featuredGallery", [])),
        },
    )

    return await get_admin_homepage_manager_data(current_admin, db)


@router.post("/admin/homepage/revert", response_model=HomepageAdminResponse)
async def revert_homepage_draft(
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Reverts unpublished draft changes back to currently published live selections."""
    config_doc = await ensure_homepage_config(db)
    pub_cfg = config_doc.get("publishedConfig", {"featuredActivities": [], "featuredGallery": []})
    now_iso = datetime.now(timezone.utc).isoformat()

    update_doc = {
        "draftConfig": pub_cfg,
        "hasUnpublishedChanges": False,
        "lastSavedAt": now_iso,
        "updatedBy": current_admin["email"],
        "updatedAt": now_iso,
    }

    await db["homepage_config"].update_one({"id": "homepage_config"}, {"$set": update_doc})

    return await get_admin_homepage_manager_data(current_admin, db)
