import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Users, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { activityService } from '../../services/activityService';
import { homepageService } from '../../services/homepageService';
import { Activity } from '../../types/activity';
import { resolveMediaUrl, handleMediaError } from '../../utils/mediaHelper';

export const FeaturedEventsPreview: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const sectionRef = React.useRef<HTMLElement>(null);

  const fetchActivities = useCallback(async () => {
    try {
      // First query Homepage Content Manager published selections
      const hpData = await homepageService.getPublicHomepage();
      if (hpData && Array.isArray(hpData.featuredActivities) && hpData.featuredActivities.length > 0) {
        setActivities(hpData.featuredActivities);
        return;
      }

      // Intentional Fallback: Fetch published activities from MongoDB via FastAPI
      const data = await activityService.getActivities();
      // Prioritize upcoming or high-order published activities, taking top 3
      const sorted = [...data].sort((a, b) => {
        // Upcoming drives first
        if (a.status === 'upcoming' && b.status !== 'upcoming') return -1;
        if (b.status === 'upcoming' && a.status !== 'upcoming') return 1;
        return (a.displayOrder || 99) - (b.displayOrder || 99);
      });
      const top3 = sorted.slice(0, 3);
      setActivities(top3);
    } catch (err) {
      console.error('Failed to load featured activities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();

    // Listen for live CMS updates dispatched from Admin Panel
    const handleCmsUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (!custom.detail || custom.detail.type === 'activities' || custom.detail.type === 'homepage') {
        fetchActivities();
      }
    };

    window.addEventListener('nmba_cms_updated', handleCmsUpdate);
    window.addEventListener('focus', fetchActivities);

    return () => {
      window.removeEventListener('nmba_cms_updated', handleCmsUpdate);
      window.removeEventListener('focus', fetchActivities);
    };
  }, [fetchActivities]);

  // Sequential Staggered Animations
  useEffect(() => {
    if (loading || activities.length === 0) return;

    // Accessibility: Respect prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setRevealedCards(new Array(activities.length).fill(true));
        return;
      }
    }

    // Set initial state
    setRevealedCards(new Array(activities.length).fill(false));

    // IntersectionObserver to start sequential animation when in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reveal cards sequentially with a natural 350ms stagger
          activities.forEach((_, idx) => {
            setTimeout(() => {
              setRevealedCards((prev) => {
                const next = [...prev];
                next[idx] = true;
                return next;
              });
            }, idx * 350);
          });
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { threshold: 0.15 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loading, activities]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return <Badge variant="teal" size="sm">Upcoming</Badge>;
      case 'ongoing':
      case 'active':
        return <Badge variant="emerald" size="sm">Active Today</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Completed</Badge>;
    }
  };

  const formatMonth = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return 'DRIVE';
      return d.toLocaleString('default', { month: 'short' });
    } catch {
      return 'DRIVE';
    }
  };

  const formatDay = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '•';
      return d.getDate();
    } catch {
      return '•';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-24 border-t border-[#CFE3F0] dark:border-[#243A5E] relative overflow-hidden transition-colors duration-200"
      aria-labelledby="featured-events-heading"
    >
      <AtmosphericBackground variant="section-tonal" showRibbons />
      <Container size="wide" className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader
            kicker="Campus Initiatives"
            kickerVariant="emerald"
            kickerIcon={<Sparkles className="w-3.5 h-3.5 text-[#239B70]" aria-hidden="true" />}
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

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="p-6 sm:p-7 rounded-2xl bg-[#EAF5FB]/60 dark:bg-[#14243D]/60 border border-[#CFE3F0] dark:border-[#243A5E] animate-pulse flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-5 w-full">
                  <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
                  <div className="space-y-2.5 w-full max-w-xl">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic CMS-Driven Activity Cards */}
        {!loading && activities.length > 0 && (
          <div className="space-y-4">
            {activities.map((activity, idx) => {
              const isRevealed = revealedCards[idx] ?? true;
              const hasCover = Boolean(activity.coverImage && activity.coverImage.trim());
              const coverSrc = resolveMediaUrl(activity.coverImage);

              return (
                <div
                  key={activity.id || idx}
                  className={`p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] border-l-4 border-l-[#159E9A] hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-soft-card hover:shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer ${
                    isRevealed
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-6 pointer-events-none'
                  }`}
                  onClick={() => {
                    window.location.href = `/activities#${activity.slug || activity.id}`;
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${activity.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      window.location.href = `/activities#${activity.slug || activity.id}`;
                    }
                  }}
                >
                  <div className="flex items-start gap-5 min-w-0">
                    {/* Visual Media Block: Uploaded Cover Image or Editorial Date Block */}
                    {hasCover ? (
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#CFE3F0] dark:border-[#243A5E] bg-[#DCEBF5] dark:bg-[#1B2F4E] shrink-0 shadow-2xs group-hover:scale-102 transition-transform duration-500">
                        <img
                          src={coverSrc}
                          alt={activity.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => handleMediaError(e, activity.title, activity.category)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-black/60 text-white backdrop-blur-xs">
                          {formatMonth(activity.date)} {formatDay(activity.date)}
                        </span>
                      </div>
                    ) : (
                      <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-[#DCEBF5] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] text-[#183153] dark:text-white shadow-2xs shrink-0">
                        <span className="text-xs uppercase font-bold text-[#159E9A] dark:text-[#5EEAD4]">
                          {formatMonth(activity.date)}
                        </span>
                        <span className="text-xl font-bold font-serif">
                          {formatDay(activity.date)}
                        </span>
                      </div>
                    )}

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {getStatusBadge(activity.status)}
                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                          {(activity.category || 'Initiative').replace(/[-_]/g, ' ')}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors leading-snug">
                        {activity.title}
                      </h3>

                      <p className="text-sm text-[#334C73] dark:text-slate-300 max-w-2xl leading-relaxed line-clamp-2">
                        {activity.summary || activity.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                        {activity.timeDisplay && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                            {activity.timeDisplay}
                          </span>
                        )}
                        {activity.venue && (
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#239B70]" aria-hidden="true" />
                            {activity.venue}
                          </span>
                        )}
                        {activity.targetAudience && (
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#4F8FE8]" aria-hidden="true" />
                            {activity.targetAudience}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center md:items-end justify-between md:justify-center shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#CFE3F0] dark:border-[#243A5E]">
                    <span className="text-xs font-semibold text-[#0F8380] dark:text-slate-300 bg-[#DDF3F0] dark:bg-[#1B2F4E] px-3 py-1 rounded-full border border-[#99F6E4] dark:border-[#243A5E]">
                      {activity.status === 'upcoming' ? 'Open Participation' : 'Documented Drive'}
                    </span>
                    <span className="text-xs font-bold text-[#159E9A] dark:text-[#5EEAD4] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-2">
                      View Drive &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && activities.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-[#EAF5FB]/80 dark:bg-[#14243D]/80 border border-[#CFE3F0] dark:border-[#243A5E]">
            <p className="text-sm font-medium text-[#183153] dark:text-slate-300">
              New campaign drives are being scheduled by the NSS MJCET team.
            </p>
            <Button to="/activities" variant="secondary" size="sm" className="mt-4">
              Browse Activities Archive
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
};
