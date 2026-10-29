import React from 'react';

export type BadgeVariant =
  | 'teal'
  | 'emerald'
  | 'blue'
  | 'sage'
  | 'saffron'
  | 'green'
  | 'gold'
  | 'neutral'
  | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs sm:text-sm px-3 py-1',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    teal:
      'bg-[#F0FDFB] dark:bg-teal-950/60 text-[#0F8380] dark:text-[#5EEAD4] border border-[#99F6E4] dark:border-teal-800',
    emerald:
      'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#1C825E] dark:text-[#34D399] border border-[#A7F3D0] dark:border-emerald-800',
    green:
      'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#1C825E] dark:text-[#34D399] border border-[#A7F3D0] dark:border-emerald-800',
    blue:
      'bg-[#EAF6FC] dark:bg-blue-950/60 text-[#204179] dark:text-[#95C2FA] border border-[#B9DDF5] dark:border-blue-800',
    sage:
      'bg-[#F4FAF8] dark:bg-slate-900/60 text-[#3A7568] dark:text-[#A8D8CB] border border-[#C7E7DE] dark:border-slate-700',
    saffron:
      'bg-[#FFF9F0] dark:bg-amber-950/60 text-[#B06517] dark:text-[#F7BC72] border border-[#FEEFD8] dark:border-amber-800',
    gold:
      'bg-[#FFFBEB] dark:bg-yellow-950/60 text-[#B45309] dark:text-[#FDE68A] border border-[#FEF3C7] dark:border-yellow-800',
    neutral:
      'bg-[#EAF5FB] dark:bg-darkSurface-elevated text-[#183153] dark:text-slate-200 border border-[#CFE3F0] dark:border-darkSurface-border shadow-2xs',
    outline:
      'bg-transparent text-[#183153] dark:text-slate-300 border border-[#CFE3F0] dark:border-darkSurface-border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium tracking-wide rounded-full select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
