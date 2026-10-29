"""
Application Configuration
NSS MJCET Nasha Mukti Abhiyaan
Loads and validates settings from environment variables.
"""

from typing import List, Optional
import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

    # MongoDB Atlas Database
    MONGODB_URI: str
    DATABASE_NAME: str = "nasha_mukti_db"

    # Firebase Authentication & Project
    FIREBASE_PROJECT_ID: str = "nashamuktiabhiya"
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None

    # Super Admin Bootstrap (comma-separated list of approved Google emails)
    SUPER_ADMIN_EMAILS: str = "jawaddduddin@gmail.com"

    # Media & Uploads
    MEDIA_UPLOAD_DIR: str = "backend/uploads"
    MAX_MEDIA_FILE_SIZE_MB: int = 10

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(__file__), "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def super_admin_emails_list(self) -> List[str]:
        return [email.strip().lower() for email in self.SUPER_ADMIN_EMAILS.split(",") if email.strip()]


settings = Settings()
