import React, { useEffect, useState } from 'react';
import { Code2 } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { ScrollReveal } from '../common/ScrollReveal';
import { DeveloperCard } from '../developers/DeveloperCard';
import { developerService } from '../../services/developerService';
import { DeveloperProfile } from '../../types/developer';

export const DevelopersPreview: React.FC = () => {
  const [developers, setDevelopers] = useState<DeveloperProfile[]>([]);

  useEffect(() => {
    const fetchFeaturedDevs = async () => {
      try {
        const data = await developerService.getProfiles();
        const targetNames = ['Mohammed Meraj Uddin', 'Shaik Adnan Hyder'];
        let matched = data.filter((p) =>
          targetNames.some((t) => p.fullName.toLowerCase().includes(t.toLowerCase()))
        );
        if (matched.length < 2) {
          matched = data.slice(0, 2);
        }
        setDevelopers(matched.slice(0, 2));
      } catch (err) {
        console.error('Failed to load developer profiles', err);
      }
    };
    fetchFeaturedDevs();
  }, []);

  return (
    <section
      id="developers"
      className="py-20 sm:py-28 relative overflow-hidden transition-colors duration-200 border-t border-[#CFE3F0] dark:border-[#243A5E]"
    >
      {/* Rich Atmospheric Background System */}
      <AtmosphericBackground variant="section-tonal" showRibbons />

      <Container size="wide" className="relative z-10">
        <ScrollReveal direction="up" delayMs={50}>
          <SectionHeader
            kicker="Platform Technologists"
            kickerVariant="teal"
            kickerIcon={<Code2 className="w-3.5 h-3.5" aria-hidden="true" />}
            title="Meet the Developers"
            subtitle="The NSS MJCET Nasha Mukti Abhiyaan web platform is designed, architected, and maintained by student technologist volunteers."
            align="center"
            className="max-w-3xl mx-auto"
          />
        </ScrollReveal>

        {/* Minimal 2-Column Developer Showcase with Guaranteed Equal Card Dimensions */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto items-stretch">
          {developers.map((dev, idx) => (
            <ScrollReveal
              key={dev.id}
              direction="up"
              delayMs={150 + idx * 100}
              className="h-full flex"
            >
              <DeveloperCard developer={dev} headingLevel="h3" />
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
