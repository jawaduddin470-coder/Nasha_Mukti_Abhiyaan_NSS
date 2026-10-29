/**
 * Developer & Contributor Data Types
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Prepared for Phase 5 MongoDB + Firebase CMS administration.
 */

export type ContributorRoleCategory =
  | 'engineering'
  | 'design'
  | 'nss_leadership'
  | 'mentorship'
  | 'documentation';

export type ContributorPublicationStatus = 'published' | 'draft' | 'archived';

export interface DeveloperSocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  email?: string;
}

export interface DeveloperProfile {
  id: string;
  fullName: string;
  role: string;
  roleCategory: ContributorRoleCategory;
  departmentOrAffiliation: string;
  bio: string;
  avatarUrl?: string;
  skills: string[];
  contributions: string[];
  socialLinks?: DeveloperSocialLinks;
  featured: boolean;
  displayOrder: number;
  publicationStatus: ContributorPublicationStatus;
  isPlaceholder?: boolean; // Clearly marks demo records per project rules
  createdAt: string;
  updatedAt: string;
}

export interface DeveloperFilterOptions {
  category?: ContributorRoleCategory | 'all';
  searchQuery?: string;
  featuredOnly?: boolean;
}

export interface DeveloperStats {
  totalContributors: number;
  engineersCount: number;
  designersCount: number;
  nssLeadsCount: number;
}
