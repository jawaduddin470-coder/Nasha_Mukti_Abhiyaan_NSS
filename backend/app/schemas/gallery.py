"""
Gallery Photo Pydantic Schemas
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class GalleryPhotoBase(BaseModel):
    title: str
    caption: str
    category: str
    imageUrl: str
    thumbnailUrl: Optional[str] = None
    photographer: Optional[str] = "NSS Media Wing"
    date: str
    location: Optional[str] = "MJCET Campus"
    aspectRatio: Literal["landscape", "portrait", "square"] = "landscape"
    tags: List[str] = Field(default_factory=list)
    publicationStatus: Literal["draft", "published", "archived"] = "published"
    featuredIn3D: bool = False
    displayOrder: int = 1


class GalleryPhotoCreate(GalleryPhotoBase):
    pass


class GalleryPhotoUpdate(BaseModel):
    title: Optional[str] = None
    caption: Optional[str] = None
    category: Optional[str] = None
    imageUrl: Optional[str] = None
    thumbnailUrl: Optional[str] = None
    photographer: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    aspectRatio: Optional[Literal["landscape", "portrait", "square"]] = None
    tags: Optional[List[str]] = None
    publicationStatus: Optional[Literal["draft", "published", "archived"]] = None
    featuredIn3D: Optional[bool] = None
    displayOrder: Optional[int] = None


class GalleryPhotoResponse(GalleryPhotoBase):
    id: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
