import { apiClient } from './apiClient';
import {
  HomepageConfigUpdate,
  HomepagePublicResponse,
  HomepageAdminResponse,
} from '../types/homepage';

class HomepageService {
  /**
   * Fetches published activities and gallery selections for public homepage
   */
  async getPublicHomepage(): Promise<HomepagePublicResponse> {
    try {
      const data = await apiClient.get<HomepagePublicResponse>('/homepage/public');
      if (data && (Array.isArray(data.featuredActivities) || Array.isArray(data.featuredGallery))) {
        return data;
      }
    } catch (e) {
      console.warn('Backend /homepage/public failed, falling back:', e);
    }
    return {
      featuredActivities: [],
      featuredGallery: [],
      isCustomized: false,
    };
  }

  /**
   * Fetches full administrative homepage content manager data
   */
  async getAdminHomepage(): Promise<HomepageAdminResponse> {
    return apiClient.get<HomepageAdminResponse>('/admin/homepage');
  }

  /**
   * Saves modified homepage selections to draft
   */
  async updateDraft(payload: HomepageConfigUpdate): Promise<HomepageAdminResponse> {
    return apiClient.put<HomepageAdminResponse>('/admin/homepage/draft', payload);
  }

  /**
   * Publishes draft selections to live public homepage
   */
  async publishChanges(): Promise<HomepageAdminResponse> {
    const res = await apiClient.post<HomepageAdminResponse>('/admin/homepage/publish');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('nmba_cms_updated', {
          detail: { type: 'homepage' },
        })
      );
    }
    return res;
  }

  /**
   * Reverts unpublished draft changes back to live published selections
   */
  async revertChanges(): Promise<HomepageAdminResponse> {
    return apiClient.post<HomepageAdminResponse>('/admin/homepage/revert');
  }
}

export const homepageService = new HomepageService();
