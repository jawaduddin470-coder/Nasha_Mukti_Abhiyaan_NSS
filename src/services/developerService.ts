/**
 * Developer Service Layer
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Provides contributor profiles from FastAPI backend with fallback to curated records.
 */

import { DEVELOPER_PROFILES } from '../data/developersData';
import {
  DeveloperProfile,
  DeveloperFilterOptions,
  DeveloperStats,
} from '../types/developer';
import { apiClient } from './apiClient';

function normalizeDeveloper(doc: any): DeveloperProfile {
  return {
    id: doc.id || doc._id || `dev-${Math.random()}`,
    fullName: doc.fullName || '',
    role: doc.role || '',
    roleCategory: doc.roleCategory || 'engineering',
    departmentOrAffiliation: doc.departmentOrAffiliation || 'MJCET',
    bio: doc.bio || '',
    avatarUrl: doc.avatarUrl || '',
    skills: Array.isArray(doc.skills) ? doc.skills : [],
    contributions:
      Array.isArray(doc.contributions) && doc.contributions.length > 0
        ? doc.contributions
        : [
            'Full-stack architecture and interactive 3D web engineering',
            'National Service Scheme campus digital outreach and substance education',
          ],
    socialLinks: {
      github: doc.githubUrl || doc.socialLinks?.github || '',
      linkedin: doc.linkedinUrl || doc.socialLinks?.linkedin || '',
      portfolio: doc.otherUrl || doc.socialLinks?.portfolio || '',
    },
    featured: Boolean(doc.featured),
    displayOrder: typeof doc.displayOrder === 'number' ? doc.displayOrder : 1,
    publicationStatus: doc.publicationStatus || 'published',
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
  };
}

export const developerService = {
  /**
   * Retrieves all published developer profiles with optional filtering.
   */
  async getProfiles(filters?: DeveloperFilterOptions): Promise<DeveloperProfile[]> {
    try {
      const data = await apiClient.get<any[]>('/developers');
      if (Array.isArray(data) && data.length > 0) {
        let list = data.map(normalizeDeveloper);
        if (filters?.category && filters.category !== 'all') {
          list = list.filter((p) => p.roleCategory === filters.category);
        }
        if (filters?.featuredOnly) {
          list = list.filter((p) => p.featured);
        }
        return list.sort((a, b) => a.displayOrder - b.displayOrder);
      }
    } catch (e) {
      console.warn('Backend developers fetch failed, using local fallback:', e);
    }

    let list = DEVELOPER_PROFILES.filter(
      (p) => p.publicationStatus === 'published'
    );

    if (!filters) {
      return list.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    if (filters.category && filters.category !== 'all') {
      list = list.filter((p) => p.roleCategory === filters.category);
    }

    if (filters.featuredOnly) {
      list = list.filter((p) => p.featured);
    }

    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.departmentOrAffiliation.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  },

  /**
   * Retrieves a single contributor profile by ID.
   */
  async getProfileById(id: string): Promise<DeveloperProfile | null> {
    const list = await this.getProfiles();
    return list.find((p) => p.id === id) || null;
  },

  /**
   * Retrieves summary metrics across contributors.
   */
  async getStats(): Promise<DeveloperStats> {
    const list = await this.getProfiles();
    const engineers = list.filter((p) => p.roleCategory === 'engineering').length;
    const design = list.filter((p) => p.roleCategory === 'design').length;
    const nssLeads = list.filter((p) => p.roleCategory === 'nss_leadership' || p.roleCategory === 'mentorship').length;

    return {
      totalContributors: list.length,
      engineersCount: engineers,
      designersCount: design,
      nssLeadsCount: nssLeads,
    };
  },
};
