"""
Homepage Content Manager Schemas
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import List, Optional
from pydantic import BaseModel
from backend.app.schemas.activities import ActivityResponse
from backend.app.schemas.gallery import GalleryPhotoResponse


class FeaturedActivityItem(BaseModel):
    activityId: str
    displayOrder: int = 1
    enabled: bool = True


class FeaturedGalleryItem(BaseModel):
    photoId: str
    displayOrder: int = 1
    enabled: bool = True


class HomepageConfigUpdate(BaseModel):
    featuredActivities: List[FeaturedActivityItem] = []
    featuredGallery: List[FeaturedGalleryItem] = []


class HomepagePublicResponse(BaseModel):
    featuredActivities: List[ActivityResponse] = []
    featuredGallery: List[GalleryPhotoResponse] = []
    isCustomized: bool = False


class PopulatedFeaturedActivity(BaseModel):
    activityId: str
    displayOrder: int
    enabled: bool
    activity: Optional[ActivityResponse] = None


class PopulatedFeaturedGallery(BaseModel):
    photoId: str
    displayOrder: int
    enabled: bool
    photo: Optional[GalleryPhotoResponse] = None


class HomepageAdminResponse(BaseModel):
    publishedConfig: HomepageConfigUpdate
    draftConfig: HomepageConfigUpdate
    hasUnpublishedChanges: bool = False
    lastPublishedAt: Optional[str] = None
    lastSavedAt: Optional[str] = None
    updatedBy: Optional[str] = None
    # Populated drafts for live preview and admin UI
    draftActivities: List[PopulatedFeaturedActivity] = []
    draftGallery: List[PopulatedFeaturedGallery] = []
    # Populated published for current live state
    publishedActivities: List[PopulatedFeaturedActivity] = []
    publishedGallery: List[PopulatedFeaturedGallery] = []
    # Catalogs of all available published items to pick from
    availableActivities: List[ActivityResponse] = []
    availableGallery: List[GalleryPhotoResponse] = []
