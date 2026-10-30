import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
} from 'lucide-react';
import { Activity } from '../../types/activity';
import { Button } from '../common/Button';
import { resolveMediaUrl, handleMediaError } from '../../utils/mediaHelper';

const AUTOPLAY_INTERVAL_MS = 1800; // ~1.8s per automatic rotation (2x speed preserved)

interface RotatingActivitiesCarouselProps {
  activities: Activity[];
  onOpenDetails: (activity: Activity) => void;
  isModalOpen?: boolean;
}

export const RotatingActivitiesCarousel: React.FC<RotatingActivitiesCarouselProps> = ({
  activities,
  onOpenDetails,
  isModalOpen = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = activities.length;

  // Respect system prefers-reduced-motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsPlaying(false);
      }
      const listener = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
        if (e.matches) {
          setIsPlaying(false);
        }
      };
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay timer: begins promptly within 1.2s upon mount, then rotates continuously at exactly 1800ms
  useEffect(() => {
    if (!isPlaying || isHovered || isInteracting || isModalOpen || total <= 1) return;

    let intervalTimer: ReturnType<typeof setInterval> | null = null;
    const initialTimer = setTimeout(() => {
      handleNext();
      intervalTimer = setInterval(() => {
        handleNext();
      }, AUTOPLAY_INTERVAL_MS);
    }, 1200);

    return () => {
      clearTimeout(initialTimer);
      if (intervalTimer) clearInterval(intervalTimer);
    };
  }, [isPlaying, isHovered, isInteracting, isModalOpen, total, handleNext]);

  // Keyboard navigation when carousel container is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  // Touch & pointer gesture handlers to pause on active interaction
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsInteracting(false);
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartXRef.current = null;
  };

  if (total === 0) return null;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          setIsHovered(false);
        }
      }}
      onPointerDown={() => setIsInteracting(true)}
      onPointerUp={() => setIsInteracting(false)}
      onPointerCancel={() => setIsInteracting(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="3D Rotating Campaign Activities Showcase"
      className="relative w-full rounded-3xl bg-gradient-to-b from-[#EBF6FC] via-[#F4FAFD] to-[#E2F0F9] dark:from-[#112036] dark:via-[#0E1726] dark:to-[#0B1524] border border-[#CFE3F0] dark:border-[#243A5E] p-4 sm:p-8 lg:p-10 overflow-hidden shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] transition-colors duration-300"
    >
      {/* Subtle Backlight Ambience in Teal & Blue */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-64 bg-radial from-[#159E9A]/15 via-[#4F8FE8]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Top Controls Header */}
      <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-[#CFE3F0] dark:border-[#243A5E]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#159E9A] animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0F8380] dark:text-[#5EEAD4] font-sans">
              Dynamic 3D Showcase
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#183153] dark:text-white mt-0.5">
            Featured Campaign Initiatives
          </h2>
        </div>

        {/* Play / Pause Toggle & Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5FB] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] text-xs font-medium text-[#183153] dark:text-slate-200 hover:text-[#0F8380] dark:hover:text-white hover:border-[#159E9A] dark:hover:border-teal-500 transition-all shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
            aria-label={isPlaying ? 'Pause automatic carousel rotation' : 'Play automatic carousel rotation'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#159E9A]" />
                <span className="text-[11px] font-semibold">Auto-Revolving</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#4F8FE8]" />
                <span className="text-[11px] font-semibold">Paused</span>
              </>
            )}
          </button>

          {/* Quick Step Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-full bg-[#EAF5FB] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] text-[#183153] dark:text-slate-300 hover:text-[#159E9A] dark:hover:text-[#5EEAD4] hover:border-[#159E9A] transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
              aria-label="Previous activity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-full bg-[#EAF5FB] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] text-[#183153] dark:text-slate-300 hover:text-[#159E9A] dark:hover:text-[#5EEAD4] hover:border-[#159E9A] transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
              aria-label="Next activity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Stage Container */}
      <div
        className="relative w-full h-[540px] sm:h-[480px] lg:h-[450px] flex items-center justify-center overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        {/* Intentional Visual Stage Pedestal & Radial Focus Illumination */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
          aria-hidden="true"
        >
          {/* Ambient Radial Spotlight */}
          <div
            className="w-[850px] h-[380px] rounded-full blur-3xl opacity-65 dark:opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(185, 221, 245, 0.65) 0%, rgba(21, 158, 154, 0.15) 45%, rgba(79, 143, 232, 0.08) 65%, transparent 85%)',
            }}
          />
          {/* Subtle Stage Depth Pedestal Rings */}
          <div className="absolute w-[680px] sm:w-[840px] h-[260px] sm:h-[320px] rounded-[100%] border border-[#B9DDF5]/50 dark:border-white/10 opacity-70" />
          <div className="absolute w-[520px] sm:w-[640px] h-[190px] sm:h-[240px] rounded-[100%] border border-[#159E9A]/25 dark:border-teal-400/10 opacity-50" />
        </div>
        {activities.map((activity, index) => {
          let offset = (index - currentIndex) % total;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          let translateX = '0%';
          let translateZ = '0px';
          let rotateY = '0deg';
          let scale = 1;
          let zIndex = 30;
          let opacity = 1;

          if (isCenter) {
            translateX = '0%';
            translateZ = '40px';
            rotateY = '0deg';
            scale = 1;
            zIndex = 40;
            opacity = 1;
          } else if (offset === 1) {
            translateX = '55%';
            translateZ = '-130px';
            rotateY = '-24deg';
            scale = 0.84;
            zIndex = 30;
            opacity = 0.85;
          } else if (offset === -1) {
            translateX = '-55%';
            translateZ = '-130px';
            rotateY = '24deg';
            scale = 0.84;
            zIndex = 30;
            opacity = 0.85;
          } else if (offset === 2) {
            translateX = '98%';
            translateZ = '-280px';
            rotateY = '-36deg';
            scale = 0.68;
            zIndex = 20;
            opacity = 0.45;
          } else if (offset === -2) {
            translateX = '-98%';
            translateZ = '-280px';
            rotateY = '36deg';
            scale = 0.68;
            zIndex = 20;
            opacity = 0.45;
          } else {
            translateX = '0%';
            translateZ = '-500px';
            scale = 0.5;
            zIndex = 10;
            opacity = 0;
          }

          const dateObj = new Date(activity.date);
          const monthStr = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
          const dayStr = dateObj.getDate();

          return (
            <div
              key={activity.id}
              onClick={() => {
                if (isCenter) {
                  onOpenDetails(activity);
                } else {
                  setCurrentIndex(index);
                }
              }}
              style={{
                transform: `translateX(${translateX}) translateZ(${translateZ}) rotateY(${rotateY}) scale(${scale})`,
                zIndex,
                opacity,
                transition: reducedMotion
                  ? 'none'
                  : 'transform 500ms cubic-bezier(0.2, 0.8, 0.25, 1), opacity 450ms ease',
                pointerEvents: isVisible ? 'auto' : 'none',
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
              }}
              className={`absolute top-0 bottom-0 w-[88%] sm:w-[78%] lg:w-[65%] max-w-3xl rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-shadow duration-300 border ${
                isCenter
                  ? 'border-[#159E9A] dark:border-[#159E9A] shadow-teal-subtle ring-2 ring-[#159E9A]/20'
                  : 'border-[#CFE3F0] dark:border-[#243A5E] hover:border-[#4F8FE8]/80'
              } bg-gradient-to-br from-[#EBF5FB] to-[#F4F9FD] dark:from-[#14243D] dark:to-[#0F1E33] select-none`}
            >
              <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                {/* Photographic Cover */}
                <div className="md:col-span-6 relative h-48 sm:h-56 md:h-full overflow-hidden bg-[#0B1524]">
                  <img
                    src={resolveMediaUrl(activity.coverImage)}
                    alt={activity.title}
                    className={`w-full h-full object-cover object-center filter brightness-[0.92] transition-transform duration-700 ease-out ${
                      isCenter ? 'group-hover:scale-105' : ''
                    }`}
                    loading="lazy"
                    onError={(e) => handleMediaError(e, activity.title, activity.category)}
                  />

                  {/* Gradient Lighting Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1524]/85 via-[#0B1524]/20 to-transparent" />

                  {/* Date Badge (Top Left) */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col items-center justify-center w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#EAF5FB]/95 dark:bg-[#14243D]/95 backdrop-blur-md shadow-lg border border-[#CFE3F0] dark:border-[#243A5E] leading-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#159E9A] dark:text-[#5EEAD4]">
                      {monthStr}
                    </span>
                    <span className="text-lg sm:text-xl font-serif font-bold text-[#183153] dark:text-white mt-0.5">
                      {dayStr}
                    </span>
                  </div>

                  {/* Status / Category Chips (Bottom Left) */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#0B1524]/80 text-white backdrop-blur-md uppercase tracking-wider">
                      {activity.category.replace('_', ' ')}
                    </span>

                    {activity.status === 'upcoming' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#159E9A] text-white uppercase tracking-wider shadow-xs">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="md:col-span-6 p-4 sm:p-7 flex flex-col justify-between bg-gradient-to-br from-[#EBF5FB] to-[#F4F9FD] dark:from-[#14243D] dark:to-[#0F1E33] text-left">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#159E9A] shrink-0" />
                      <span>{activity.timeDisplay}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-[#183153] dark:text-white leading-snug line-clamp-2">
                      {activity.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-[#334C73] dark:text-slate-300 mt-2.5">
                      <MapPin className="w-3.5 h-3.5 text-[#239B70] shrink-0" />
                      <span className="line-clamp-1">{activity.venue}</span>
                    </div>

                    <p className="mt-3 text-xs sm:text-sm text-[#4F678A] dark:text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                      {activity.summary}
                    </p>

                    {/* Impact Quick Pill */}
                    {activity.impactMetrics && (
                      <div className="mt-4 flex items-center gap-3 pt-3 border-t border-[#CFE3F0] dark:border-[#243A5E]">
                        <div className="flex items-center gap-1.5 text-xs text-[#183153] dark:text-slate-200">
                          <Users className="w-3.5 h-3.5 text-[#239B70]" />
                          <span className="font-bold">{activity.impactMetrics.volunteersCount}</span>
                          <span className="text-slate-500 text-[11px]">Volunteers</span>
                        </div>
                        {activity.impactMetrics.pledgeSignatures && (
                          <div className="flex items-center gap-1.5 text-xs text-[#183153] dark:text-slate-200">
                            <Sparkles className="w-3.5 h-3.5 text-[#159E9A]" />
                            <span className="font-bold">{activity.impactMetrics.pledgeSignatures}</span>
                            <span className="text-slate-500 text-[11px]">Pledges</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action / Trigger */}
                  <div className="mt-5 pt-3 border-t border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-between">
                    {isCenter ? (
                      <div className="w-full flex items-center justify-between">
                        <Button
                          variant="teal"
                          size="sm"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDetails(activity);
                          }}
                          className="text-xs py-2 shadow-2xs"
                        >
                          <span className="hidden xs:inline">Explore Activity Details</span>
                          <span className="xs:hidden">Explore Details</span>
                        </Button>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
                          Click card to view agenda
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] flex items-center gap-1">
                        <span>Rotate to view</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Pagination Dots */}
      <div className="relative z-20 mt-6 flex items-center justify-center gap-2">
        {activities.map((act, i) => (
          <button
            key={act.id}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
              i === currentIndex
                ? 'w-8 h-2.5 bg-[#159E9A] dark:bg-[#5EEAD4] shadow-2xs'
                : 'w-2.5 h-2.5 bg-[#D7E7F0] dark:bg-[#243A5E] hover:bg-[#B9DDF5] dark:hover:bg-slate-600'
            }`}
            aria-label={`Go to activity ${i + 1}: ${act.title}`}
            aria-current={i === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
};
