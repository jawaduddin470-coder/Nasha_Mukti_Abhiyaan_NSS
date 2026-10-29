import React from 'react';
import { ActivitiesPage } from './ActivitiesPage';

/**
 * Legacy EventsPage wrapper (Maintained for backward route compatibility; canonical route is /activities)
 */
export const EventsPage: React.FC = () => {
  return <ActivitiesPage />;
};

export default EventsPage;
