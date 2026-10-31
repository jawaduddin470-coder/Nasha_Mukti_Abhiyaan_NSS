"""
Website Settings Router
NSS MJCET Nasha Mukti Abhiyaan
Manages verified institutional branding, contact details, and campaign configuration.
"""

from typing import Dict, Any, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
try:
    from pydantic import EmailStr
except Exception:
    EmailStr = str
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.permissions import require_super_admin
from backend.app.db.mongodb import get_database
from backend.app.utils.audit import record_audit_log

router = APIRouter(tags=["Website Settings"])


class SiteSettingsPayload(BaseModel):
    siteTitle: str
    institutionName: str
    campaignTagline: str
    contactEmail: EmailStr
    helplineNumber: str
    address: Optional[str] = "Muffakham Jah College of Engineering & Technology, Mount Pleasant, 8-2-249, Rd Number 3, Banjara Hills, Hyderabad, Telangana 500034"
    footerNotice: Optional[str] = "Official National Service Scheme initiative for substance awareness and youth health."


# Public Endpoint
@router.get("/settings")
async def get_public_site_settings(
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Retrieves public institutional branding, helplines, and campaign contact info."""
    doc = await db["site_settings"].find_one({"key": "global_config"})
    if not doc:
        return {
            "siteTitle": "NSS MJCET Nasha Mukti Abhiyaan",
            "institutionName": "Muffakham Jah College of Engineering & Technology",
            "campaignTagline": "Youth Substance Awareness, Prevention & Resilience",
            "contactEmail": "nss@mjcet.ac.in",
            "helplineNumber": "14446",
        }
    doc.pop("_id", None)
    return doc


# Protected Endpoint (SUPER_ADMIN)
@router.put("/admin/settings")
async def update_site_settings_cms(
    payload: SiteSettingsPayload,
    current_admin: Dict[str, Any] = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """Updates verified institutional settings."""
    data = payload.model_dump()
    data["key"] = "global_config"
    data["updatedAt"] = datetime.now(timezone.utc).isoformat()

    await db["site_settings"].update_one(
        {"key": "global_config"},
        {"$set": data},
        upsert=True,
    )

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="update_website_settings",
        module="settings",
        record_id="global_config",
        metadata={"siteTitle": payload.siteTitle},
    )

    data.pop("_id", None)
    return data
