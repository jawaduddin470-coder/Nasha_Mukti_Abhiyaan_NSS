import React from 'react';
import { MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CAMPAIGN_EVENTS } from '../../data/eventsData';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { ScrollReveal } from '../common/ScrollReveal';

export const FeaturedEventsPreview: React.FC = () => {
  const featuredEvents = CAMPAIGN_EVENTS.filter((e) => e.featured).slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="teal" size="sm">Upcoming</Badge>;
      case 'ongoing':
        return <Badge variant="emerald" size="sm">Active Today</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Completed</Badge>;
    }
  };

  return (
    <section className="py-16 sm:py-24 border-t border-[#CFE3F0] dark:border-[#243A5E] relative overflow-hidden transition-colors duration-200" aria-labelledby="featured-events-heading">
      <AtmosphericBackground variant="section-tonal" showRibbons />
      <Container size="wide" className="relative z-10">
        <ScrollReveal direction="up" delayMs={50}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <SectionHeader
              kicker="Campus Initiatives"
              kickerVariant="emerald"
              title="Active &amp; Upcoming Drives"
              subtitle="Engage in student rallies, verified mental health dialogues, and youth pledge drives led by the NSS MJCET cohort."
              className="mb-0"
            />

            <Button
              to="/activities"
              variant="secondary"
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              className="self-start md:self-auto shrink-0 bg-[#EAF5FB]/90 dark:bg-[#14243D] dark:text-white border-[#CFE3F0] dark:border-[#243A5E]"
            >
              View All Activities
            </Button>
          </div>
        </ScrollReveal>

        {/* Editorial Event List Rows with Distinct Left Accent Indicator */}
        <div className="space-y-4">
          {featuredEvents.map((event, idx) => (
            <ScrollReveal key={event.id} direction="up" delayMs={100 + idx * 80}>
              <div
                className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] border-l-4 border-l-[#159E9A] hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1 transition-all duration-200 shadow-soft-card hover:shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer"
              >
                <div className="flex items-start gap-5">
                  {/* Date Block */}
                  <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-[#DCEBF5] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] text-[#183153] dark:text-white shadow-2xs shrink-0">
                    <span className="text-xs uppercase font-bold text-[#159E9A] dark:text-[#5EEAD4]">
                      {new Date(event.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-xl font-bold font-serif">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      {getStatusBadge(event.status)}
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                        {event.category.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-sm text-[#334C73] dark:text-slate-300 max-w-2xl leading-relaxed">
                      {event.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        {event.timeDisplay}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#239B70]" aria-hidden="true" />
                        {event.venue}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#4F8FE8]" aria-hidden="true" />
                        {event.targetAudience}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center md:items-end justify-between md:justify-center shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#CFE3F0] dark:border-[#243A5E]">
                  <span className="text-xs font-semibold text-[#0F8380] dark:text-slate-300 bg-[#DDF3F0] dark:bg-[#1B2F4E] px-3 py-1 rounded-full border border-[#99F6E4] dark:border-[#243A5E]">
                    {event.registrationRequired ? 'Registration Open' : 'Open Entry'}
                  </span>
                  <span className="text-xs font-bold text-[#159E9A] dark:text-[#5EEAD4] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-2">
                    Details &rarr;
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
