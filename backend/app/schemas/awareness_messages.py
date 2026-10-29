"""
Awareness Messages Pydantic Schemas
NSS MJCET Nasha Mukti Abhiyaan
Displayed dynamically after quiz scoring to promote harm reduction, care pathways, and helpline access.
"""

from typing import Optional, Literal
from pydantic import BaseModel


class AwarenessMessageBase(BaseModel):
    title: str
    body: str
    category: str  # e.g., "Harm Reduction", "Peer Support", "Clinical Care", "Helpline Guidance"
    callToAction: Optional[str] = "Explore Care Pathways"
    resourceLink: Optional[str] = "/support"
    publicationStatus: Literal["draft", "published", "archived"] = "published"
    displayOrder: int = 1


class AwarenessMessageCreate(AwarenessMessageBase):
    pass


class AwarenessMessageUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    category: Optional[str] = None
    callToAction: Optional[str] = None
    resourceLink: Optional[str] = None
    publicationStatus: Optional[Literal["draft", "published", "archived"]] = None
    displayOrder: Optional[int] = None


class AwarenessMessageResponse(AwarenessMessageBase):
    id: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
