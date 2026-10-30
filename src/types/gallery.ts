/**
 * Gallery Data Models & Types
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Prepared for Phase 5 MongoDB + Firebase Storage integration.
 * Image-only media schema supporting 3D spatial rendering,
 * accessible lightbox, memory constellations, and CMS administration.
 */

export type GalleryCategory =
  | 'rallies'
  | 'pledges'
  | 'seminars'
  | 'street-plays'
  | 'workshops'
  | 'counseling'
  | 'awareness_campaigns'
  | 'educational_outreach'
  | 'health_initiatives'
  | 'community_service'
  | 'campus_activities'
  | 'pledge_drives';

export type GalleryPublicationStatus = 'draft' | 'published' | 'archived';

export interface GalleryCategoryMeta {
  id: GalleryCategory;
  label: string;
  description: string;
  count?: number;
  badgeVariant: 'saffron' | 'green' | 'blue' | 'neutral';
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  extendedStory?: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  category: GalleryCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  location: string;
  tags: string[];

  // Spatial & 3D attributes for Constellation / Orbit view
  featuredIn3D?: boolean;
  orbitRadius?: number; // relative distance in 3D orbit
  constellationPosition?: [number, number, number]; // [x, y, z] coordinate in 3D space
  constellationConnections?: string[]; // IDs of related memory nodes to draw lines to

  // Administrative & Publishing metadata (Phase 5)
  publicationStatus: GalleryPublicationStatus;
  displayOrder: number;
  photographerCredit?: string;
  activityId?: string; // Relation to associated Activity
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryFilterOptions {
  category?: GalleryCategory | 'all';
  searchQuery?: string;
  featuredOnly?: boolean;
}

export interface GalleryCollection {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  itemCount: number;
  category: GalleryCategory;
}

export interface GalleryStats {
  totalPhotos: number;
  categoriesCount: number;
  drivesDocumented: number;
  totalViews: number;
}
