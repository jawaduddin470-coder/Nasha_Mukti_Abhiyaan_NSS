/**
 * Activity Data Models & Types
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Prepared for Phase 5 MongoDB + Firebase Authentication integration.
 * Defines strict schema types for activities, categories, organizers, and impact metrics.
 */

export type ActivityCategory =
  | 'rallies'
  | 'pledges'
  | 'seminars'
  | 'street-plays'
  | 'workshops'
  | 'counseling'
  | 'awareness_drives'
  | 'educational_outreach'
  | 'health_initiatives'
  | 'community_service'
  | 'campus_campaigns'
  | 'creative_contests';

export type ActivityStatus = 'upcoming' | 'ongoing' | 'completed';

export type ActivityPublicationStatus = 'draft' | 'published' | 'archived';

export interface ActivityCategoryMeta {
  id: ActivityCategory;
  label: string;
  shortDescription: string;
  accentColor: 'saffron' | 'green' | 'blue' | 'navy' | 'gold';
  iconName: string;
}

export interface ActivityMilestone {
  time: string;
  title: string;
  description?: string;
  speakerOrLead?: string;
}

export interface ActivityImpactMetrics {
  volunteersCount?: number;
  attendeesCount?: number;
  pledgeSignatures?: number;
  resourcesDistributed?: number;
  hoursDedicated?: number;
}

export interface Activity {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: ActivityCategory;
  status: ActivityStatus;
  publicationStatus: ActivityPublicationStatus;
  featured: boolean;
  displayOrder: number;

  // Schedule & Venue
  date: string; // ISO 8601 (YYYY-MM-DD)
  timeDisplay: string;
  venue: string;
  venueType: 'campus' | 'community' | 'virtual';
  targetAudience: string;

  // Organization & Personnel
  coordinators: string[];
  facultyAdvisors?: string[];
  partnerOrganizations?: string[];

  // Participation & Actions
  registrationRequired: boolean;
  registrationUrl?: string;
  registrationDeadline?: string;
  maxParticipants?: number;

  // Media & Documentation
  coverImage: string;
  galleryImages?: string[];
  tags: string[];

  // Editorial & Impact
  agenda?: ActivityMilestone[];
  impactMetrics?: ActivityImpactMetrics;
  keyTakeaways?: string[];

  // Audit Timestamps (Phase 5 MongoDB standard)
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ActivityFilterOptions {
  category?: ActivityCategory | 'all';
  status?: ActivityStatus | 'all';
  searchQuery?: string;
  featuredOnly?: boolean;
}

export interface ActivityStats {
  totalActivities: number;
  upcomingCount: number;
  completedCount: number;
  totalVolunteersEngaged: number;
  totalPledgeSignatures: number;
}
