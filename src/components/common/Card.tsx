import React from 'react';

export type CardSurface = 'ice' | 'teal' | 'emerald' | 'ivory' | 'mist' | 'navy';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  surface?: CardSurface;
  hoverable?: boolean;
  glow?: 'none' | 'teal' | 'emerald' | 'blue' | 'saffron' | 'green' | 'gold';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  surface = 'ice',
  hoverable = false,
  glow = 'none',
  ...props
}) => {
  const hoverClass = hoverable
    ? 'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500'
    : '';

  const surfaceClasses: Record<CardSurface, string> = {
    ice: 'bg-[#EAF5FB]/90 dark:bg-[#14243D]/90 border-[#CFE3F0] dark:border-[#243A5E]',
    teal: 'bg-[#E3F6F3]/90 dark:bg-[#0D262A]/90 border-[#A7E8DE] dark:border-[#1A4542]',
    emerald: 'bg-[#E5F7EE]/90 dark:bg-[#0D2820]/90 border-[#B5E9CC] dark:border-[#1B4B39]',
    ivory: 'bg-[#F8F5EC]/90 dark:bg-[#1A2535]/90 border-[#E8DFC8] dark:border-[#2A3B52]',
    mist: 'bg-[#DFECF5]/90 dark:bg-[#122238]/90 border-[#BED7E8] dark:border-[#203957]',
    navy: 'bg-gradient-to-br from-[#183153] to-[#10243D] text-white border-[#2A476B]',
  };

  const glowClass = {
    none: '',
    teal: 'shadow-teal-subtle border-[#99F6E4]/70 dark:border-teal-700/60',
    emerald: 'shadow-soft-card border-[#A7F3D0]/70 dark:border-emerald-700/60',
    blue: 'shadow-blue-subtle border-[#B9DDF5]/80 dark:border-blue-700/60',
    saffron: 'shadow-saffron-subtle border-[#FCD8A8]/80 dark:border-amber-700/60',
    green: 'shadow-soft-card border-[#A7F3D0]/70 dark:border-emerald-700/60',
    gold: 'shadow-soft-card border-yellow-200 dark:border-yellow-800',
  }[glow] || '';

  return (
    <div
      className={`border rounded-2xl p-6 sm:p-8 text-[#183153] dark:text-white shadow-soft-card ${surfaceClasses[surface]} ${hoverClass} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
