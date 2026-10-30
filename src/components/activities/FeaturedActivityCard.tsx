import React, { useState, useRef } from 'react';
import { MapPin, Users, ArrowRight, Clock, Award, ShieldCheck } from 'lucide-react';
import { Activity } from '../../types/activity';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { resolveMediaUrl, handleMediaError } from '../../utils/mediaHelper';

interface FeaturedActivityCardProps {
  activity: Activity;
  onOpenDetails: (activity: Activity) => void;
}

export const FeaturedActivityCard: React.FC<FeaturedActivityCardProps> = ({
  activity,
  onOpenDetails,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Controlled 3D tilt
    const tiltX = ((y - centerY) / centerY) * -2;
    const tiltY = ((x - centerX) / centerX) * 2;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const getStatusBadge = () => {
    switch (activity.status) {
      case 'upcoming':
        return <Badge variant="saffron" size="sm">Flagship Milestone</Badge>;
      case 'ongoing':
        return <Badge variant="green" size="sm">Active Today</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Completed</Badge>;
    }
  };

  const dateObj = new Date(activity.date);
  const monthStr = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
  const dayStr = dateObj.getDate();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.25s ease-out',
      }}
      className="group relative rounded-3xl overflow-hidden bg-[#EAF5FB] dark:bg-darkSurface-card border-2 border-[#CFE3F0] dark:border-darkSurface-borderLight shadow-elevated hover:shadow-2xl transition-all duration-300 text-left will-change-transform"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        {/* Dominant Photographic Section (60% width on desktop) */}
        <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] bg-charcoal-950 overflow-hidden">
          <img
            src={resolveMediaUrl(activity.coverImage)}
            alt={activity.title}
            className="w-full h-full object-cover object-center filter brightness-[0.93] group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => handleMediaError(e, activity.title, activity.category)}
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent" />

          {/* Top Overlaid Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {getStatusBadge()}
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-charcoal-950/70 text-white backdrop-blur-md uppercase tracking-wider">
              {activity.category.replace('_', ' ')}
            </span>
          </div>

          {/* Prominent Floating Calendar Date Stamp */}
          <div className="absolute top-4 right-4 p-3 rounded-2xl bg-[#EAF5FB]/95 dark:bg-charcoal-900/90 backdrop-blur-md text-charcoal-900 dark:text-white border border-[#CFE3F0] dark:border-white/10 shadow-lg text-center min-w-[64px]">
            <span className="block text-[11px] font-extrabold text-[#159E9A] dark:text-[#5EEAD4] font-sans tracking-wider">
              {monthStr}
            </span>
            <span className="block text-2xl font-black font-serif leading-none mt-0.5 text-[#183153] dark:text-white">
              {dayStr}
            </span>
          </div>

          {/* Bottom Overlaid Verified Impact Metrics */}
          {activity.impactMetrics && (
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-xs text-white/95 bg-charcoal-950/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              {activity.impactMetrics.volunteersCount && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-saffron-400" />
                  <span><strong>{activity.impactMetrics.volunteersCount}</strong> Target Volunteers</span>
                </div>
              )}
              {activity.impactMetrics.pledgeSignatures && (
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-gold-400" />
                  <span><strong>{activity.impactMetrics.pledgeSignatures}</strong> Pledge Goal</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Editorial Narrative Section (40% width on desktop) */}
        <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33]">
          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="text-xs uppercase tracking-widest font-extrabold text-saffron-600 dark:text-saffron-400 font-sans">
                Featured Campaign Drive
              </span>
              <span className="text-xs text-charcoal-500 dark:text-charcoal-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                {activity.timeDisplay}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 dark:text-white leading-tight group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
              {activity.title}
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-charcoal-600 dark:text-charcoal-300 leading-relaxed">
              {activity.summary}
            </p>

            {/* Structured Meta Grid */}
            <div className="mt-6 space-y-2.5 text-xs text-charcoal-700 dark:text-charcoal-300 pt-4 border-t border-ivory-200 dark:border-darkSurface-border">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-nssGreen-600 dark:text-nssGreen-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal-900 dark:text-white">Venue: </span>
                  <span className="text-charcoal-600 dark:text-charcoal-400">{activity.venue}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-royalBlue-600 dark:text-royalBlue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal-900 dark:text-white">Audience: </span>
                  <span className="text-charcoal-600 dark:text-charcoal-400">{activity.targetAudience}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-600 dark:text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-charcoal-900 dark:text-white">Coordinator: </span>
                  <span className="text-charcoal-600 dark:text-charcoal-400">{activity.coordinators[0]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-8 pt-5 border-t border-ivory-200 dark:border-darkSurface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {activity.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-ivory-100 dark:bg-darkSurface-elevated text-charcoal-600 dark:text-charcoal-300 border border-ivory-200 dark:border-darkSurface-border"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => onOpenDetails(activity)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="self-stretch sm:self-auto shadow-md"
            >
              Explore Full Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
