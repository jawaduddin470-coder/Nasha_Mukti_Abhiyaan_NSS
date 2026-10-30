import { Activity } from './activity';
import { GalleryItem } from './gallery';

export interface FeaturedActivityItem {
  activityId: string;
  displayOrder: number;
  enabled: boolean;
}

export interface FeaturedGalleryItem {
  photoId: string;
  displayOrder: number;
  enabled: boolean;
}

export interface HomepageConfigUpdate {
  featuredActivities: FeaturedActivityItem[];
  featuredGallery: FeaturedGalleryItem[];
}

export interface HomepagePublicResponse {
  featuredActivities: Activity[];
  featuredGallery: GalleryItem[];
  isCustomized: boolean;
}

export interface PopulatedFeaturedActivity {
  activityId: string;
  displayOrder: number;
  enabled: boolean;
  activity?: Activity;
}

export interface PopulatedFeaturedGallery {
  photoId: string;
  displayOrder: number;
  enabled: boolean;
  photo?: GalleryItem;
}

export interface HomepageAdminResponse {
  publishedConfig: HomepageConfigUpdate;
  draftConfig: HomepageConfigUpdate;
  hasUnpublishedChanges: boolean;
  lastPublishedAt?: string | null;
  lastSavedAt?: string | null;
  updatedBy?: string | null;
  draftActivities: PopulatedFeaturedActivity[];
  draftGallery: PopulatedFeaturedGallery[];
  publishedActivities: PopulatedFeaturedActivity[];
  publishedGallery: PopulatedFeaturedGallery[];
  availableActivities: Activity[];
  availableGallery: GalleryItem[];
}
