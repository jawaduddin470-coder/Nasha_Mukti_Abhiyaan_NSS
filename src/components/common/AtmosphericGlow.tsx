import React from 'react';

interface AtmosphericGlowProps {
  variant?: 'hero' | 'section' | 'subtle';
  className?: string;
}

export const AtmosphericGlow: React.FC<AtmosphericGlowProps> = ({
  variant = 'hero',
  className = '',
}) => {
  if (variant === 'subtle') {
    return (
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}
        aria-hidden="true"
      >
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-saffron-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-campaignGreen-500/5 blur-3xl" />
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-saffron-500/10 via-midnight-900/0 to-transparent blur-3xl" />
      </div>
    );
  }

  // Hero variant - multi-layered atmospheric lighting
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Saffron apex spotlight */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] max-w-[120vw] h-[550px] rounded-full bg-gradient-to-b from-saffron-500/15 via-saffron-600/5 to-transparent blur-[120px]" />
      
      {/* Emerald health glow on the left */}
      <div className="absolute top-60 -left-40 w-96 h-96 rounded-full bg-campaignGreen-500/10 blur-[100px]" />
      
      {/* Gold institutional accent on the right */}
      <div className="absolute top-80 -right-40 w-96 h-96 rounded-full bg-gold-500/8 blur-[110px]" />

      {/* Subtle fine mesh grid / starlight texture */}
      <div className="absolute inset-0 bg-subtle-noise opacity-40 mix-blend-screen" />
    </div>
  );
};
