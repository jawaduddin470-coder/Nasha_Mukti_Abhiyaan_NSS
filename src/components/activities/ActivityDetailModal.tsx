import React, { useEffect, useRef, useState } from 'react';
import { X, Calendar, MapPin, Users, Clock, ShieldCheck, Tag, ExternalLink, CheckCircle2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Activity } from '../../types/activity';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface ActivityDetailModalProps {
  activity: Activity | null;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  activity,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Compile strictly up to 5 images for the photo carousel
  const modalImages = React.useMemo(() => {
    if (!activity) return [];
    const images: string[] = [];
    if (activity.coverImage) images.push(activity.coverImage);
    if (activity.galleryImages && Array.isArray(activity.galleryImages)) {
      for (const img of activity.galleryImages) {
        if (img && !images.includes(img) && images.length < 5) {
          images.push(img);
        }
      }
    }
    return images.slice(0, 5);
  }, [activity]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activity]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (activity) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activity, onClose]);

  if (!activity) return null;

  const getStatusBadge = () => {
    switch (activity.status) {
      case 'upcoming':
        return <Badge variant="teal" size="sm">Upcoming Drive</Badge>;
      case 'ongoing':
        return <Badge variant="emerald" size="sm">Active Today</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Completed &amp; Archived</Badge>;
    }
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % modalImages.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1524]/75 backdrop-blur-md transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="activity-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-[#EAF5FB] dark:bg-[#14243D] border border-[#CFE3F0] dark:border-[#243A5E] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-left animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Cover & 5-Image Carousel Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-[#0B1524] shrink-0 overflow-hidden">
          {modalImages.length > 0 ? (
            <img
              src={modalImages[activeImageIndex]}
              alt={`${activity.title} slide ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1524]/90 via-[#0B1524]/30 to-transparent pointer-events-none" />

          {/* Carousel Navigation Buttons if multiple images */}
          {modalImages.length > 1 && (
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between z-20 pointer-events-auto">
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous photograph"
                className="p-1.5 rounded-full bg-[#0B1524]/60 hover:bg-[#0B1524]/90 text-white backdrop-blur-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next photograph"
                className="p-1.5 rounded-full bg-[#0B1524]/60 hover:bg-[#0B1524]/90 text-white backdrop-blur-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Close Floating Button */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close activity details"
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#0B1524]/60 hover:bg-[#0B1524]/90 text-white backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Bottom Overlays & Image Dots */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#0B1524]/80 text-white backdrop-blur-md uppercase tracking-wider">
                {activity.category.replace('_', ' ')}
              </span>
            </div>

            {modalImages.length > 1 && (
              <div className="flex items-center gap-1.5 bg-[#0B1524]/70 px-2.5 py-1 rounded-full backdrop-blur-md">
                {modalImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeImageIndex ? 'w-4 bg-[#159E9A]' : 'w-1.5 bg-white/60'
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <h2
              id="activity-modal-title"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#183153] dark:text-white leading-tight"
            >
              {activity.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#334C73] dark:text-slate-300 leading-relaxed">
              {activity.description}
            </p>
          </div>

          {/* Schedule & Location Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#DCEBF5]/60 dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] text-xs text-[#1F3F6B] dark:text-slate-300">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#159E9A] shrink-0" />
              <div>
                <p className="font-bold text-[#183153] dark:text-white">Date</p>
                <p>{activity.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <p className="font-bold text-[#183153] dark:text-white">Timing</p>
                <p>{activity.timeDisplay}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#239B70] shrink-0" />
              <div>
                <p className="font-bold text-[#183153] dark:text-white">Venue</p>
                <p className="truncate max-w-[200px]">{activity.venue}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#4F8FE8] shrink-0" />
              <div>
                <p className="font-bold text-[#183153] dark:text-white">Target Audience</p>
                <p className="truncate max-w-[200px]">{activity.targetAudience}</p>
              </div>
            </div>
          </div>

          {/* Agenda & Key Milestones if available */}
          {activity.agenda && activity.agenda.length > 0 && (
            <div>
              <h3 className="font-serif text-base font-bold text-[#183153] dark:text-white mb-3">
                Event Schedule &amp; Agenda
              </h3>
              <div className="space-y-2 border-l-2 border-[#159E9A] pl-4">
                {activity.agenda.map((item, i) => (
                  <div key={i} className="text-xs">
                    <span className="font-mono font-bold text-[#159E9A] mr-2">
                      {item.time}
                    </span>
                    <strong className="text-[#183153] dark:text-white">{item.title}</strong>
                    {item.speakerOrLead && (
                      <span className="text-slate-500 dark:text-slate-400 block sm:inline sm:ml-2">
                        &bull; {item.speakerOrLead}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Impact Metrics */}
          {activity.impactMetrics && (
            <div>
              <h3 className="font-serif text-base font-bold text-[#183153] dark:text-white mb-3">
                Recorded Campaign Impact
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                {activity.impactMetrics.volunteersCount && (
                  <div className="p-3 rounded-xl bg-[#DCEBF5]/50 dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E]">
                    <p className="text-xl font-bold font-serif text-[#183153] dark:text-white">
                      {activity.impactMetrics.volunteersCount}
                    </p>
                    <p className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                      Volunteers
                    </p>
                  </div>
                )}
                {activity.impactMetrics.attendeesCount && (
                  <div className="p-3 rounded-xl bg-[#DCEBF5]/50 dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E]">
                    <p className="text-xl font-bold font-serif text-[#183153] dark:text-white">
                      {activity.impactMetrics.attendeesCount}
                    </p>
                    <p className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                      Participants
                    </p>
                  </div>
                )}
                {activity.impactMetrics.pledgeSignatures && (
                  <div className="p-3 rounded-xl bg-[#DCEBF5]/50 dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E]">
                    <p className="text-xl font-bold font-serif text-[#183153] dark:text-white">
                      {activity.impactMetrics.pledgeSignatures}
                    </p>
                    <p className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                      Pledges
                    </p>
                  </div>
                )}
                {activity.impactMetrics.resourcesDistributed && (
                  <div className="p-3 rounded-xl bg-[#DCEBF5]/50 dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E]">
                    <p className="text-xl font-bold font-serif text-[#183153] dark:text-white">
                      {activity.impactMetrics.resourcesDistributed}
                    </p>
                    <p className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                      Handbooks
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Takeaways */}
          {activity.keyTakeaways && (
            <div>
              <h3 className="font-serif text-base font-bold text-[#183153] dark:text-white mb-2">
                Key Objectives &amp; Takeaways
              </h3>
              <ul className="space-y-1.5 text-xs text-[#334C73] dark:text-slate-300">
                {activity.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#239B70] shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Coordinators & Partners */}
          <div className="pt-4 border-t border-[#CFE3F0] dark:border-[#243A5E] text-xs text-[#4F678A] dark:text-slate-400 space-y-1">
            <p>
              <strong className="text-[#183153] dark:text-white">Coordinated by:</strong>{' '}
              {activity.coordinators.join(', ')}
            </p>
            {activity.facultyAdvisors && (
              <p>
                <strong className="text-[#183153] dark:text-white">Faculty Mentors:</strong>{' '}
                {activity.facultyAdvisors.join(', ')}
              </p>
            )}
            {activity.partnerOrganizations && (
              <p>
                <strong className="text-[#183153] dark:text-white">Partner Institutions:</strong>{' '}
                {activity.partnerOrganizations.join(', ')}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md bg-[#DCEBF5] dark:bg-[#1B2F4E] text-[#183153] dark:text-slate-200 border border-[#CFE3F0] dark:border-[#243A5E]"
              >
                <Tag className="w-3 h-3 text-[#159E9A]" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-[#DCEBF5]/50 dark:bg-[#1B2F4E] border-t border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#1C825E] dark:text-[#34D399] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#239B70]" />
            <span>NSS MJCET Official Campaign Drive</span>
          </div>

          <div className="flex items-center gap-2">
            {activity.registrationRequired && activity.registrationUrl ? (
              <a
                href={activity.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#159E9A] hover:bg-[#0F8380] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Register Now
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : null}
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
