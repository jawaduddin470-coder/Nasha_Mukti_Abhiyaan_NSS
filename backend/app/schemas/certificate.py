"""
Certificate System Pydantic Schemas
NSS MJCET Nasha Mukti Abhiyaan
"""

from typing import Optional, Literal, List
from pydantic import BaseModel, Field


class CertificatePublicResponse(BaseModel):
    certificateId: str
    quizId: str
    quizTitle: str
    certificateType: Literal["anti_drug_awareness", "national_unity_day"]
    participantName: str
    participantInstitution: str
    participantRollNumber: Optional[str] = ""
    score: int
    maxScore: int
    percentage: int
    passed: bool
    issuedAt: str
    downloadUrl: str
    previewUrl: Optional[str] = None
    fontUsed: str


class CertificateGenerateRequest(BaseModel):
    attemptId: str


class CertificateAdminItem(BaseModel):
    id: str
    certificateId: str
    attemptId: str
    quizId: str
    quizTitle: str
    certificateType: Literal["anti_drug_awareness", "national_unity_day"]
    participantName: str
    participantEmail: str
    participantInstitution: str
    participantRollNumber: Optional[str] = ""
    score: int
    maxScore: int
    percentage: int
    issuedAt: str
    downloadCount: int = 0
    lastDownloadedAt: Optional[str] = None
    downloadUrl: str


class CertificateSettingsItem(BaseModel):
    certificateType: Literal["anti_drug_awareness", "national_unity_day"]
    enabled: bool = True
    title: str
    quizId: str
    idPrefix: str
    fontSize: int
    fontColor: str
    yOffset: float = 0.0
    xOffset: float = 0.0
    fontFamily: str
    templateVersion: str = "1.0"
    previewImageUrl: str


class CertificateSettingsResponse(BaseModel):
    antiDrug: CertificateSettingsItem
    unityDay: CertificateSettingsItem


class CertificateSettingsUpdate(BaseModel):
    antiDrugEnabled: Optional[bool] = None
    unityDayEnabled: Optional[bool] = None
    antiDrugFontSize: Optional[int] = None
    unityDayFontSize: Optional[int] = None
    antiDrugYOffset: Optional[float] = None
    unityDayYOffset: Optional[float] = None
    antiDrugXOffset: Optional[float] = None
    unityDayXOffset: Optional[float] = None


class CertificateListResponse(BaseModel):
    total: int
    certificates: List[CertificateAdminItem]
