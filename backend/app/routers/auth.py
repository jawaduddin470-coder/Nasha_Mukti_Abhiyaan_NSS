"""
Authentication & Access Verification Router
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.core.security import get_current_admin_user
from backend.app.schemas.admin_users import AdminUserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me", response_model=AdminUserResponse)
async def get_current_user_profile(
    current_user: Dict[str, Any] = Depends(get_current_admin_user),
):
    """
    Returns the authenticated administrator's verified profile, role, and permissions.
    Fails with 401 if unauthenticated, 403 if unapproved or suspended.
    """
    return AdminUserResponse(
        email=current_user["email"],
        role=current_user["role"],
        status=current_user.get("status", "active"),
        displayName=current_user.get("displayName"),
        photoUrl=current_user.get("photoUrl"),
        addedBy=current_user.get("addedBy"),
        createdAt=current_user.get("createdAt", ""),
        updatedAt=current_user.get("updatedAt", ""),
        lastLoginAt=current_user.get("lastLoginAt"),
    )
