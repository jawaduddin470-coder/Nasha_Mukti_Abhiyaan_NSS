"""
Image & Media Upload Router
NSS MJCET Nasha Mukti Abhiyaan
Handles file uploads with strict MIME verification, size restrictions, and unique naming.
"""

import os
import uuid
import base64
from typing import Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.permissions import require_editor_or_above
from backend.app.core.config import settings
from backend.app.db.mongodb import get_database
from backend.app.utils.audit import record_audit_log

router = APIRouter(prefix="/admin/uploads", tags=["Uploads"])

ALLOWED_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}
MAX_FILE_SIZE_BYTES = settings.MAX_MEDIA_FILE_SIZE_MB * 1024 * 1024  # 10 MB


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_image_file(
    file: UploadFile = File(...),
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Uploads an image file safely.
    Validates MIME type, enforces size caps, stores to upload directory,
    and returns the public resource URL.
    """
    content_type = file.content_type or ""
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image type '{content_type}'. Allowed types: JPG, PNG, WEBP.",
        )

    # Read content to check file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {settings.MAX_MEDIA_FILE_SIZE_MB}MB.",
        )

    # Generate collision-free filename
    ext = ALLOWED_MIME_TYPES[content_type]
    unique_filename = f"{datetime.now().strftime('%Y%m%d')}_{uuid.uuid4().hex[:12]}{ext}"

    # Ensure upload directory exists and write file if filesystem is writable
    try:
        os.makedirs(settings.MEDIA_UPLOAD_DIR, exist_ok=True)
        destination_path = os.path.join(settings.MEDIA_UPLOAD_DIR, unique_filename)
        with open(destination_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        pass

    public_url = f"/uploads/{unique_filename}"
    now_iso = datetime.now(timezone.utc).isoformat()

    # Persist binary data in MongoDB uploaded_images for serverless permanence
    b64_data = base64.b64encode(contents).decode("utf-8")
    await db["uploaded_images"].update_one(
        {"filename": unique_filename},
        {
            "$set": {
                "filename": unique_filename,
                "contentType": content_type,
                "mimeType": content_type,
                "sizeBytes": len(contents),
                "data": b64_data,
                "uploadedAt": now_iso,
            }
        },
        upsert=True,
    )

    # Log record in database
    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="upload_media_file",
        module="media",
        record_id=unique_filename,
        metadata={"filename": file.filename, "sizeBytes": len(contents), "mimeType": content_type},
    )

    return {
        "url": public_url,
        "filename": unique_filename,
        "originalName": file.filename,
        "sizeBytes": len(contents),
        "mimeType": content_type,
        "uploadedAt": now_iso,
    }
