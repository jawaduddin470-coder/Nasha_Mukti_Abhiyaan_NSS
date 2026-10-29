import React, { useState, useEffect } from 'react';
import { Code2 } from 'lucide-react';
import { Container } from '../components/common/Container';
import { SectionHeader } from '../components/common/SectionHeader';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { LoadingState } from '../components/common/LoadingState';
import { DeveloperCard } from '../components/developers/DeveloperCard';
import { developerService } from '../services/developerService';
import { DeveloperProfile } from '../types/developer';

export const DevelopersPage: React.FC = () => {
  const [profiles, setProfiles] = useState<DeveloperProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const data = await developerService.getProfiles();
        // Requirement: Display exactly the two initial profiles
        // Prioritize Mohammed Meraj Uddin and Shaik Adnan Hyder
        const targetNames = ['Mohammed Meraj Uddin', 'Shaik Adnan Hyder'];
        let matched = data.filter((p) =>
          targetNames.some((t) => p.fullName.toLowerCase().includes(t.toLowerCase()))
        );

        if (matched.length < 2) {
          // If backend or fallback has other order, take first two published profiles
          matched = data.slice(0, 2);
        }

        // Ensure we display exactly two profiles
        setProfiles(matched.slice(0, 2));
      } catch (err) {
        console.error('Failed to fetch developer profiles', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="py-12 sm:py-20 bg-[#EAF6FC]/50 dark:bg-[#0B1524] relative overflow-hidden transition-colors duration-200">
      {/* Coherent Atmospheric Background with flowing ribbons and accelerated 35s watermark */}
      <AtmosphericBackground
        variant="page-header"
        showWatermark
        watermarkPosition="top-right"
        showRibbons
      />

      <Container size="wide" className="relative z-10">
        {/* Refined Section Header */}
        <ScrollReveal direction="up" delayMs={50}>
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <SectionHeader
              kicker="Platform Technologists"
              kickerVariant="teal"
              kickerIcon={<Code2 className="w-3.5 h-3.5" aria-hidden="true" />}
              title="Platform Developers"
              subtitle="The NSS MJCET Nasha Mukti Abhiyaan web platform is designed, architected, and maintained by student technologist volunteers."
              align="center"
              headingLevel="h1"
              className="mx-auto"
            />
          </div>
        </ScrollReveal>

        {/* Minimal 2-Profile Grid with Guaranteed Equal Card Dimensions */}
        {loading ? (
          <div className="py-24 flex justify-center">
            <LoadingState variant="spinner" label="Loading developer profiles..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8 sm:gap-12 items-stretch">
            {profiles.map((profile, idx) => (
              <ScrollReveal
                key={profile.id}
                direction="up"
                delayMs={100 + idx * 100}
                className="h-full flex"
              >
                <DeveloperCard developer={profile} headingLevel="h2" />
              </ScrollReveal>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default DevelopersPage;
