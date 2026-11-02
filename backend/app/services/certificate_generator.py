"""
Automated Certificate Generation Service
NSS MJCET Nasha Mukti Abhiyaan

Generates high-resolution, print-ready PDF certificates with embedded TrueType fonts,
dynamic name scaling, precise coordinate placement, and institutional metadata.
"""

import os
import io
import secrets
import logging
from typing import Tuple, Dict, Any, Optional
from datetime import datetime, timezone
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor

logger = logging.getLogger("nmba_backend.certificates")

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS_DIR = os.path.join(BASE_DIR, "assets", "fonts")
CERT_TEMPLATES_DIR = os.path.join(BASE_DIR, "assets", "certificates")
UPLOADS_CERT_DIR = os.path.join(os.path.dirname(BASE_DIR), "uploads", "certificates")

# Ensure certificates upload folder exists
os.makedirs(UPLOADS_CERT_DIR, exist_ok=True)

# Track registered fonts
_REGISTERED_FONTS = set()


def register_fonts():
    """
    Registers the official TrueType fonts with ReportLab.
    Ensures fonts are embedded into the generated PDF for platform-independent consistency.
    """
    global _REGISTERED_FONTS

    # 1. Register Yeseva One for National Unity Day Certificate
    if "YesevaOne" not in _REGISTERED_FONTS:
        yeseva_path = os.path.join(FONTS_DIR, "YesevaOne-Regular.ttf")
        if os.path.exists(yeseva_path):
            try:
                pdfmetrics.registerFont(TTFont("YesevaOne", yeseva_path))
                _REGISTERED_FONTS.add("YesevaOne")
                logger.info(f"Registered YesevaOne font from {yeseva_path}")
            except Exception as e:
                logger.error(f"Failed to register YesevaOne font: {e}")

    # 2. Register Georgia Pro (or Georgia fallback) for Anti-Drug Awareness Certificate
    # First priority: check for Georgia Pro files
    georgia_pro_names = [
        "GeorgiaPro-Regular.ttf",
        "GeorgiaPro.ttf",
        "GeorgiaPro-Bold.ttf",
        "GeorgiaPro-Semibold.ttf",
        "GeorgiaPro-Regular.otf",
        "GeorgiaPro.otf",
    ]
    georgia_pro_path = None
    for fname in georgia_pro_names:
        p = os.path.join(FONTS_DIR, fname)
        if os.path.exists(p):
            georgia_pro_path = p
            break

    if georgia_pro_path:
        if "GeorgiaPro" not in _REGISTERED_FONTS:
            try:
                pdfmetrics.registerFont(TTFont("GeorgiaPro", georgia_pro_path))
                _REGISTERED_FONTS.add("GeorgiaPro")
                logger.info(f"Registered official GeorgiaPro font from {georgia_pro_path}")
            except Exception as e:
                logger.error(f"Failed to register GeorgiaPro font: {e}")
    else:
        # Fallback to local Georgia-Bold / Georgia
        georgia_fallback_paths = [
            os.path.join(FONTS_DIR, "Georgia-Bold.ttf"),
            os.path.join(FONTS_DIR, "Georgia.ttf"),
            "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
            "/System/Library/Fonts/Supplemental/Georgia.ttf",
        ]
        for g_path in georgia_fallback_paths:
            if os.path.exists(g_path):
                if "Georgia" not in _REGISTERED_FONTS:
                    try:
                        pdfmetrics.registerFont(TTFont("Georgia", g_path))
                        _REGISTERED_FONTS.add("Georgia")
                        logger.info(f"Registered Georgia fallback font from {g_path}")
                        break
                    except Exception as e:
                        logger.warning(f"Could not register {g_path}: {e}")


# Initialize font registration
register_fonts()


def get_font_for_certificate(cert_type: str) -> Tuple[str, str]:
    """
    Returns (font_name, font_label) for the given certificate type.
    Strictly keeps the two fonts separate.
    """
    register_fonts()
    if cert_type == "anti_drug_awareness":
        if "GeorgiaPro" in _REGISTERED_FONTS:
            return "GeorgiaPro", "Georgia Pro"
        elif "Georgia" in _REGISTERED_FONTS:
            return "Georgia", "Georgia (Interim Fallback for Georgia Pro)"
        else:
            return "Helvetica-Bold", "Standard Serif"
    else:
        # national_unity_day
        if "YesevaOne" in _REGISTERED_FONTS:
            return "YesevaOne", "Yeseva One"
        else:
            return "Times-Bold", "Yeseva One (Fallback)"


def generate_unique_certificate_id(cert_type: str) -> str:
    """
    Generates an institutional certificate ID in the required formats:
    - Anti-Drug Awareness: NSS-NM-2026-XXXXXX
    - National Unity Day: NSS-NUD-2026-XXXXXX
    """
    # Alphabet excluding ambiguous chars (0, O, 1, I)
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    suffix = "".join(secrets.choice(alphabet) for _ in range(6))

    if cert_type == "anti_drug_awareness":
        return f"NSS-NM-2026-{suffix}"
    else:
        return f"NSS-NUD-2026-{suffix}"


def render_certificate_pdf(
    certificate_id: str,
    cert_type: str,
    participant_name: str,
    issue_date_str: str,
    settings_override: Optional[Dict[str, Any]] = None,
) -> bytes:
    """
    Renders the certificate PDF using ReportLab canvas with embedded fonts and
    vector text over the official template.
    """
    register_fonts()

    # Landscape A4: width=841.89 pt, height=595.28 pt
    page_width, page_height = landscape(A4)

    # Clean participant name
    clean_name = participant_name.strip()
    if not clean_name:
        clean_name = "Distinguished Participant"

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=(page_width, page_height))
    c.setTitle(f"NSS MJCET Certificate - {certificate_id}")
    c.setAuthor("National Service Scheme, Muffakham Jah College of Engineering & Technology")
    c.setSubject(
        "Anti-Drug Awareness Programme"
        if cert_type == "anti_drug_awareness"
        else "National Unity Day Celebration"
    )
    c.setCreator("NSS MJCET Automated Certificate Engine")

    settings_override = settings_override or {}

    if cert_type == "anti_drug_awareness":
        # =========================================================================
        # CERTIFICATE A — ANTI-DRUG AWARENESS PROGRAMME
        # =========================================================================
        template_file = os.path.join(CERT_TEMPLATES_DIR, "anti_drug_awareness_template.jpg")
        if not os.path.exists(template_file):
            logger.error(f"Template A missing: {template_file}")
            raise FileNotFoundError(f"Certificate template missing: {template_file}")

        # Draw full background template
        c.drawImage(template_file, 0, 0, width=page_width, height=page_height, preserveAspectRatio=False)

        # Baseline: In 1024x723 image, the underline is at Y=386-387.
        # ReportLab Y = page_height * (1.0 - 382.0 / 723.0) = ~280.6 pt
        base_y = page_height * (1.0 - 382.0 / 723.0) + settings_override.get("yOffset", 0.0)
        # Center of underline between 'Mr./Ms.' (X=398) and 'has actively' (X=800): X = 601.2
        # In ReportLab = page_width * (601.2 / 1024.0) = ~494.6 pt
        base_x = page_width * (601.2 / 1024.0) + settings_override.get("xOffset", 0.0)

        font_name, _ = get_font_for_certificate("anti_drug_awareness")
        base_font_size = settings_override.get("fontSize", 20)

        # Underline blank space spans ~390px = 320 pt. Capping at 275 pt ensures ~20pt clean margin on both sides even for ultra-long names.
        max_name_width = 275.0  # points

        # Auto-scale font if name is very long
        string_width = pdfmetrics.stringWidth(clean_name, font_name, base_font_size)
        actual_font_size = base_font_size
        if string_width > max_name_width:
            actual_font_size = base_font_size * (max_name_width / string_width)
            actual_font_size = max(actual_font_size, 8.5)

        # Draw participant name centered on the underline
        c.setFont(font_name, actual_font_size)
        c.setFillColor(HexColor(settings_override.get("fontColor", "#111827")))
        c.drawCentredString(base_x, base_y, clean_name)

        # Draw discrete official verification footer
        c.setFont("Helvetica", 7)
        c.setFillColor(HexColor("#8C7A5B"))
        c.drawRightString(page_width - 32, 18, f"Certificate ID: {certificate_id}  •  Issued on: {issue_date_str}")
        c.drawString(32, 18, "Digitally authenticated by NSS MJCET  •  Verify at: nashamuktiabhiyaannss.vercel.app")

    else:
        # =========================================================================
        # CERTIFICATE B — NATIONAL UNITY DAY
        # =========================================================================
        template_file = os.path.join(CERT_TEMPLATES_DIR, "national_unity_day_template.png")
        if not os.path.exists(template_file):
            logger.error(f"Template B missing: {template_file}")
            raise FileNotFoundError(f"Certificate template missing: {template_file}")

        # Draw full background template
        c.drawImage(template_file, 0, 0, width=page_width, height=page_height, preserveAspectRatio=False)

        # Baseline: In 1024x723 image, the designated window is between Y=334 and Y=439 (105px).
        # Centering baseline comfortably at Y=400 keeps Yeseva One ascenders clear of the header.
        # ReportLab Y = page_height * (1.0 - 400.0 / 723.0) = ~265.8 pt
        base_y = page_height * (1.0 - 400.0 / 723.0) + settings_override.get("yOffset", 0.0)
        base_x = (page_width * 0.5) + settings_override.get("xOffset", 0.0)

        font_name, _ = get_font_for_certificate("national_unity_day")
        base_font_size = settings_override.get("fontSize", 24)

        max_name_width = 520.0  # points

        # Auto-scale font if name is very long
        string_width = pdfmetrics.stringWidth(clean_name, font_name, base_font_size)
        actual_font_size = base_font_size
        if string_width > max_name_width:
            actual_font_size = base_font_size * (max_name_width / string_width)
            actual_font_size = max(actual_font_size, 13)

        # Draw participant name centered
        c.setFont(font_name, actual_font_size)
        c.setFillColor(HexColor(settings_override.get("fontColor", "#183153")))
        c.drawCentredString(base_x, base_y, clean_name)

        # Draw discrete official verification footer
        c.setFont("Helvetica", 7)
        c.setFillColor(HexColor("#4A607A"))
        c.drawRightString(page_width - 32, 18, f"Certificate ID: {certificate_id}  •  Issued on: {issue_date_str}")
        c.drawString(32, 18, "Digitally authenticated by NSS MJCET  •  Verify at: nashamuktiabhiyaannss.vercel.app")

    c.showPage()
    c.save()

    pdf_bytes = buffer.getvalue()
    buffer.close()

    # Also persist to file storage
    pdf_filename = f"{certificate_id}.pdf"
    pdf_filepath = os.path.join(UPLOADS_CERT_DIR, pdf_filename)
    try:
        with open(pdf_filepath, "wb") as f:
            f.write(pdf_bytes)
    except Exception as e:
        logger.warning(f"Failed to write certificate to disk at {pdf_filepath}: {e}")

    return pdf_bytes
