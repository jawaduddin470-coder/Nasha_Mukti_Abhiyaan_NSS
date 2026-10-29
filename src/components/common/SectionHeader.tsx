import React from 'react';
import { Badge, BadgeVariant } from './Badge';

interface SectionHeaderProps {
  kicker?: string;
  kickerVariant?: BadgeVariant;
  kickerIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  headingLevel?: 'h1' | 'h2' | 'h3';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  kickerVariant = 'teal',
  kickerIcon,
  title,
  subtitle,
  align = 'left',
  className = '',
  headingLevel = 'h2',
}) => {
  const isCenter = align === 'center';
  const HeadingTag = headingLevel;

  return (
    <div
      className={`mb-10 sm:mb-14 ${isCenter ? 'text-center mx-auto max-w-3xl' : 'max-w-2xl'} ${className}`}
    >
      {kicker && (
        <div className={`mb-3.5 ${isCenter ? 'flex justify-center' : ''}`}>
          <Badge variant={kickerVariant} icon={kickerIcon}>
            {kicker}
          </Badge>
        </div>
      )}

      <HeadingTag
        className={`font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#183153] dark:text-white leading-[1.18] ${
          headingLevel === 'h1' ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl' : ''
        }`}
      >
        {title}
      </HeadingTag>

      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-[#334C73] dark:text-slate-300 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
