import React from 'react';

interface LoadingStateProps {
  label?: string;
  count?: number;
  variant?: 'cards' | 'spinner';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading campaign content...',
  count = 3,
  variant = 'cards',
  className = '',
}) => {
  if (variant === 'spinner') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
      >
        <div className="relative w-10 h-10">
          <div className="w-10 h-10 rounded-full border-2 border-[#159E9A]/20 border-t-[#159E9A] animate-spin" />
        </div>
        <p className="mt-4 text-sm text-[#183153] dark:text-slate-200 font-medium">{label}</p>
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[#CFE3F0] dark:border-[#243A5E] bg-[#EAF5FB]/90 dark:bg-[#14243D]/90 p-6 animate-pulse shadow-soft-card"
        >
          <div className="w-24 h-5 bg-[#DCEBF5] dark:bg-[#1B2F4E] rounded-full mb-4" />
          <div className="w-3/4 h-6 bg-[#DCEBF5] dark:bg-[#1B2F4E] rounded-md mb-3" />
          <div className="w-full h-4 bg-[#DCEBF5]/60 dark:bg-[#1B2F4E]/60 rounded mb-2" />
          <div className="w-5/6 h-4 bg-[#DCEBF5]/60 dark:bg-[#1B2F4E]/60 rounded mb-6" />
          <div className="w-1/3 h-4 bg-[#DCEBF5] dark:bg-[#1B2F4E] rounded" />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
};
