import React from 'react';
import { Linkedin, ExternalLink } from 'lucide-react';
import { DeveloperProfile } from '../../types/developer';
import { isValidLinkedInUrl, formatExternalUrl } from '../../utils/urlValidators';

export interface DeveloperCardProps {
  developer: DeveloperProfile;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}

/**
 * Shared Developer Profile Card
 * 
 * Guarantees pixel-perfect dimension consistency across developer cards regardless
 * of variable name length (1-line vs 2-line wraps) or viewport breakpoints.
 */
export const DeveloperCard: React.FC<DeveloperCardProps> = ({
  developer,
  headingLevel = 'h3',
  className = '',
}) => {
  const HeadingTag = headingLevel;

  const initials = developer.fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  const rawLinkedIn = developer.socialLinks?.linkedin || (developer as any).linkedinUrl;
  const hasValidLinkedIn = isValidLinkedInUrl(rawLinkedIn);

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={`Developer profile: ${developer.fullName}`}
      className={`w-full h-full min-h-[396px] sm:min-h-[472px] p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${className}`}
    >
      {/* Prominent, properly framed portrait or monogram */}
      <div className="relative mb-6 shrink-0">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl p-1 bg-gradient-to-tr from-[#159E9A] via-[#4F8FE8] to-[#239B70] shadow-md group-hover:scale-105 transition-transform duration-300 overflow-hidden shrink-0">
          {developer.avatarUrl ? (
            <img
              src={developer.avatarUrl}
              alt={developer.fullName}
              className="w-full h-full object-cover object-center rounded-[22px]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full rounded-[22px] bg-[#DCEBF5] dark:bg-[#0B1524] flex items-center justify-center text-[#183153] dark:text-[#E8F3FA] font-serif font-black text-4xl sm:text-5xl shadow-inner select-none">
              <span>{initials}</span>
            </div>
          )}
        </div>
      </div>

      {/* Developer Full Name in consistently reserved vertical space (absorbs 1-line or 2-line wrap) */}
      <div className="w-full flex items-center justify-center min-h-[4.25rem] sm:min-h-[5rem] px-2 shrink-0">
        <HeadingTag className="font-serif text-2xl sm:text-3xl font-bold text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors leading-snug text-center">
          {developer.fullName}
        </HeadingTag>
      </div>

      {/* LinkedIn Profile Interaction (Reserved baseline alignment) */}
      <div className="mt-auto pt-4 flex items-center justify-center w-full min-h-[44px] shrink-0">
        {hasValidLinkedIn && (
          <a
            href={formatExternalUrl(rawLinkedIn)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${developer.fullName}'s LinkedIn profile`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0077B5] dark:text-[#58A6FF] bg-[#E8F3FA] dark:bg-[#10243D] border border-[#B9DDF5] dark:border-[#243A5E] hover:border-[#0077B5] dark:hover:border-[#58A6FF] hover:bg-[#DDF3F0] dark:hover:bg-[#172B48] transition-all duration-200 group/linkedin focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] shadow-2xs"
          >
            <Linkedin className="w-3.5 h-3.5 fill-current shrink-0" aria-hidden="true" />
            <span>View LinkedIn Profile</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover/linkedin:opacity-100 group-hover/linkedin:translate-x-0.5 transition-all" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
};
