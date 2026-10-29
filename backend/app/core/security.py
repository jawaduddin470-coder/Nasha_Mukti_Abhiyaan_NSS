"""
Security & Firebase Authentication Middleware
NSS MJCET Nasha Mukti Abhiyaan
Verifies Firebase ID Tokens and validates authorized administrator access.
"""

import os
import logging
from typing import Optional, Dict, Any
import certifi
import requests as py_requests
from google.auth.transport.requests import Request
from google.oauth2 import id_token as google_id_token
import jwt
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from backend.app.core.config import settings
from backend.app.db.mongodb import get_database

logger = logging.getLogger("nmba_backend.security")

security_scheme = HTTPBearer(auto_error=False)

# Initialize reusable requests session with certifi CA bundle
_session = py_requests.Session()
_session.verify = certifi.where()
_google_request = Request(session=_session)


async def verify_id_token(token: str) -> Dict[str, Any]:
    """
    Verifies a Firebase ID token using Google public certificates.
    Raises HTTPException 401 if invalid or expired.
    """
    # Fast path for automated development and test harnesses
    if settings.ENVIRONMENT == "development" and token.startswith("dev-test-token:"):
        email = token.split("dev-test-token:")[1]
        return {"email": email, "uid": f"dev-{email}", "name": "Dev Test Admin"}

    # 1. Primary: Verify token against Google's public x509 certs
    try:
        decoded_token = google_id_token.verify_firebase_token(
            token,
            _google_request,
            audience=settings.FIREBASE_PROJECT_ID,
        )
        return decoded_token
    except Exception as e:
        logger.warning(f"Google verify_firebase_token failed: {e}")

    # 2. Secondary: If token is a valid Firebase JWT issued for our project,
    # validate claims in development
    if settings.ENVIRONMENT == "development":
        try:
            unverified = jwt.decode(token, options={"verify_signature": False})
            aud = unverified.get("aud")
            iss = unverified.get("iss", "")
            expected_iss = f"https://securetoken.google.com/{settings.FIREBASE_PROJECT_ID}"
            if aud == settings.FIREBASE_PROJECT_ID and iss == expected_iss and unverified.get("email"):
                logger.info(f"Verified Firebase token via development JWT claim validator: {unverified.get('email')}")
                return unverified
        except Exception as e:
            logger.warning(f"Development JWT decode failed: {e}")

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid, expired, or unverified authentication token.",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_admin_user(
    auth_creds: Optional[HTTPAuthorizationCredentials] = Security(security_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database),
) -> Dict[str, Any]:
    """
    Dependency that extracts the Bearer token, verifies it with Firebase,
    checks MongoDB admin_users allowlist, and returns the approved admin profile.
    """
    if not auth_creds or not auth_creds.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Bearer header.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    decoded = await verify_id_token(auth_creds.credentials)
    email = decoded.get("email", "").strip().lower()

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not contain a verified email address.",
        )

    # Query MongoDB admin_users collection
    admin_user = await db["admin_users"].find_one({"email": email})

    # Check bootstrap list if user not found in database yet
    if not admin_user and email in settings.super_admin_emails_list:
        from datetime import datetime, timezone
        now_iso = datetime.now(timezone.utc).isoformat()
        new_super_admin = {
            "email": email,
            "role": "SUPER_ADMIN",
            "status": "active",
            "displayName": decoded.get("name", "Super Administrator"),
            "photoUrl": decoded.get("picture", ""),
            "addedBy": "system_bootstrap",
            "createdAt": now_iso,
            "updatedAt": now_iso,
            "lastLoginAt": now_iso,
        }
        await db["admin_users"].insert_one(new_super_admin)
        admin_user = new_super_admin
        logger.info(f"Bootstrapped initial Super Admin user: {email}")

    if not admin_user:
        logger.warning(f"Unapproved Google sign-in attempt: email='{email}'")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Your Google account is not on the approved administrative access list.",
        )

    if admin_user.get("status") != "active":
        logger.warning(f"Inactive or revoked admin access attempt: email='{email}', status='{admin_user.get('status')}'")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: This administrative account is {admin_user.get('status', 'suspended')}.",
        )

    return admin_user
