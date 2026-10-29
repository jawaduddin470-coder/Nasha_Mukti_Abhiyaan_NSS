import React from 'react';
import { ArrowRight, Brain, UserCheck, Activity, HeartHandshake } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { AWARENESS_PILLARS } from '../../data/awarenessData';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { ScrollReveal } from '../common/ScrollReveal';

export const PillarsPreview: React.FC = () => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'substance_education':
        return <Brain className="w-5 h-5 text-[#159E9A]" aria-hidden="true" />;
      case 'peer_influence':
        return <UserCheck className="w-5 h-5 text-[#239B70]" aria-hidden="true" />;
      case 'mental_wellbeing':
        return <Activity className="w-5 h-5 text-[#4F8FE8]" aria-hidden="true" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-[#0F8380]" aria-hidden="true" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#E8F3FA] via-[#F0F7FB] to-[#E3F1F8] dark:from-[#0B1524] dark:via-[#0F1D33] dark:to-[#0B1524] relative overflow-hidden transition-colors duration-200" aria-labelledby="pillars-preview-heading">
      <AtmosphericBackground variant="mesh-subtle" showRibbons={false} />
      <Container size="wide" className="relative z-10">
        <ScrollReveal direction="up" delayMs={50}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <SectionHeader
              kicker="Educational Curriculum"
              kickerVariant="teal"
              title="Four Pillars of Awareness &amp; Prevention"
              subtitle="Clear, science-backed knowledge designed to help students evaluate risks, dismantle peer pressure, and understand recovery."
              className="mb-0"
            />

            <Button
              to="/awareness"
              variant="outline"
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              className="self-start md:self-auto shrink-0 bg-[#EAF5FB]/90 dark:bg-[#14243D] dark:text-white border-[#CFE3F0] dark:border-[#243A5E]"
            >
              Explore Complete Curriculum
            </Button>
          </div>
        </ScrollReveal>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {AWARENESS_PILLARS.slice(0, 4).map((pillar, idx) => (
            <ScrollReveal key={pillar.id} direction="up" delayMs={100 + idx * 80}>
              <div
                className="p-8 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/90 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 hover:shadow-elevated transition-all duration-300 flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#DCEBF5] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-center">
                        {getIcon(pillar.category)}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        PILLAR 0{idx + 1}
                      </span>
                    </div>
                    <Badge variant="teal" size="sm">
                      {pillar.shortTag}
                    </Badge>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#0F8380] dark:text-[#5EEAD4] font-medium">
                    {pillar.tagline}
                  </p>
                  <p className="mt-4 text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                    {pillar.summary}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-between text-xs">
                  <span className="text-[#4F678A] dark:text-slate-300 font-medium italic">
                    &ldquo;{pillar.keyTakeaway}&rdquo;
                  </span>
                  <span className="text-[#159E9A] dark:text-[#5EEAD4] font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read &rarr;
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
};
