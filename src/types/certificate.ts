/**
 * Certificate System Frontend Types
 * NSS MJCET Nasha Mukti Abhiyaan
 */

export type CertificateType = 'anti_drug_awareness' | 'national_unity_day';

export interface CertificatePublicResponse {
  certificateId: string;
  quizId: string;
  quizTitle: string;
  certificateType: CertificateType;
  participantName: string;
  participantInstitution: string;
  participantRollNumber?: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  issuedAt: string;
  downloadUrl: string;
  previewUrl?: string;
  fontUsed: string;
}

export interface CertificateAdminItem {
  id: string;
  certificateId: string;
  attemptId: string;
  quizId: string;
  quizTitle: string;
  certificateType: CertificateType;
  participantName: string;
  participantEmail: string;
  participantInstitution: string;
  participantRollNumber?: string;
  score: number;
  maxScore: number;
  percentage: number;
  issuedAt: string;
  downloadCount: number;
  lastDownloadedAt?: string;
  downloadUrl: string;
}

export interface CertificateSettingsItem {
  certificateType: CertificateType;
  enabled: boolean;
  title: string;
  quizId: string;
  idPrefix: string;
  fontSize: number;
  fontColor: string;
  yOffset: number;
  xOffset: number;
  fontFamily: string;
  templateVersion: string;
  previewImageUrl: string;
}

export interface CertificateSettingsResponse {
  antiDrug: CertificateSettingsItem;
  unityDay: CertificateSettingsItem;
}

export interface CertificateSettingsUpdate {
  antiDrugEnabled?: boolean;
  unityDayEnabled?: boolean;
  antiDrugFontSize?: number;
  unityDayFontSize?: number;
  antiDrugYOffset?: number;
  unityDayYOffset?: number;
  antiDrugXOffset?: number;
  unityDayXOffset?: number;
}

export interface CertificateListResponse {
  total: number;
  certificates: CertificateAdminItem[];
}
