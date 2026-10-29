"""
Developer Profiles Pydantic Schemas
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class DeveloperBase(BaseModel):
    fullName: str
    role: str
    bio: str
    roleCategory: str
    skills: List[str] = Field(default_factory=list)
    avatarUrl: str
    githubUrl: Optional[str] = None
    linkedinUrl: Optional[str] = None
    otherUrl: Optional[str] = None
    departmentOrAffiliation: Optional[str] = "MJCET"
    featured: bool = True
    displayOrder: int = 1
    publicationStatus: Literal["draft", "published", "archived"] = "published"


class DeveloperCreate(DeveloperBase):
    pass


class DeveloperUpdate(BaseModel):
    fullName: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    roleCategory: Optional[str] = None
    skills: Optional[List[str]] = None
    avatarUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    linkedinUrl: Optional[str] = None
    otherUrl: Optional[str] = None
    departmentOrAffiliation: Optional[str] = None
    featured: Optional[bool] = None
    displayOrder: Optional[int] = None
    publicationStatus: Optional[Literal["draft", "published", "archived"]] = None


class DeveloperResponse(DeveloperBase):
    id: str
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None
