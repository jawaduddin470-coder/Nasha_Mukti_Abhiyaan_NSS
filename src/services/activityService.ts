/**
 * Activity Service Layer
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Provides typed data access for Campaign Activities.
 * Queries the FastAPI REST API with seamless fallback to curated local records.
 */

import { CAMPAIGN_ACTIVITIES, ACTIVITY_CATEGORIES } from '../data/activitiesData';
import {
  Activity,
  ActivityCategoryMeta,
  ActivityFilterOptions,
  ActivityStats,
} from '../types/activity';
import { apiClient } from './apiClient';

export const activityService = {
  /**
   * Retrieves all published activities matching optional filter criteria.
   */
  async getActivities(filters?: ActivityFilterOptions): Promise<Activity[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.featuredOnly) params.append('featuredOnly', 'true');
      if (filters?.searchQuery) params.append('searchQuery', filters.searchQuery);

      const qs = params.toString() ? `?${params.toString()}` : '';
      const data = await apiClient.get<Activity[]>(`/activities${qs}`);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Backend activity fetch failed, using local dataset fallback:', e);
    }

    // Local curated fallback
    let results = CAMPAIGN_ACTIVITIES.filter(
      (item) => item.publicationStatus === 'published'
    );

    if (!filters) {
      return results.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    if (filters.category && filters.category !== 'all') {
      results = results.filter((item) => item.category === filters.category);
    }

    if (filters.status && filters.status !== 'all') {
      results = results.filter((item) => item.status === filters.status);
    }

    if (filters.featuredOnly) {
      results = results.filter((item) => item.featured);
    }

    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.venue.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return results.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  /**
   * Retrieves an activity by its unique SEO slug.
   */
  async getActivityBySlug(slug: string): Promise<Activity | null> {
    try {
      const data = await apiClient.get<Activity>(`/activities/${encodeURIComponent(slug)}`);
      if (data && data.id) return data;
    } catch {
      // fallback
    }
    const found = CAMPAIGN_ACTIVITIES.find((item) => item.slug === slug);
    return found || null;
  },

  /**
   * Retrieves an activity by its ID.
   */
  async getActivityById(id: string): Promise<Activity | null> {
    const list = await this.getActivities();
    return list.find((item) => item.id === id) || null;
  },

  /**
   * Retrieves all predefined activity categories with visual metadata.
   */
  getCategories(): ActivityCategoryMeta[] {
    return ACTIVITY_CATEGORIES;
  },

  /**
   * Computes aggregate metrics across campaign drives.
   */
  async getActivityStats(): Promise<ActivityStats> {
    const all = await this.getActivities();
    const upcoming = all.filter((a) => a.status === 'upcoming').length;
    const completed = all.filter((a) => a.status === 'completed').length;

    return {
      totalActivities: all.length,
      upcomingCount: upcoming,
      completedCount: completed,
      totalVolunteersEngaged: 1200,
      totalPledgeSignatures: 4900,
    };
  },

  async getStats(): Promise<ActivityStats> {
    return this.getActivityStats();
  },
};
