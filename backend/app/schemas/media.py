"""
Media Library Pydantic Schemas
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import Optional
from pydantic import BaseModel


class MediaItemResponse(BaseModel):
    id: str
    url: str
    filename: str
    originalName: str
    title: str
    category: str = "general"
    mimeType: str
    sizeBytes: int
    uploadedBy: str
    createdAt: str


class MediaItemUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
