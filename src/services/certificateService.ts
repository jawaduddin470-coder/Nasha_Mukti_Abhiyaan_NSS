/**
 * Certificate Service
 * NSS MJCET Nasha Mukti Abhiyaan
 */

import { apiClient, API_BASE_URL } from './apiClient';
import {
  CertificatePublicResponse,
  CertificateListResponse,
  CertificateSettingsResponse,
  CertificateSettingsUpdate,
} from '../types/certificate';

export const certificateService = {
  /**
   * Request authoritative certificate generation for a passed quiz attempt.
   * Idempotent: returns existing certificate if already generated.
   */
  async generateCertificate(attemptId: string): Promise<CertificatePublicResponse> {
    return apiClient.post<CertificatePublicResponse>('/certificates/generate', { attemptId });
  },

  /**
   * Check if a certificate has already been issued for an attempt.
   */
  async checkCertificateForAttempt(attemptId: string): Promise<CertificatePublicResponse | null> {
    try {
      const data = await apiClient.get<CertificatePublicResponse | null>(`/certificates/check/${attemptId}`);
      return data;
    } catch {
      return null;
    }
  },

  /**
   * Verify certificate details by certificate ID.
   */
  async getCertificateDetails(certificateId: string): Promise<CertificatePublicResponse> {
    return apiClient.get<CertificatePublicResponse>(`/certificates/${certificateId}`);
  },

  /**
   * Build direct URL to download or view the PDF certificate.
   */
  getDownloadUrl(certificateId: string, view = false): string {
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${base}/certificates/${certificateId}/download${view ? '?view=true' : ''}`;
  },

  // =========================================================================
  // ADMIN METHODS
  // =========================================================================

  /**
   * Fetch all issued certificates with search and filter.
   */
  async getAdminCertificates(params?: {
    search?: string;
    quizId?: string;
    limit?: number;
    skip?: number;
  }): Promise<CertificateListResponse> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.quizId && params.quizId !== 'all') query.append('quiz_id', params.quizId);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.skip) query.append('skip', params.skip.toString());

    const qs = query.toString();
    return apiClient.get<CertificateListResponse>(`/certificates/admin/list${qs ? `?${qs}` : ''}`);
  },

  /**
   * Fetch certificate configuration settings.
   */
  async getAdminSettings(): Promise<CertificateSettingsResponse> {
    return apiClient.get<CertificateSettingsResponse>('/certificates/admin/settings');
  },

  /**
   * Update certificate configuration parameters (Super Admin only).
   */
  async updateAdminSettings(payload: CertificateSettingsUpdate): Promise<CertificateSettingsResponse> {
    return apiClient.put<CertificateSettingsResponse>('/certificates/admin/settings', payload);
  },

  /**
   * Build URL for admin preview PDF.
   */
  getAdminPreviewPdfUrl(certType: string, testName?: string, fontSize?: number, yOffset?: number, xOffset?: number): string {
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const query = new URLSearchParams({ cert_type: certType });
    if (testName) query.append('test_name', testName);
    if (fontSize !== undefined) query.append('font_size', fontSize.toString());
    if (yOffset !== undefined) query.append('y_offset', yOffset.toString());
    if (xOffset !== undefined) query.append('x_offset', xOffset.toString());

    return `${base}/certificates/admin/preview?${query.toString()}`;
  },
};
