import React from 'react';
import { Hero } from '../components/home/Hero';
import { CampaignJourney } from '../components/home/CampaignJourney';
import { IntroSection } from '../components/home/IntroSection';
import { FeaturedEventsPreview } from '../components/home/FeaturedEventsPreview';
import { GalleryPreview } from '../components/home/GalleryPreview';
import { DevelopersPreview } from '../components/home/DevelopersPreview';
import { ClosingPledgeSection } from '../components/home/ClosingPledgeSection';

export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <CampaignJourney />
      <IntroSection />
      <FeaturedEventsPreview />
      <GalleryPreview />
      <DevelopersPreview />
      <ClosingPledgeSection />
    </>
  );
};
