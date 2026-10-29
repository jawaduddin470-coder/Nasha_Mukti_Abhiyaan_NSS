"""
Admin Users Pydantic Schemas
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import Optional, Literal
from pydantic import BaseModel, EmailStr


class AdminUserBase(BaseModel):
    email: EmailStr
    role: Literal["SUPER_ADMIN", "EDITOR"]
    status: Literal["active", "suspended", "revoked"] = "active"
    displayName: Optional[str] = None
    photoUrl: Optional[str] = None


class AdminUserCreate(BaseModel):
    email: EmailStr
    role: Literal["SUPER_ADMIN", "EDITOR"] = "EDITOR"
    displayName: Optional[str] = None


class AdminUserUpdate(BaseModel):
    role: Optional[Literal["SUPER_ADMIN", "EDITOR"]] = None
    status: Optional[Literal["active", "suspended", "revoked"]] = None
    displayName: Optional[str] = None


class AdminUserResponse(AdminUserBase):
    addedBy: Optional[str] = None
    createdAt: str
    updatedAt: str
    lastLoginAt: Optional[str] = None
