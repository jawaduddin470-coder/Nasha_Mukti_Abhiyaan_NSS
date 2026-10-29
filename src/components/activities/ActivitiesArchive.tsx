import React from 'react';
import { Archive, MapPin, Users, Award } from 'lucide-react';
import { Activity } from '../../types/activity';
import { SectionHeader } from '../common/SectionHeader';
import { ScrollReveal } from '../common/ScrollReveal';

interface ActivitiesArchiveProps {
  completedActivities: Activity[];
  onOpenDetails: (activity: Activity) => void;
}

export const ActivitiesArchive: React.FC<ActivitiesArchiveProps> = ({
  completedActivities,
  onOpenDetails,
}) => {
  if (completedActivities.length === 0) return null;

  return (
    <section className="mt-6 pt-10 border-t border-[#D7E7F0] dark:border-[#243A5E]">
      <ScrollReveal direction="up" delayMs={50}>
        <SectionHeader
          kicker="Documentation &amp; Legacy"
          kickerVariant="teal"
          kickerIcon={<Archive className="w-3.5 h-3.5" aria-hidden="true" />}
          title="Past Activities &amp; Community Archive"
          subtitle="A transparent record of executed student drives, verified participant turnouts, and field interventions conducted across Telangana."
          headingLevel="h2"
          className="mb-10"
        />
      </ScrollReveal>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D7E7F0] dark:border-[#243A5E] space-y-10">
        {completedActivities.map((act, idx) => (
          <ScrollReveal key={act.id} direction="up" delayMs={80 + idx * 50}>
            <div className="relative group">
              {/* Timeline Indicator Dot */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#EAF5FB] dark:bg-[#14243D] border-2 border-[#159E9A] shadow-xs group-hover:scale-125 transition-transform"
                aria-hidden="true"
              />

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#112036] border border-[#CFE3F0] dark:border-[#243A5E] border-l-4 border-l-[#159E9A] shadow-soft-card hover:shadow-card hover:border-[#159E9A] dark:hover:border-teal-500 transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F0FDFB] dark:bg-teal-950/50 text-[#159E9A] dark:text-[#5EEAD4] border border-[#99F6E4] dark:border-teal-800">
                      {act.date} &bull; {act.timeDisplay}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {act.category.replace('_', ' ')}
                  </span>
                </div>

                <h3
                  onClick={() => onOpenDetails(act)}
                  className="font-serif text-xl font-bold text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors cursor-pointer"
                >
                  {act.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed max-w-3xl">
                  {act.summary}
                </p>

                {/* Impact badges row */}
                <div className="mt-4 pt-4 border-t border-[#D7E7F0] dark:border-[#243A5E] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#239B70]" />
                      {act.venue}
                    </span>
                    {act.impactMetrics?.volunteersCount && (
                      <span className="flex items-center gap-1.5 font-medium text-[#183153] dark:text-slate-200">
                        <Users className="w-3.5 h-3.5 text-[#4F8FE8]" />
                        {act.impactMetrics.volunteersCount} Volunteers
                      </span>
                    )}
                    {act.impactMetrics?.pledgeSignatures && (
                      <span className="flex items-center gap-1.5 font-medium text-[#183153] dark:text-slate-200">
                        <Award className="w-3.5 h-3.5 text-[#239B70]" />
                        {act.impactMetrics.pledgeSignatures} Pledges
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenDetails(act)}
                    className="text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] hover:text-[#0F8380] inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] rounded"
                  >
                    View Report &rarr;
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
