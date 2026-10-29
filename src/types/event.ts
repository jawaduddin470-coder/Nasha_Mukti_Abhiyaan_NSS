/**
 * Event Data Types (Maintained for backward compatibility; see activity.ts for canonical models)
 */

import { Activity } from './activity';

export type EventCategory = 'rally' | 'workshop' | 'pledge_drive' | 'seminar' | 'competition';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed';

export interface CampaignEvent {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  date: string; // ISO 8601 date string (e.g., '2026-11-15')
  timeDisplay: string;
  venue: string;
  venueType: 'campus' | 'community' | 'virtual';
  targetAudience: string;
  coordinators: string[];
  registrationRequired: boolean;
  featured: boolean;
  coverImage?: string;
  tags: string[];
}

// Compatibility alias
export type { Activity };
