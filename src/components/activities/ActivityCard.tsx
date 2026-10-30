import React, { useState, useRef } from 'react';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { Activity } from '../../types/activity';
import { Badge } from '../common/Badge';
import { resolveMediaUrl, handleMediaError } from '../../utils/mediaHelper';

interface ActivityCardProps {
  activity: Activity;
  onOpenDetails: (activity: Activity) => void;
  index?: number;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onOpenDetails,
  index = 0,
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

    const tiltX = ((y - centerY) / centerY) * -2.5;
    const tiltY = ((x - centerX) / centerX) * 2.5;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const getStatusBadge = () => {
    switch (activity.status) {
      case 'upcoming':
        return <Badge variant="teal" size="sm">Upcoming</Badge>;
      case 'ongoing':
        return <Badge variant="emerald" size="sm">Active Today</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Completed</Badge>;
    }
  };

  const isWide = index === 0;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenDetails(activity)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetails(activity);
        }
      }}
      tabIndex={0}
      role="button"
      aria-haspopup="dialog"
      aria-label={`View details for ${activity.title}`}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.2s ease-out',
      }}
      className={`group p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 shadow-soft-card hover:shadow-elevated flex flex-col justify-between cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] will-change-transform ${
        isWide ? 'md:col-span-2' : ''
      }`}
    >
      <div>
        {/* Cover Preview Frame with Aspect Ratio */}
        <div
          className={`relative rounded-2xl overflow-hidden bg-[#0B1524] mb-4 ${
            isWide ? 'aspect-[21/9] sm:aspect-[2.4/1]' : 'aspect-[16/9]'
          }`}
        >
          <img
            src={resolveMediaUrl(activity.coverImage)}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => handleMediaError(e, activity.title, activity.category)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1524]/80 via-transparent to-transparent" />

          <div className="absolute top-3 left-3">
            {getStatusBadge()}
          </div>

          <div className="absolute bottom-3 right-3 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg bg-[#0B1524]/70 text-white backdrop-blur-sm">
            {activity.category.replace('_', ' ')}
          </div>
        </div>

        {/* Title & Summary */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors line-clamp-2 leading-snug">
          {activity.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed line-clamp-2">
          {activity.summary}
        </p>

        {/* Structured Meta Data */}
        <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-[#D7E7F0] dark:border-[#243A5E]">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#159E9A] shrink-0" aria-hidden="true" />
            <span className="font-medium text-[#183153] dark:text-slate-200">{activity.date}</span>
            <span className="text-slate-400">&bull;</span>
            <Clock className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{activity.timeDisplay}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#239B70] shrink-0" aria-hidden="true" />
            <span className="truncate">{activity.venue}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#4F8FE8] shrink-0" aria-hidden="true" />
            <span className="truncate">{activity.targetAudience}</span>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="mt-6 pt-4 border-t border-[#D7E7F0] dark:border-[#243A5E] flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          {activity.registrationRequired ? 'Registration Required' : 'Open Entry'}
        </span>
        <span className="text-[#159E9A] dark:text-[#5EEAD4] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Explore Details <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
