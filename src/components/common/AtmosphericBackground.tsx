import React from 'react';
import { AshokaChakra } from './AshokaChakra';

export type AtmosphericVariant =
  | 'hero'
  | 'page-header'
  | 'sanctuary-stage'
  | 'section-tonal'
  | 'deep-feature'
  | 'mesh-subtle'
  | 'minimal';

interface AtmosphericBackgroundProps {
  variant?: AtmosphericVariant;
  className?: string;
  showWatermark?: boolean;
  watermarkPosition?: 'top-right' | 'bottom-right' | 'center' | 'top-left';
  showRibbons?: boolean;
}

/**
 * Atmospheric Background System for NSS MJCET Nasha Mukti Abhiyaan
 * Phase 5.4 — Immersive Atmospheric Depth, Zero-White Grounding
 *
 * Provides layered depth, soft multi-point illumination, elegant SVG flowing ribbons,
 * fine grain texture, and restrained institutional Ashoka Chakra geometry.
 * All layers are non-interactive (pointer-events: none) and contained within bounds.
 */
export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({
  variant = 'page-header',
  className = '',
  showWatermark = false,
  watermarkPosition = 'top-right',
  showRibbons = true,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      {/* ------------------------------------------------------------------ */}
      {/* FINE GRAIN TEXTURE OVERLAY (Zero Plain Surface Texture)            */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute inset-0 bg-pattern-grain opacity-[0.24] dark:opacity-[0.12] pointer-events-none z-1" />

      {/* ------------------------------------------------------------------ */}
      {/* VARIANT 1: HERO ATMOSPHERE                                         */}
      {/* ------------------------------------------------------------------ */}
      {variant === 'hero' && (
        <>
          {/* Base Sky Blue, Mist & Soft Ice Tint Field */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#E8F3FA] via-[#DCEBF5]/80 to-[#E1EFF8] dark:from-[#0B1524] dark:via-[#10243D] dark:to-[#0B1524]" />

          {/* Primary Top-Center Radial Dawn Glow */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[980px] h-[600px] rounded-full blur-3xl opacity-85 dark:opacity-45"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(185, 221, 245, 0.75) 0%, rgba(79, 143, 232, 0.28) 42%, rgba(21, 158, 154, 0.14) 70%, transparent 100%)',
            }}
          />

          {/* Secondary Teal Ambient Bloom on Right */}
          <div
            className="absolute top-16 right-[-8%] w-[650px] h-[650px] rounded-full blur-3xl opacity-70 dark:opacity-35"
            style={{
              background:
                'radial-gradient(circle, rgba(21, 158, 154, 0.22) 0%, rgba(191, 220, 203, 0.15) 45%, transparent 70%)',
            }}
          />

          {/* Left Deep Blue Depth Anchor */}
          <div
            className="absolute top-44 left-[-8%] w-[600px] h-[600px] rounded-full blur-3xl opacity-60 dark:opacity-30"
            style={{
              background:
                'radial-gradient(circle, rgba(36, 71, 107, 0.18) 0%, rgba(185, 221, 245, 0.15) 50%, transparent 72%)',
            }}
          />

          {/* Flowing SVG Contour Ribbons */}
          {showRibbons && (
            <svg
              className="absolute bottom-0 left-0 w-full h-48 sm:h-72 text-[#159E9A] opacity-35 dark:opacity-20"
              viewBox="0 0 1440 280"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0,150 C320,270 520,70 840,170 C1160,270 1320,110 1440,150 L1440,280 L0,280 Z"
                fill="url(#hero-wave-grad-1)"
              />
              <path
                d="M0,190 C360,100 680,250 1020,130 C1240,50 1360,170 1440,210 L1440,280 L0,280 Z"
                fill="url(#hero-wave-grad-2)"
              />
              <defs>
                <linearGradient id="hero-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F8FE8" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#159E9A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#BFDCCB" stopOpacity="0.45" />
                </linearGradient>
                <linearGradient id="hero-wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B9DDF5" stopOpacity="0.6" />
                  <stop offset="60%" stopColor="#239B70" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#24476B" stopOpacity="0.35" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VARIANT 2: PAGE HEADER (Awareness, Activities, Gallery, Quiz, etc) */}
      {/* ------------------------------------------------------------------ */}
      {variant === 'page-header' && (
        <>
          {/* Base Ice Blue & Mist Gradient Drift */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#E8F3FA] via-[#DCEBF5]/85 to-[#E5F1F8] dark:from-[#0B1524] dark:via-[#10243D] dark:to-[#0B1524]" />

          {/* Central Illumination Dome */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-[820px] h-[450px] rounded-full blur-3xl opacity-80 dark:opacity-35"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(185, 221, 245, 0.75) 0%, rgba(21, 158, 154, 0.18) 50%, transparent 75%)',
            }}
          />

          {/* Lateral Soft Accents */}
          <div
            className="absolute top-10 right-[4%] w-[460px] h-[380px] rounded-full blur-3xl opacity-50 dark:opacity-25"
            style={{
              background:
                'radial-gradient(circle, rgba(79, 143, 232, 0.22) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute top-20 left-[4%] w-[440px] h-[380px] rounded-full blur-3xl opacity-45 dark:opacity-22"
            style={{
              background:
                'radial-gradient(circle, rgba(35, 155, 112, 0.16) 0%, transparent 70%)',
            }}
          />

          {/* Flowing Organic SVG Ribbon */}
          {showRibbons && (
            <svg
              className="absolute bottom-0 left-0 w-full h-28 sm:h-40 text-[#4F8FE8] opacity-30 dark:opacity-15"
              viewBox="0 0 1440 160"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0,80 C320,140 640,30 960,100 C1200,150 1340,70 1440,90 L1440,160 L0,160 Z"
                fill="url(#header-wave-grad)"
              />
              <defs>
                <linearGradient id="header-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#B9DDF5" stopOpacity="0.55" />
                  <stop offset="50%" stopColor="#159E9A" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#DCEBF5" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VARIANT 3: SANCTUARY & 3D CAROUSEL STAGE                           */}
      {/* ------------------------------------------------------------------ */}
      {variant === 'sanctuary-stage' && (
        <>
          {/* Spotlight Pedestal Behind 3D Interactive Canvas */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] sm:w-[980px] h-[580px] rounded-full blur-2xl opacity-75 dark:opacity-40"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(21, 158, 154, 0.22) 0%, rgba(79, 143, 232, 0.16) 40%, rgba(185, 221, 245, 0.12) 65%, transparent 85%)',
            }}
          />

          {/* Geometric Stage Pedestal Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[860px] h-[360px] sm:h-[440px] rounded-[100%] border border-[#B9DDF5]/60 dark:border-white/12 opacity-80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] sm:w-[580px] h-[250px] sm:h-[320px] rounded-[100%] border border-[#159E9A]/30 dark:border-teal-400/15 opacity-60" />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VARIANT 4: SECTION TONAL (Toned Section Transitions)                */}
      {/* ------------------------------------------------------------------ */}
      {variant === 'section-tonal' && (
        <>
          {/* Smooth Soft Blue-Ivory Gradient Wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E8F3FA] via-[#DCEBF5]/75 to-[#F5F0E5]/80 dark:from-[#0B1524] dark:via-[#10243D] dark:to-[#0B1524]" />

          {/* Ambient Lighting Wash */}
          <div
            className="absolute top-0 right-1/4 w-[540px] h-[380px] rounded-full blur-3xl opacity-55 dark:opacity-25"
            style={{
              background:
                'radial-gradient(circle, rgba(191, 220, 203, 0.25) 0%, rgba(185, 221, 245, 0.20) 50%, transparent 75%)',
            }}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VARIANT 5: DEEP FEATURE (Closing Pledge, Keynote Banner)            */}
      {/* ------------------------------------------------------------------ */}
      {variant === 'deep-feature' && (
        <>
          {/* Rich Institutional Midnight & Deep Navy Sanctuary */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#183153] via-[#10243D] to-[#0A182B]" />

          {/* Center Teal & Sapphire Ambient Radiance */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-3xl opacity-45"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(21, 158, 154, 0.45) 0%, rgba(79, 143, 232, 0.30) 45%, transparent 75%)',
            }}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* VARIANT 6: MESH SUBTLE (Curriculum & Reading Pages)                */}
      {/* ------------------------------------------------------------------ */}
      {variant === 'mesh-subtle' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#E8F3FA] via-[#DCEBF5]/60 to-[#E4F1F9] dark:from-[#0B1524]/80 dark:via-[#10243D]/60 dark:to-[#0B1524]/80" />
          <div
            className="absolute top-1/4 left-1/4 w-[640px] h-[640px] rounded-full blur-3xl opacity-45 dark:opacity-20"
            style={{
              background:
                'radial-gradient(circle, rgba(185, 221, 245, 0.55) 0%, rgba(21, 158, 154, 0.12) 50%, transparent 75%)',
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[580px] h-[580px] rounded-full blur-3xl opacity-40 dark:opacity-18"
            style={{
              background:
                'radial-gradient(circle, rgba(191, 220, 203, 0.30) 0%, rgba(79, 143, 232, 0.15) 50%, transparent 75%)',
            }}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* OPTIONAL INSTITUTIONAL ASHOKA CHAKRA WATERMARK                     */}
      {/* ------------------------------------------------------------------ */}
      {showWatermark && (
        <div
          className={`absolute pointer-events-none transition-transform duration-1000 ${
            watermarkPosition === 'top-right'
              ? 'top-4 right-[-40px] sm:right-[-20px] md:right-8 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96'
              : watermarkPosition === 'bottom-right'
              ? 'bottom-[-40px] right-[-20px] md:right-8 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96'
              : watermarkPosition === 'top-left'
              ? 'top-6 left-[-30px] md:left-6 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96'
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 md:w-[460px] h-80 sm:h-96 md:h-[460px]'
          }`}
        >
          <div className="w-full h-full opacity-[0.052] dark:opacity-[0.065] text-[#183153] dark:text-[#B9DDF5] animate-spin-very-slow">
            <AshokaChakra size="100%" color="currentColor" strokeWidth={1.1} />
          </div>
        </div>
      )}
    </div>
  );
};
