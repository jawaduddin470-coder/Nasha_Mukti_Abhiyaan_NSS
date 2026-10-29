import React, { useState, useEffect, useRef } from 'react';
import { SkipForward, ArrowRight, Compass, Eye, Users, Sparkles } from 'lucide-react';
import { AshokaChakra } from '../common/AshokaChakra';
import { CINEMATIC_BEATS, TOTAL_CINEMATIC_DURATION, StoryCardBeat } from '../../types/cinematic';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [currentBeatIndex, setCurrentBeatIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const prevBeatRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Check reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // Directly jump to the final reveal beat
      if (startTimeRef.current !== null) {
        startTimeRef.current = performance.now() - 12500;
      }
      setCurrentBeatIndex(CINEMATIC_BEATS.length - 1);
    }
  }, []);

  // Main animation clock loop
  useEffect(() => {
    // Expose programmatic time-setter for visual regression verification
    if (typeof window !== 'undefined') {
      (window as unknown as { __setIntroTime?: (s: number) => void }).__setIntroTime = (seconds: number) => {
        startTimeRef.current = performance.now() - seconds * 1000;
        let bIdx = 0;
        for (let i = 0; i < CINEMATIC_BEATS.length; i++) {
          if (seconds >= CINEMATIC_BEATS[i].startTime) {
            bIdx = i;
          }
        }
        setCurrentBeatIndex(bIdx);
      };
    }

    const loop = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;

      // Determine active beat index
      let bIdx = 0;
      for (let i = 0; i < CINEMATIC_BEATS.length; i++) {
        if (elapsed >= CINEMATIC_BEATS[i].startTime) {
          bIdx = i;
        }
      }
      setCurrentBeatIndex(bIdx);

      if (bIdx !== prevBeatRef.current) {
        prevBeatRef.current = bIdx;
      }

      // Auto-complete at end of timeline if user hasn't clicked Enter
      if (elapsed >= TOTAL_CINEMATIC_DURATION + 4.0) {
        handleEnterHome();
        return;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Complete & dismiss
  const handleEnterHome = () => {
    if (isExiting) return;
    setIsExiting(true);
    try {
      localStorage.setItem('nss_intro_completed_v2', 'true');
    } catch {
      // Ignore storage restrictions
    }
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  const handleSkip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleEnterHome();
  };

  const activeBeat: StoryCardBeat = CINEMATIC_BEATS[currentBeatIndex] || CINEMATIC_BEATS[0];
  const isFinalBeat = currentBeatIndex === CINEMATIC_BEATS.length - 1;

  // Render motif icon for each card
  const renderMotif = (motif: StoryCardBeat['motif']) => {
    switch (motif) {
      case 'spark':
        return <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" aria-hidden="true" />;
      case 'crossroads':
        return <Compass className="w-6 h-6 text-saffron-500" aria-hidden="true" />;
      case 'aperture':
        return <Eye className="w-6 h-6 text-amber-400" aria-hidden="true" />;
      case 'shield':
        return <Users className="w-6 h-6 text-emerald-400" aria-hidden="true" />;
      case 'emblem':
      default:
        return (
          <img
            src="/assets/branding/nss-logo.png"
            alt="National Service Scheme Emblem"
            className="w-12 h-12 object-contain"
          />
        );
    }
  };

  // Spatial positioning classes per story beat for desktop viewports
  const getSpatialPlacementStyles = () => {
    switch (currentBeatIndex) {
      case 0: // Beat 1: Left of center, medium card
        return {
          wrapper: 'md:absolute md:left-[8%] lg:md:left-[12%] md:top-[25%] lg:md:top-[28%] md:max-w-md lg:md:max-w-lg md:text-left',
          chakraShift: 'md:translate-x-[24%] md:-translate-y-[5%] scale-100 opacity-18',
          animationClass: 'animate-slideInLeft',
        };
      case 1: // Beat 2: Upper-right, medium card with tension
        return {
          wrapper: 'md:absolute md:right-[8%] lg:md:right-[12%] md:top-[18%] lg:md:top-[22%] md:max-w-md lg:md:max-w-lg md:text-left',
          chakraShift: 'md:-translate-x-[22%] md:translate-y-[12%] scale-95 opacity-15 rotate-[15deg]',
          animationClass: 'animate-slideInRight',
        };
      case 2: // Beat 3: Lower-left, compact card with illumination
        return {
          wrapper: 'md:absolute md:left-[9%] lg:md:left-[14%] md:bottom-[12%] lg:md:bottom-[15%] md:max-w-md md:text-left',
          chakraShift: 'md:translate-x-[20%] md:-translate-y-[15%] scale-105 opacity-20 rotate-[30deg]',
          animationClass: 'animate-slideInBottom',
        };
      case 3: // Beat 4: Upper-left / right-of-center, wider community card
        return {
          wrapper: 'md:absolute md:right-[8%] lg:md:right-[14%] md:top-[22%] lg:md:top-[26%] md:max-w-xl md:text-left',
          chakraShift: 'md:-translate-x-[18%] md:-translate-y-[4%] scale-110 opacity-22 rotate-[45deg]',
          animationClass: 'animate-slideInTop',
        };
      case 4: // Beat 5: Centered final identity reveal
      default:
        return {
          wrapper: 'mx-auto my-auto max-w-xl text-center',
          chakraShift: 'translate-x-0 translate-y-0 scale-120 opacity-30 rotate-[60deg]',
          animationClass: 'animate-revealZoom',
        };
    }
  };

  const { wrapper, chakraShift, animationClass } = getSpatialPlacementStyles();

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-opacity duration-700 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } bg-[#070B19] text-white flex flex-col justify-between p-4 sm:p-8 cursor-default`}
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic Campaign Film: Every Choice Shapes a Future"
    >
      {/* =========================================================================
          BACKGROUND FOUNDATION: ASHOKA CHAKRA WATERMARK WITH SPATIAL MOTION
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Deep ambient radial glow */}
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: isFinalBeat
              ? 'radial-gradient(circle at center, rgba(37, 99, 235, 0.25) 0%, rgba(15, 23, 42, 0.88) 65%, #070B19 100%)'
              : 'radial-gradient(circle at center, rgba(29, 78, 216, 0.16) 0%, rgba(10, 15, 30, 0.92) 60%, #070B19 100%)',
          }}
        />

        {/* Authentic 24-Spoke Ashoka Chakra with Subtle Spatial Shifts */}
        <div
          className={`absolute transition-all duration-1000 ease-out will-change-transform ${chakraShift}`}
          style={{
            filter: 'drop-shadow(0 0 50px rgba(37, 99, 235, 0.28))',
          }}
        >
          <AshokaChakra
            size="min(82vw, 760px)"
            color="#2563EB"
            strokeWidth={1.3}
            animate={true}
          />
        </div>

        {/* Beat 4 Community Connection Lattice */}
        {currentBeatIndex === 3 && (
          <div className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25%" cy="35%" r="4" fill="#34D399" />
              <circle cx="45%" cy="25%" r="3" fill="#38BDF8" />
              <circle cx="60%" cy="40%" r="5" fill="#FBBF24" />
              <circle cx="35%" cy="65%" r="4" fill="#EA580C" />
              <circle cx="75%" cy="60%" r="3" fill="#34D399" />
              <line x1="25%" y1="35%" x2="45%" y2="25%" stroke="#38BDF8" strokeWidth="0.8" strokeDasharray="4 4" />
              <line x1="45%" y1="25%" x2="60%" y2="40%" stroke="#FBBF24" strokeWidth="0.8" strokeDasharray="4 4" />
              <line x1="25%" y1="35%" x2="35%" y2="65%" stroke="#EA580C" strokeWidth="0.8" strokeDasharray="4 4" />
              <line x1="60%" y1="40%" x2="75%" y2="60%" stroke="#34D399" strokeWidth="0.8" strokeDasharray="4 4" />
            </svg>
          </div>
        )}

        {/* Ambient Subtle Starlight / Atmospheric Motes */}
        <div className="absolute inset-0 bg-pattern-stipple opacity-15" />
      </div>

      {/* =========================================================================
          TOP BAR: BRAND LOCKUP, NARRATIVE PROGRESSION & SKIP CONTROLS
          ========================================================================= */}
      <header className="relative z-30 w-full flex items-center justify-between gap-4 pointer-events-auto">
        {/* Brand Lockup */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D152A]/80 backdrop-blur-md border border-blue-900/50 shadow-md">
          <img
            src="/assets/branding/nss-logo.png"
            alt="Official National Service Scheme Seal"
            className="w-5 h-5 object-contain"
          />
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-saffron-500 tracking-wider">NSS MJCET</span>
            <span className="text-blue-400/50">&bull;</span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              Nasha Mukti Abhiyaan
            </span>
          </div>
        </div>

        {/* Subtle Narrative Progression Indicators (Not player controls) */}
        <nav
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D152A]/60 backdrop-blur-md border border-blue-900/30 text-xs"
          aria-label="Story Progression"
        >
          {CINEMATIC_BEATS.map((beat, idx) => {
            const isActive = currentBeatIndex === idx;
            const isPassed = currentBeatIndex > idx;
            return (
              <div key={beat.id} className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-mono tracking-widest uppercase transition-all duration-300 ${
                    isActive
                      ? 'text-saffron-400 font-bold scale-105'
                      : isPassed
                      ? 'text-blue-400/80 font-medium'
                      : 'text-slate-600 font-normal'
                  }`}
                >
                  {beat.badge}
                </span>
                {idx < CINEMATIC_BEATS.length - 1 && (
                  <span className="text-blue-900 text-[9px]">&bull;</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Action Controls: Skip */}
        <div className="flex items-center gap-2">
          {/* Skip Intro Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0D152A]/85 hover:bg-[#131D38] text-xs font-semibold text-slate-200 border border-blue-900/50 shadow-md hover:border-saffron-400/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 cursor-pointer"
            aria-label="Skip cinematic introduction and enter website"
          >
            <span>Skip Intro</span>
            <SkipForward className="w-3.5 h-3.5 text-saffron-400" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          SPATIAL STAGE: CHOREOGRAPHED STORY CARDS IN VARIED POSITIONS
          ========================================================================= */}
      <main className="relative z-20 w-full flex-1 flex items-center justify-center p-2 sm:p-4 pointer-events-auto">
        {!isFinalBeat ? (
          /* =====================================================================
             SPATIAL STORY CARDS 1 TO 4: DYNAMIC VIEWPORT PLACEMENT
             ===================================================================== */
          <div
            key={activeBeat.id}
            className={`w-full ${wrapper} ${animationClass} transition-all duration-700 ease-out`}
          >
            <div
              className="p-6 sm:p-8 lg:p-9 rounded-3xl backdrop-blur-xl border shadow-2xl transition-all duration-500"
              style={{
                backgroundColor: 'rgba(11, 19, 43, 0.82)',
                borderColor: 'rgba(59, 130, 246, 0.28)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 40px rgba(37, 99, 235, 0.14)',
              }}
            >
              {/* Card Motif & Chapter Indicator */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner transition-transform duration-300 shrink-0"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    borderColor: 'rgba(59, 130, 246, 0.35)',
                  }}
                >
                  {renderMotif(activeBeat.motif)}
                </div>

                <div>
                  <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-saffron-400 block leading-tight">
                    {activeBeat.chapter}
                  </span>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-blue-300 font-medium">
                    {activeBeat.badge}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-[1.2]">
                {activeBeat.headline}
              </h2>

              {/* Narrative Body */}
              <p className="mt-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-lg">
                {activeBeat.narrative}
              </p>

              {/* Decorative Accent Line */}
              <div className="mt-5 flex items-center gap-2">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-blue-500/40" />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: activeBeat.accentColor }}
                />
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-blue-500/40" />
              </div>
            </div>
          </div>
        ) : (
          /* =====================================================================
             FINAL BEAT 5: COMPOSED CENTERED CAMPAIGN IDENTITY REVEAL
             ===================================================================== */
          <div
            key="reveal-card"
            className={`w-full ${wrapper} ${animationClass}`}
          >
            <div
              className="p-8 sm:p-12 rounded-3xl backdrop-blur-2xl border shadow-2xl transition-all duration-700"
              style={{
                backgroundColor: 'rgba(10, 18, 38, 0.92)',
                borderColor: 'rgba(234, 88, 12, 0.4)',
                boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.88), 0 0 50px rgba(234, 88, 12, 0.18)',
              }}
            >
              {/* NSS Official Seal & Institutional Lineage */}
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="relative p-2 rounded-2xl bg-white/5 border border-white/10 mb-2">
                  <img
                    src="/assets/branding/nss-logo.png"
                    alt="National Service Scheme Seal"
                    className="w-14 h-14 object-contain drop-shadow-md"
                  />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest font-extrabold text-saffron-400">
                  NSS MJCET &bull; OSMANIA UNIVERSITY
                </span>
              </div>

              {/* Campaign Name */}
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                Nasha Mukti Abhiyaan
              </h1>

              {/* Tagline Capsule */}
              <div className="mt-4 inline-block px-4 py-1.5 rounded-full bg-saffron-500/15 border border-saffron-500/40 text-xs sm:text-sm font-serif italic text-saffron-300">
                “Every choice shapes a future.”
              </div>

              {/* Core Values */}
              <p className="mt-3 text-xs sm:text-sm font-medium tracking-widest uppercase text-slate-300">
                Awareness &bull; Resilience &bull; Compassion
              </p>

              {/* Clear Primary Action Button */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleEnterHome}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#159E9A] hover:bg-[#128885] active:bg-[#0E6E6B] text-white font-bold text-sm shadow-lg shadow-[#159E9A]/30 hover:scale-[1.03] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] cursor-pointer"
                  aria-label="Enter Campaign Experience"
                >
                  <span>Enter Campaign</span>
                  <ArrowRight className="w-4 h-4 text-white" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Embedded CSS Animations for Spatial Card Choreography */}
      <style>{`
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-35px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(35px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes slideInBottom {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideInTop {
          0% {
            opacity: 0;
            transform: translateY(-30px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes revealZoom {
          0% {
            opacity: 0;
            transform: scale(0.93);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slideInBottom {
          animation: slideInBottom 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slideInTop {
          animation: slideInTop 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-revealZoom {
          animation: revealZoom 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
