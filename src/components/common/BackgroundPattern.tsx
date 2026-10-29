import React from 'react';

export type PatternVariant =
  | 'soft-waves'
  | 'grain'
  | 'network'
  | 'stipple'
  | 'radial-dawn'
  | 'chakra'
  | 'navy-matrix'
  | 'topographic'
  | 'branching'
  | 'none';

interface BackgroundPatternProps {
  variant?: PatternVariant;
  className?: string;
  opacity?: number;
}

export const BackgroundPattern: React.FC<BackgroundPatternProps> = ({
  variant = 'soft-waves',
  className = '',
  opacity,
}) => {
  if (variant === 'none') return null;

  const patternClasses: Record<PatternVariant, string> = {
    'soft-waves': 'bg-pattern-soft-waves',
    grain: 'bg-pattern-grain',
    network: 'bg-pattern-network',
    stipple: 'bg-pattern-stipple',
    'radial-dawn': 'bg-radial-dawn',
    chakra: 'bg-pattern-chakra',
    'navy-matrix': 'bg-pattern-navy-matrix',
    topographic: 'bg-pattern-topographic',
    branching: 'bg-pattern-branching',
    none: '',
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-0 ${patternClasses[variant]} ${className}`}
      style={opacity !== undefined ? { opacity } : undefined}
      aria-hidden="true"
    />
  );
};
