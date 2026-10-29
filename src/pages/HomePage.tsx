import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { IntroSection } from '../components/home/IntroSection';
import { PillarsPreview } from '../components/home/PillarsPreview';
import { FeaturedEventsPreview } from '../components/home/FeaturedEventsPreview';
import { GalleryPreview } from '../components/home/GalleryPreview';
import { DevelopersPreview } from '../components/home/DevelopersPreview';
import { ClosingPledgeSection } from '../components/home/ClosingPledgeSection';
import { CinematicIntro } from '../components/3d/CinematicIntro';

export const HomePage: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('intro') === 'replay') {
        return true;
      }
      const hasWatched = localStorage.getItem('nss_intro_completed_v2');
      return !hasWatched;
    }
    return false;
  });

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleCompleteIntro = () => {
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && (
        <CinematicIntro onComplete={handleCompleteIntro} />
      )}
      <Hero onReplayIntro={handleReplayIntro} />
      <IntroSection />
      <PillarsPreview />
      <FeaturedEventsPreview />
      <GalleryPreview />
      <DevelopersPreview />
      <ClosingPledgeSection />
    </>
  );
};
