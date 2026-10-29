"""
Admin User Management Router (SUPER_ADMIN Only)
NSS MJCET Nasha Mukti Abhiyaan
Manages administrative email allowlist, role assignments, and access revocation.
"""

from typing import List, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.permissions import require_super_admin
from backend.app.db.mongodb import get_database
from backend.app.schemas.admin_users import AdminUserResponse, AdminUserCreate, AdminUserUpdate
from backend.app.utils.audit import record_audit_log

router = APIRouter(prefix="/admin/users", tags=["Admin Access Management"])


@router.get("", response_model=List[AdminUserResponse])
async def list_admin_users(
    current_admin: Dict[str, Any] = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Lists all registered administrative accounts and their status."""
    cursor = db["admin_users"].find().sort("createdAt", -1)
    users = []
    async for doc in cursor:
        users.append(
            AdminUserResponse(
                email=doc["email"],
                role=doc["role"],
                status=doc.get("status", "active"),
                displayName=doc.get("displayName"),
                photoUrl=doc.get("photoUrl"),
                addedBy=doc.get("addedBy"),
                createdAt=doc.get("createdAt", ""),
                updatedAt=doc.get("updatedAt", ""),
                lastLoginAt=doc.get("lastLoginAt"),
            )
        )
    return users


@router.post("", response_model=AdminUserResponse, status_code=status.HTTP_201_CREATED)
async def add_admin_user(
    payload: AdminUserCreate,
    current_admin: Dict[str, Any] = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Adds a new administrative email to the allowlist with specified role."""
    norm_email = payload.email.strip().lower()

    existing = await db["admin_users"].find_one({"email": norm_email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"An administrative account for '{norm_email}' already exists.",
        )

    now_iso = datetime.now(timezone.utc).isoformat()
    new_user = {
        "email": norm_email,
        "role": payload.role,
        "status": "active",
        "displayName": payload.displayName or norm_email.split("@")[0],
        "photoUrl": "",
        "addedBy": current_admin["email"],
        "createdAt": now_iso,
        "updatedAt": now_iso,
        "lastLoginAt": None,
    }

    await db["admin_users"].insert_one(new_user)
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="create_admin_user",
        module="admin_users",
        record_id=norm_email,
        metadata={"assignedRole": payload.role},
    )

    return AdminUserResponse(**new_user)


@router.patch("/{email}", response_model=AdminUserResponse)
async def update_admin_user(
    email: str,
    payload: AdminUserUpdate,
    current_admin: Dict[str, Any] = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Updates role or access status (e.g. suspend/activate) for an administrative account."""
    norm_email = email.strip().lower()
    target = await db["admin_users"].find_one({"email": norm_email})

    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Administrative account '{norm_email}' not found.",
        )

    # Protect against demoting or suspending the final active SUPER_ADMIN
    if target["role"] == "SUPER_ADMIN" and (payload.role == "EDITOR" or payload.status in ["suspended", "revoked"]):
        active_super_admins_count = await db["admin_users"].count_documents(
            {"role": "SUPER_ADMIN", "status": "active"}
        )
        if active_super_admins_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Operation prohibited: Cannot demote or suspend the final active Super Administrator.",
            )

    update_fields: Dict[str, Any] = {"updatedAt": datetime.now(timezone.utc).isoformat()}
    if payload.role is not None:
        update_fields["role"] = payload.role
    if payload.status is not None:
        update_fields["status"] = payload.status
    if payload.displayName is not None:
        update_fields["displayName"] = payload.displayName

    await db["admin_users"].update_one({"email": norm_email}, {"$set": update_fields})
    updated_doc = await db["admin_users"].find_one({"email": norm_email})

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="update_admin_user",
        module="admin_users",
        record_id=norm_email,
        metadata={"changes": {k: v for k, v in update_fields.items() if k != "updatedAt"}},
    )

    return AdminUserResponse(
        email=updated_doc["email"],
        role=updated_doc["role"],
        status=updated_doc.get("status", "active"),
        displayName=updated_doc.get("displayName"),
        photoUrl=updated_doc.get("photoUrl"),
        addedBy=updated_doc.get("addedBy"),
        createdAt=updated_doc.get("createdAt", ""),
        updatedAt=updated_doc.get("updatedAt", ""),
        lastLoginAt=updated_doc.get("lastLoginAt"),
    )


@router.delete("/{email}", status_code=status.HTTP_200_OK)
async def revoke_admin_user(
    email: str,
    current_admin: Dict[str, Any] = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Revokes access and removes an administrative account from the allowlist."""
    norm_email = email.strip().lower()
    target = await db["admin_users"].find_one({"email": norm_email})

    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Administrative account '{norm_email}' not found.",
        )

    # Protect against deleting the final active SUPER_ADMIN
    if target["role"] == "SUPER_ADMIN":
        active_super_admins_count = await db["admin_users"].count_documents(
            {"role": "SUPER_ADMIN", "status": "active"}
        )
        if active_super_admins_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Operation prohibited: Cannot delete the final active Super Administrator.",
            )

    await db["admin_users"].delete_one({"email": norm_email})
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="delete_admin_user",
        module="admin_users",
        record_id=norm_email,
        metadata={"deletedRole": target.get("role")},
    )

    return {"message": f"Administrative account '{norm_email}' has been successfully revoked."}
