/**
 * Legacy eventsData re-export (Maintained for backward compatibility; see activitiesData.ts)
 */
import { CAMPAIGN_ACTIVITIES } from './activitiesData';
import { CampaignEvent } from '../types/event';

// Map activities to legacy CampaignEvent structure
export const CAMPAIGN_EVENTS: CampaignEvent[] = CAMPAIGN_ACTIVITIES.map((act) => ({
  id: act.id,
  title: act.title,
  slug: act.slug,
  summary: act.summary,
  description: act.description,
  category: (act.category === 'campus_campaigns' || act.category === 'awareness_drives'
    ? 'rally'
    : act.category === 'educational_outreach'
    ? 'workshop'
    : act.category === 'creative_contests'
    ? 'competition'
    : 'seminar') as CampaignEvent['category'],
  status: act.status,
  date: act.date,
  timeDisplay: act.timeDisplay,
  venue: act.venue,
  venueType: act.venueType,
  targetAudience: act.targetAudience,
  coordinators: act.coordinators,
  registrationRequired: act.registrationRequired,
  featured: act.featured,
  coverImage: act.coverImage,
  tags: act.tags,
}));

export default CAMPAIGN_EVENTS;
