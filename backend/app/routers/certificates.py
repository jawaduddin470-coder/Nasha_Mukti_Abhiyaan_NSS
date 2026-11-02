"""
Certificate Management & Issuance Router
NSS MJCET Nasha Mukti Abhiyaan
"""

import os
import io
import logging
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from fastapi.responses import StreamingResponse, FileResponse
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.db.mongodb import get_database
from backend.app.core.permissions import require_editor_or_above, require_super_admin
from backend.app.utils.audit import record_audit_log
from backend.app.schemas.certificate import (
    CertificatePublicResponse,
    CertificateGenerateRequest,
    CertificateAdminItem,
    CertificateListResponse,
    CertificateSettingsResponse,
    CertificateSettingsItem,
    CertificateSettingsUpdate,
)
from backend.app.services.certificate_generator import (
    render_certificate_pdf,
    generate_unique_certificate_id,
    get_font_for_certificate,
    UPLOADS_CERT_DIR,
)

logger = logging.getLogger("nmba_backend.certificates")

router = APIRouter(prefix="/certificates", tags=["Certificates"])

# Default Settings if not yet seeded in MongoDB
DEFAULT_CERTIFICATE_SETTINGS = {
    "antiDrug": {
        "certificateType": "anti_drug_awareness",
        "enabled": True,
        "title": "Anti-Drug Awareness Programme Certificate",
        "quizId": "nmba-awareness-challenge-v1",
        "idPrefix": "NSS-NM-2026-",
        "fontSize": 17,
        "fontColor": "#23272F",
        "yOffset": 0.0,
        "xOffset": 0.0,
        "fontFamily": "Georgia Pro",
        "templateVersion": "1.0",
        "previewImageUrl": "/assets/certificates/anti_drug_awareness_template.jpg",
    },
    "unityDay": {
        "certificateType": "national_unity_day",
        "enabled": True,
        "title": "National Unity Day Certificate",
        "quizId": "national-unity-day-quiz-v1",
        "idPrefix": "NSS-NUD-2026-",
        "fontSize": 21,
        "fontColor": "#13264B",
        "yOffset": 0.0,
        "xOffset": 0.0,
        "fontFamily": "Yeseva One",
        "templateVersion": "1.0",
        "previewImageUrl": "/assets/certificates/national_unity_day_template.png",
    },
}


async def get_or_create_settings(db: AsyncIOMotorDatabase) -> Dict[str, Any]:
    """Retrieve or initialize certificate settings in database."""
    settings_doc = await db["certificate_settings"].find_one({"_id": "global_config"})
    if not settings_doc:
        settings_doc = {
            "_id": "global_config",
            "antiDrug": DEFAULT_CERTIFICATE_SETTINGS["antiDrug"],
            "unityDay": DEFAULT_CERTIFICATE_SETTINGS["unityDay"],
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        }
        await db["certificate_settings"].insert_one(settings_doc)
    return settings_doc


# =========================================================================
# PUBLIC CERTIFICATE ENDPOINTS
# =========================================================================

@router.post("/generate", response_model=CertificatePublicResponse)
async def generate_certificate(
    payload: CertificateGenerateRequest,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Verifies successful quiz attempt and generates an authoritative certificate.
    Idempotent: If a certificate was already issued for this attempt, returns existing certificate.
    """
    attempt_id = payload.attemptId.strip()
    if not attempt_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid attempt ID is required to generate a certificate.",
        )

    # 1. Fetch attempt record
    attempt = await db["quiz_attempts"].find_one({"attemptId": attempt_id})
    if not attempt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quiz completion record not found. Please complete the quiz first.",
        )

    # 2. Verify passing requirement
    if not attempt.get("passed", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A certificate is awarded upon passing the challenge (70% or higher). Review your answers and try again!",
        )

    quiz_id = attempt.get("quizId", "nmba-awareness-challenge-v1")
    is_unity = "unity" in quiz_id.lower()
    cert_type = "national_unity_day" if is_unity else "anti_drug_awareness"

    # 3. Check issuance settings
    settings = await get_or_create_settings(db)
    cert_cfg = settings["unityDay"] if is_unity else settings["antiDrug"]
    if not cert_cfg.get("enabled", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Certificate issuance for this initiative is currently closed by the NSS MJCET administration.",
        )

    # 4. Check for existing certificate to prevent duplicate IDs
    existing = await db["certificates"].find_one({"attemptId": attempt_id})
    if existing:
        font_name, font_label = get_font_for_certificate(cert_type)
        return CertificatePublicResponse(
            certificateId=existing["certificateId"],
            quizId=existing["quizId"],
            quizTitle=existing.get("quizTitle", "NSS MJCET Challenge"),
            certificateType=existing["certificateType"],
            participantName=existing["participantName"],
            participantInstitution=existing["participantInstitution"],
            participantRollNumber=existing.get("participantRollNumber", ""),
            score=existing["score"],
            maxScore=existing["maxScore"],
            percentage=existing["percentage"],
            passed=existing["passed"],
            issuedAt=existing["issuedAt"],
            downloadUrl=f"/api/v1/certificates/{existing['certificateId']}/download",
            fontUsed=font_label,
        )

    # 5. Extract participant info from registration
    participant_data = attempt.get("participant", {})
    participant_name = participant_data.get("fullName", "").strip()
    participant_email = participant_data.get("email", "").strip().lower()
    participant_inst = participant_data.get("institutionName", "Muffakham Jah College of Engineering & Technology").strip()
    participant_roll = participant_data.get("rollNumber", "").strip()

    if not participant_name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Participant registration name is missing from attempt record.",
        )

    # 6. Generate unique ID
    cert_id = generate_unique_certificate_id(cert_type)
    # Ensure ID uniqueness in DB
    while await db["certificates"].find_one({"certificateId": cert_id}):
        cert_id = generate_unique_certificate_id(cert_type)

    now_iso = datetime.now(timezone.utc).isoformat()
    issue_date_formatted = datetime.now(timezone.utc).strftime("%d %B %Y")

    # 7. Render PDF with embedded fonts
    font_name, font_label = get_font_for_certificate(cert_type)
    pdf_bytes = render_certificate_pdf(
        certificate_id=cert_id,
        cert_type=cert_type,
        participant_name=participant_name,
        issue_date_str=issue_date_formatted,
        settings_override=cert_cfg,
    )

    # 8. Save certificate record to MongoDB
    quiz_title = "National Unity Day Challenge" if is_unity else "Nasha Mukti Awareness Challenge"
    cert_doc = {
        "certificateId": cert_id,
        "attemptId": attempt_id,
        "quizId": quiz_id,
        "quizTitle": quiz_title,
        "certificateType": cert_type,
        "participantName": participant_name,
        "participantEmail": participant_email,
        "participantInstitution": participant_inst,
        "participantRollNumber": participant_roll,
        "score": attempt.get("score", 0),
        "maxScore": attempt.get("maxScore", 0),
        "percentage": attempt.get("percentage", 0),
        "passed": True,
        "issuedAt": now_iso,
        "templateVersion": cert_cfg.get("templateVersion", "1.0"),
        "fontUsed": font_label,
        "downloadCount": 0,
        "lastDownloadedAt": None,
        "pdfRelativePath": f"certificates/{cert_id}.pdf",
    }
    await db["certificates"].insert_one(cert_doc)
    logger.info(f"Generated certificate {cert_id} for participant '{participant_name}' ({cert_type})")

    return CertificatePublicResponse(
        certificateId=cert_id,
        quizId=quiz_id,
        quizTitle=quiz_title,
        certificateType=cert_type,
        participantName=participant_name,
        participantInstitution=participant_inst,
        participantRollNumber=participant_roll,
        score=attempt.get("score", 0),
        maxScore=attempt.get("maxScore", 0),
        percentage=attempt.get("percentage", 0),
        passed=True,
        issuedAt=now_iso,
        downloadUrl=f"/api/v1/certificates/{cert_id}/download",
        fontUsed=font_label,
    )


@router.get("/check/{attempt_id}", response_model=Optional[CertificatePublicResponse])
async def check_certificate_for_attempt(
    attempt_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Checks if a certificate has already been issued for a specific quiz attempt.
    """
    cert = await db["certificates"].find_one({"attemptId": attempt_id.strip()})
    if not cert:
        return None

    _, font_label = get_font_for_certificate(cert["certificateType"])
    return CertificatePublicResponse(
        certificateId=cert["certificateId"],
        quizId=cert["quizId"],
        quizTitle=cert.get("quizTitle", "NSS MJCET Challenge"),
        certificateType=cert["certificateType"],
        participantName=cert["participantName"],
        participantInstitution=cert["participantInstitution"],
        participantRollNumber=cert.get("participantRollNumber", ""),
        score=cert["score"],
        maxScore=cert["maxScore"],
        percentage=cert["percentage"],
        passed=cert["passed"],
        issuedAt=cert["issuedAt"],
        downloadUrl=f"/api/v1/certificates/{cert['certificateId']}/download",
        fontUsed=font_label,
    )


# =========================================================================
# ADMIN CERTIFICATE MANAGEMENT ENDPOINTS
# =========================================================================

@router.get("/admin/list", response_model=CertificateListResponse)
async def list_certificates_admin(
    search: Optional[str] = Query(None, description="Search by name, email, roll number, or certificate ID"),
    quiz_id: Optional[str] = Query(None, description="Filter by quizId"),
    limit: int = Query(50, ge=1, le=500),
    skip: int = Query(0, ge=0),
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Administrative lookup of all issued certificates with search and filtering.
    """
    query = {}
    if quiz_id and quiz_id != "all":
        query["quizId"] = quiz_id

    if search and search.strip():
        term = search.strip()
        query["$or"] = [
            {"certificateId": {"$regex": term, "$options": "i"}},
            {"participantName": {"$regex": term, "$options": "i"}},
            {"participantEmail": {"$regex": term, "$options": "i"}},
            {"participantRollNumber": {"$regex": term, "$options": "i"}},
            {"attemptId": {"$regex": term, "$options": "i"}},
        ]

    total = await db["certificates"].count_documents(query)
    cursor = db["certificates"].find(query).sort("issuedAt", -1).skip(skip).limit(limit)
    records = await cursor.to_list(length=limit)

    results = []
    for r in records:
        results.append(
            CertificateAdminItem(
                id=str(r.get("_id", "")),
                certificateId=r["certificateId"],
                attemptId=r["attemptId"],
                quizId=r["quizId"],
                quizTitle=r.get("quizTitle", "NSS MJCET Challenge"),
                certificateType=r["certificateType"],
                participantName=r["participantName"],
                participantEmail=r.get("participantEmail", ""),
                participantInstitution=r.get("participantInstitution", ""),
                participantRollNumber=r.get("participantRollNumber", ""),
                score=r.get("score", 0),
                maxScore=r.get("maxScore", 0),
                percentage=r.get("percentage", 0),
                issuedAt=r["issuedAt"],
                downloadCount=r.get("downloadCount", 0),
                lastDownloadedAt=r.get("lastDownloadedAt"),
                downloadUrl=f"/api/v1/certificates/{r['certificateId']}/download",
            )
        )

    return CertificateListResponse(total=total, certificates=results)


@router.get("/admin/settings", response_model=CertificateSettingsResponse)
async def get_certificate_settings_admin(
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Returns current certificate issuance parameters, positioning, and font configuration.
    """
    settings = await get_or_create_settings(db)
    return CertificateSettingsResponse(
        antiDrug=CertificateSettingsItem(**settings["antiDrug"]),
        unityDay=CertificateSettingsItem(**settings["unityDay"]),
    )


@router.put("/admin/settings", response_model=CertificateSettingsResponse)
async def update_certificate_settings_admin(
    payload: CertificateSettingsUpdate,
    current_admin: Dict[str, Any] = Depends(require_super_admin),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Updates certificate parameters, issuance enablement, font sizing, and offsets.
    Restricted to Super Administrators.
    """
    settings = await get_or_create_settings(db)

    anti_drug = settings["antiDrug"]
    unity_day = settings["unityDay"]

    if payload.antiDrugEnabled is not None:
        anti_drug["enabled"] = payload.antiDrugEnabled
    if payload.antiDrugFontSize is not None:
        anti_drug["fontSize"] = payload.antiDrugFontSize
    if payload.antiDrugYOffset is not None:
        anti_drug["yOffset"] = payload.antiDrugYOffset
    if payload.antiDrugXOffset is not None:
        anti_drug["xOffset"] = payload.antiDrugXOffset

    if payload.unityDayEnabled is not None:
        unity_day["enabled"] = payload.unityDayEnabled
    if payload.unityDayFontSize is not None:
        unity_day["fontSize"] = payload.unityDayFontSize
    if payload.unityDayYOffset is not None:
        unity_day["yOffset"] = payload.unityDayYOffset
    if payload.unityDayXOffset is not None:
        unity_day["xOffset"] = payload.unityDayXOffset

    now_iso = datetime.now(timezone.utc).isoformat()
    await db["certificate_settings"].update_one(
        {"_id": "global_config"},
        {"$set": {"antiDrug": anti_drug, "unityDay": unity_day, "updatedAt": now_iso}},
        upsert=True,
    )

    await record_audit_log(
        db,
        actor_email=current_admin["email"],
        action="update_certificate_settings",
        module="certificates",
        record_id="global_config",
        metadata={
            "antiDrugEnabled": anti_drug["enabled"],
            "unityDayEnabled": unity_day["enabled"],
        },
    )

    return CertificateSettingsResponse(
        antiDrug=CertificateSettingsItem(**anti_drug),
        unityDay=CertificateSettingsItem(**unity_day),
    )


@router.post("/admin/preview")
async def generate_admin_preview_pdf(
    cert_type: str = Query("anti_drug_awareness", pattern="^(anti_drug_awareness|national_unity_day)$"),
    test_name: Optional[str] = Query("Mohammed Abdul Quddus"),
    font_size: Optional[int] = Query(None),
    y_offset: Optional[float] = Query(0.0),
    x_offset: Optional[float] = Query(0.0),
    current_admin: Dict[str, Any] = Depends(require_editor_or_above),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Generates a live preview PDF with custom or default parameters.
    Allows administrators to verify font rendering, name alignment, and spacing.
    """
    settings = await get_or_create_settings(db)
    is_unity = cert_type == "national_unity_day"
    cert_cfg = dict(settings["unityDay"] if is_unity else settings["antiDrug"])

    if font_size is not None:
        cert_cfg["fontSize"] = font_size
    if y_offset is not None:
        cert_cfg["yOffset"] = y_offset
    if x_offset is not None:
        cert_cfg["xOffset"] = x_offset

    date_str = datetime.now(timezone.utc).strftime("%d %B %Y")
    sample_id = "NSS-PREVIEW-2026-SAMPLE"

    pdf_bytes = render_certificate_pdf(
        certificate_id=sample_id,
        cert_type=cert_type,
        participant_name=test_name or "Distinguished Participant",
        issue_date_str=date_str,
        settings_override=cert_cfg,
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'inline; filename="certificate_preview.pdf"',
            "Cache-Control": "no-cache",
        },
    )


@router.get("/{certificate_id}", response_model=CertificatePublicResponse)
async def get_certificate_details(
    certificate_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Public lookup endpoint to verify authentic certificate credentials.
    """
    cert = await db["certificates"].find_one({"certificateId": certificate_id.strip()})
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate '{certificate_id}' not found in official institutional registry.",
        )

    _, font_label = get_font_for_certificate(cert["certificateType"])
    return CertificatePublicResponse(
        certificateId=cert["certificateId"],
        quizId=cert["quizId"],
        quizTitle=cert.get("quizTitle", "NSS MJCET Challenge"),
        certificateType=cert["certificateType"],
        participantName=cert["participantName"],
        participantInstitution=cert["participantInstitution"],
        participantRollNumber=cert.get("participantRollNumber", ""),
        score=cert["score"],
        maxScore=cert["maxScore"],
        percentage=cert["percentage"],
        passed=cert["passed"],
        issuedAt=cert["issuedAt"],
        downloadUrl=f"/api/v1/certificates/{cert['certificateId']}/download",
        fontUsed=font_label,
    )


@router.get("/{certificate_id}/download")
async def download_certificate_pdf(
    certificate_id: str,
    view: Optional[bool] = Query(False, description="If true, displays inline in browser; otherwise prompts download."),
    db: AsyncIOMotorDatabase = Depends(get_database),
):
    """
    Serves the print-ready PDF certificate.
    Supports on-demand regeneration if the PDF is not present on ephemeral disk.
    """
    cert = await db["certificates"].find_one({"certificateId": certificate_id.strip()})
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate '{certificate_id}' not found.",
        )

    # Increment download counter
    now_iso = datetime.now(timezone.utc).isoformat()
    await db["certificates"].update_one(
        {"certificateId": certificate_id},
        {"$inc": {"downloadCount": 1}, "$set": {"lastDownloadedAt": now_iso}},
    )

    pdf_filename = f"{certificate_id}.pdf"
    pdf_path = os.path.join(UPLOADS_CERT_DIR, pdf_filename)

    # If file exists on disk, read and return
    if os.path.exists(pdf_path):
        with open(pdf_path, "rb") as f:
            pdf_bytes = f.read()
    else:
        # Regenerate on demand from stored metadata & settings
        settings = await get_or_create_settings(db)
        is_unity = cert.get("certificateType") == "national_unity_day"
        cert_cfg = settings["unityDay"] if is_unity else settings["antiDrug"]

        issue_dt = datetime.fromisoformat(cert["issuedAt"].replace("Z", "+00:00"))
        date_str = issue_dt.strftime("%d %B %Y")

        pdf_bytes = render_certificate_pdf(
            certificate_id=cert["certificateId"],
            cert_type=cert["certificateType"],
            participant_name=cert["participantName"],
            issue_date_str=date_str,
            settings_override=cert_cfg,
        )

    disposition = "inline" if view else f'attachment; filename="NSS_MJCET_Certificate_{certificate_id}.pdf"'

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": disposition,
            "Cache-Control": "public, max-age=3600",
        },
    )


