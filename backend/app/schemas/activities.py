"""
Activity Pydantic Schemas
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field, model_validator


class VenueCoordinates(BaseModel):
    lat: float
    lng: float


class ActivityImage(BaseModel):
    url: str
    caption: Optional[str] = ""
    displayOrder: int = 1


class AgendaItem(BaseModel):
    time: str
    title: str
    description: Optional[str] = ""


class ImpactMetric(BaseModel):
    label: str
    value: str


class ActivityBase(BaseModel):
    title: str
    slug: str
    summary: str
    description: str
    category: str
    status: Literal["draft", "scheduled", "upcoming", "published", "completed", "archived"] = "completed"
    publicationStatus: Literal["draft", "published", "archived"] = "published"
    date: str
    timeDisplay: str
    venue: str
    venueCoordinates: Optional[VenueCoordinates] = None
    targetAudience: Optional[str] = "Students & Youth"
    coordinators: List[str] = Field(default_factory=list)
    impactMetrics: List[ImpactMetric] = Field(default_factory=list)
    agenda: List[AgendaItem] = Field(default_factory=list)
    coverImage: Optional[str] = None
    galleryImages: List[ActivityImage] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    featured: bool = False
    displayOrder: int = 1

    @model_validator(mode="after")
    def validate_image_limit(self):
        total_images = len(self.galleryImages) + (1 if self.coverImage else 0)
        if total_images > 5:
            raise ValueError(f"An activity may have at most 5 total images (cover image + gallery images). Found {total_images}.")
        return self


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    status: Optional[Literal["draft", "scheduled", "upcoming", "published", "completed", "archived"]] = None
    publicationStatus: Optional[Literal["draft", "published", "archived"]] = None
    date: Optional[str] = None
    timeDisplay: Optional[str] = None
    venue: Optional[str] = None
    venueCoordinates: Optional[VenueCoordinates] = None
    targetAudience: Optional[str] = None
    coordinators: Optional[List[str]] = None
    impactMetrics: Optional[List[ImpactMetric]] = None
    agenda: Optional[List[AgendaItem]] = None
    coverImage: Optional[str] = None
    galleryImages: Optional[List[ActivityImage]] = None
    tags: Optional[List[str]] = None
    featured: Optional[bool] = None
    displayOrder: Optional[int] = None

    @model_validator(mode="after")
    def validate_image_limit(self):
        if self.galleryImages is not None or self.coverImage is not None:
            gallery_count = len(self.galleryImages) if self.galleryImages is not None else 0
            cover_count = 1 if self.coverImage else 0
            if gallery_count + cover_count > 5:
                raise ValueError("An activity may have at most 5 total images (cover image + gallery images).")
        return self


class ActivityResponse(ActivityBase):
    id: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
