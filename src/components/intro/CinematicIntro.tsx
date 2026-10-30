import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SkipForward, ArrowRight } from 'lucide-react';
import { CINEMATIC_CHAPTERS, TOTAL_CINEMATIC_DURATION, CinematicChapter } from '../../types/cinematic';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [chapterElapsed, setChapterElapsed] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isExitingRef = useRef<boolean>(false);

  // Preload all 4 chapter campaign images immediately on mount
  useEffect(() => {
    CINEMATIC_CHAPTERS.forEach((chapter) => {
      const img = new Image();
      img.src = chapter.imageSrc;
    });
  }, []);

  // Complete and dismiss transition into homepage
  const handleEnterHome = () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;
    setIsExiting(true);

    setTimeout(() => {
      onComplete();
    }, 700);
  };

  const handleSkip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    handleEnterHome();
  };

  // Jump to specific chapter (allows interactive navigation through the 4-chapter timeline)
  const handleJumpToChapter = (index: number) => {
    const targetChapter = CINEMATIC_CHAPTERS[index];
    if (!targetChapter) return;
    if (startTimeRef.current !== null) {
      startTimeRef.current = performance.now() - targetChapter.startTime * 1000;
    }
    setCurrentChapterIndex(index);
    setChapterElapsed(0);
  };

  // Keyboard navigation (Esc to skip, Arrow keys to navigate chapters)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleEnterHome();
      } else if (e.key === 'ArrowRight') {
        setCurrentChapterIndex((prev) => {
          const next = Math.min(CINEMATIC_CHAPTERS.length - 1, prev + 1);
          handleJumpToChapter(next);
          return next;
        });
      } else if (e.key === 'ArrowLeft') {
        setCurrentChapterIndex((prev) => {
          const next = Math.max(0, prev - 1);
          handleJumpToChapter(next);
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // Directly jump to the final chapter
      setCurrentChapterIndex(CINEMATIC_CHAPTERS.length - 1);
      setChapterElapsed(1.5);
    }
  }, []);

  // Main animation clock loop
  useEffect(() => {
    // Expose programmatic time-setter for automated verification & screenshots
    if (typeof window !== 'undefined') {
      (window as unknown as { __setIntroTime?: (s: number) => void }).__setIntroTime = (seconds: number) => {
        startTimeRef.current = performance.now() - seconds * 1000;
        let cIdx = 0;
        for (let i = 0; i < CINEMATIC_CHAPTERS.length; i++) {
          if (seconds >= CINEMATIC_CHAPTERS[i].startTime) {
            cIdx = i;
          }
        }
        setCurrentChapterIndex(cIdx);
        setChapterElapsed(seconds - CINEMATIC_CHAPTERS[cIdx].startTime);
      };
    }

    const loop = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const totalElapsed = (timestamp - startTimeRef.current) / 1000;

      // Determine active chapter based on timeline
      let activeIndex = 0;
      for (let i = 0; i < CINEMATIC_CHAPTERS.length; i++) {
        if (totalElapsed >= CINEMATIC_CHAPTERS[i].startTime) {
          activeIndex = i;
        }
      }

      const activeChapter = CINEMATIC_CHAPTERS[activeIndex];
      const activeElapsed = Math.max(0, totalElapsed - activeChapter.startTime);

      setCurrentChapterIndex(activeIndex);
      setChapterElapsed(activeElapsed);

      // End of documentary timeline auto-transition
      if (totalElapsed >= TOTAL_CINEMATIC_DURATION) {
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

  const activeChapter: CinematicChapter = CINEMATIC_CHAPTERS[currentChapterIndex] || CINEMATIC_CHAPTERS[0];

  // Split headline for word-by-word reveal in Chapter 01
  const headlineWords = useMemo(() => {
    return activeChapter.headline.split(' ');
  }, [activeChapter.headline]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden select-none transition-opacity duration-700 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } bg-[#070D19] text-white flex flex-col justify-between cursor-default`}
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic Campaign Documentary: From Silence to Strength"
    >
      {/* =========================================================================
          LAYER 0: CINEMATIC CANVAS STAGE & FULL-BLEED SCENE IMAGERY
          ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {CINEMATIC_CHAPTERS.map((chapter, idx) => {
          const isActive = currentChapterIndex === idx;
          const isPast = currentChapterIndex > idx;

          // Camera motion styling based on chapter visual direction
          let cameraTransformClass = '';
          if (chapter.cameraDirection === 'push-in') {
            // Chapter 1: Slow, poignant push-in towards central student
            cameraTransformClass = isActive
              ? 'scale-115 translate-x-[-1%] translate-y-[-1%] transition-transform duration-[4200ms] ease-out'
              : 'scale-105 translate-x-0 translate-y-0';
          } else if (chapter.cameraDirection === 'pan-tilt') {
            // Chapter 2: Lateral pan and slight tilt across knowledge holograms
            cameraTransformClass = isActive
              ? 'scale-112 translate-x-[2%] translate-y-[-1%] transition-transform duration-[4200ms] ease-out'
              : 'scale-118 translate-x-[-1%] translate-y-[1%]';
          } else if (chapter.cameraDirection === 'focus-dolly') {
            // Chapter 3: Dynamic dolly push into collaborative student circle
            cameraTransformClass = isActive
              ? 'scale-114 translate-x-[-1%] translate-y-[1%] transition-transform duration-[4200ms] ease-out'
              : 'scale-104 translate-x-[1%] translate-y-[-1%]';
          } else {
            // Chapter 4: Expansive pullback revealing the golden horizon
            cameraTransformClass = isActive
              ? 'scale-102 translate-x-0 translate-y-0 transition-transform duration-[5000ms] ease-out'
              : 'scale-116 translate-x-0 translate-y-[-2%]';
          }

          return (
            <div
              key={chapter.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : isPast ? 'opacity-0 z-0' : 'opacity-0 -z-10'
              }`}
            >
              {/* Primary Campaign Scene Image with Parallax Camera Motion */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                  src={chapter.imageSrc}
                  alt={`${chapter.title} - ${chapter.headline}`}
                  className={`w-full h-full object-cover object-center will-change-transform ${cameraTransformClass}`}
                  loading="eager"
                />

                {/* Subtle Cinematic Vignette & Depth Masking (Seamless bleed into Midnight Navy) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      idx === 3
                        ? 'radial-gradient(ellipse at 50% 45%, rgba(16, 36, 61, 0.15) 0%, rgba(14, 29, 51, 0.65) 60%, #070D19 100%)'
                        : idx === 0
                        ? 'radial-gradient(ellipse at 55% 45%, rgba(16, 36, 61, 0.2) 0%, rgba(14, 29, 51, 0.72) 65%, #070D19 100%)'
                        : 'radial-gradient(ellipse at 50% 50%, rgba(16, 36, 61, 0.25) 0%, rgba(14, 29, 51, 0.75) 65%, #070D19 100%)',
                  }}
                />

                {/* Top and Bottom Anamorphic Cinematic Bars Gradient */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#070D19]/90 via-[#0E1D33]/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#070D19] via-[#0E1D33]/85 to-transparent pointer-events-none" />

                {/* Chapter-Specific Volumetric Atmospheric Light Sweep */}
                {isActive && (
                  <div
                    className="absolute inset-0 pointer-events-none animate-pulse"
                    style={{
                      background: `radial-gradient(circle at ${
                        idx === 0 ? '75% 40%' : idx === 1 ? '35% 35%' : idx === 2 ? '65% 55%' : '50% 30%'
                      }, ${chapter.lightSweepColor} 0%, transparent 60%)`,
                      opacity: Math.min(1, chapterElapsed / 1.0),
                      transition: 'opacity 1.0s ease-out',
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Cinematic Film Grain Texture Layer */}
        <div className="absolute inset-0 opacity-[0.035] bg-repeat pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* =========================================================================
          LAYER 1: TOP CONTROL BAR (BRAND, 4-CHAPTER TIMELINE & SKIP)
          ========================================================================= */}
      <header className="relative z-30 w-full px-2.5 sm:px-6 md:px-8 pt-3 sm:pt-6 flex items-center justify-between gap-1.5 sm:gap-4 pointer-events-auto">
        {/* Brand Lockup */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#0E1D33]/85 backdrop-blur-md border border-[#243A5E]/80 shadow-md shrink-0">
          <img
            src="/assets/branding/nss-logo.png"
            alt="Official National Service Scheme Seal"
            className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
          />
          <div className="flex items-center gap-1 text-[11px] sm:text-xs">
            <span className="font-bold text-[#EA580C] tracking-wider hidden xs:inline sm:inline">NSS MJCET</span>
            <span className="font-bold text-[#EA580C] tracking-wider xs:hidden sm:hidden">NSS</span>
            <span className="text-[#38BDF8]/40 hidden sm:inline">&bull;</span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              Nasha Mukti Abhiyaan
            </span>
          </div>
        </div>

        {/* 4-Chapter Connected Film Progression Bar */}
        <nav
          className="flex items-center gap-1 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#0E1D33]/80 backdrop-blur-md border border-[#243A5E]/80 shadow-md shrink-0"
          aria-label="Documentary Chapters"
        >
          {CINEMATIC_CHAPTERS.map((chap, idx) => {
            const isActive = currentChapterIndex === idx;
            const isPassed = currentChapterIndex > idx;

            // Compute chapter progress percentage (0 - 100%)
            let chapterProgress = 0;
            if (isPassed) {
              chapterProgress = 100;
            } else if (isActive) {
              chapterProgress = Math.min(100, (chapterElapsed / chap.duration) * 100);
            }

            return (
              <button
                key={chap.id}
                type="button"
                onClick={() => handleJumpToChapter(idx)}
                className="group flex flex-col items-start gap-1 p-0.5 sm:p-1 sm:px-2 rounded-md hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#38BDF8]"
                title={`Jump to Chapter ${chap.chapterNumber}: ${chap.title}`}
                aria-label={`Chapter ${chap.chapterNumber} ${chap.title}`}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase">
                  <span
                    className={`font-semibold transition-colors duration-300 ${
                      isActive
                        ? 'text-[#38BDF8]'
                        : isPassed
                        ? 'text-slate-300'
                        : 'text-slate-500'
                    }`}
                  >
                    {chap.chapterNumber}
                  </span>
                  <span
                    className={`hidden md:inline transition-colors duration-300 ${
                      isActive
                        ? 'text-white font-medium'
                        : isPassed
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {chap.title}
                  </span>
                </div>

                {/* Micro Progress Track */}
                <div className="w-5 sm:w-16 md:w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#38BDF8] to-[#159E9A] transition-all duration-100 ease-linear rounded-full"
                    style={{ width: `${chapterProgress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Skip Intro Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#0E1D33]/85 hover:bg-[#14243D] text-[11px] sm:text-xs font-semibold text-slate-200 border border-[#243A5E]/80 hover:border-[#38BDF8]/60 shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] cursor-pointer shrink-0"
          aria-label="Skip cinematic introduction and enter website"
        >
          <span className="hidden xs:inline sm:inline">Skip Intro</span>
          <span className="xs:hidden sm:hidden">Skip</span>
          <SkipForward className="w-3.5 h-3.5 text-[#38BDF8]" aria-hidden="true" />
        </button>
      </header>

      {/* =========================================================================
          LAYER 2: EDITORIAL CINEMATIC OVERLAYS & NARRATIVE CHOREOGRAPHY
          ========================================================================= */}
      <main className="relative z-20 w-full flex-1 flex flex-col justify-end px-4 sm:px-8 md:px-14 pb-8 sm:pb-12 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          {/* Chapter Metadata Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0E1D33]/90 backdrop-blur-md border border-[#243A5E] text-xs font-mono tracking-widest uppercase mb-3 shadow-md animate-fadeIn">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: activeChapter.accentColor }}
            />
            <span className="font-bold" style={{ color: activeChapter.accentColor }}>
              CHAPTER {activeChapter.chapterNumber}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-200 font-medium">{activeChapter.title}</span>
          </div>

          {/* CHAPTER 01: Word-by-Word Reveal */}
          {currentChapterIndex === 0 && (
            <div className="space-y-3">
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.18] drop-shadow-md">
                {headlineWords.map((word, wordIdx) => {
                  const isRevealed = chapterElapsed >= 0.25 + wordIdx * 0.12;
                  return (
                    <span
                      key={wordIdx}
                      className={`inline-block mr-2 transition-all duration-500 ease-out ${
                        isRevealed
                          ? 'opacity-100 translate-y-0 filter-none'
                          : 'opacity-0 translate-y-3 blur-xs'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </h1>
              <p
                className={`text-sm sm:text-base md:text-lg text-[#DCEBF5] font-normal leading-relaxed max-w-xl transition-all duration-700 ease-out drop-shadow-sm ${
                  chapterElapsed >= 1.5
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3'
                }`}
              >
                {activeChapter.supportingText}
              </p>
            </div>
          )}

          {/* CHAPTER 02: Elegant Masked Typography */}
          {currentChapterIndex === 1 && (
            <div className="space-y-3">
              <div className="overflow-hidden">
                <h1
                  className={`font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.18] drop-shadow-md transition-all duration-700 ease-out ${
                    chapterElapsed >= 0.35
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-full opacity-0'
                  }`}
                >
                  {activeChapter.headline}
                </h1>
              </div>
              <p
                className={`text-sm sm:text-base md:text-lg text-[#DCEBF5] font-normal leading-relaxed max-w-xl transition-all duration-700 ease-out drop-shadow-sm ${
                  chapterElapsed >= 1.1
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3'
                }`}
              >
                {activeChapter.supportingText}
              </p>
            </div>
          )}

          {/* CHAPTER 03: Sequential Dynamic Reveal */}
          {currentChapterIndex === 2 && (
            <div className="space-y-3">
              <h1
                className={`font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.18] drop-shadow-md transition-all duration-700 ease-out ${
                  chapterElapsed >= 0.35
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3'
                }`}
              >
                {activeChapter.headline}
              </h1>
              <p
                className={`text-sm sm:text-base md:text-lg text-[#DDF0E6] font-normal leading-relaxed max-w-xl transition-all duration-700 ease-out drop-shadow-sm ${
                  chapterElapsed >= 1.0
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3'
                }`}
              >
                {activeChapter.supportingText}
              </p>

              {/* Action Pillars Badges */}
              <div
                className={`flex flex-wrap items-center gap-2 pt-2 transition-all duration-700 ease-out ${
                  chapterElapsed >= 1.6
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-3'
                }`}
              >
                <span className="px-2.5 py-1 rounded-full bg-[#10B981]/15 text-[#6EE7B7] border border-[#10B981]/30 text-xs font-medium">
                  Peer Outreach
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#159E9A]/15 text-[#5EEAD4] border border-[#159E9A]/30 text-xs font-medium">
                  Counselor Support
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#38BDF8]/15 text-[#7DD3FC] border border-[#38BDF8]/30 text-xs font-medium">
                  Healthy Campus
                </span>
              </div>
            </div>
          )}

          {/* CHAPTER 04: Golden Hour Reveal + Institutional Identity + CTA */}
          {currentChapterIndex === 3 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h1
                  className={`font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.18] drop-shadow-md transition-all duration-700 ease-out ${
                    chapterElapsed >= 0.35
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3'
                  }`}
                >
                  {activeChapter.headline}
                </h1>
                <p
                  className={`text-sm sm:text-base md:text-lg text-[#FEF3C7] font-normal leading-relaxed max-w-xl transition-all duration-700 ease-out drop-shadow-sm ${
                    chapterElapsed >= 0.9
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3'
                  }`}
                >
                  {activeChapter.supportingText}
                </p>
              </div>

              {/* Final NSS MJCET Nasha Mukti Abhiyaan Brand Reveal Card */}
              <div
                className={`pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-800 ease-out ${
                  chapterElapsed >= 1.5
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0E1D33]/90 backdrop-blur-md border border-[#243A5E] shadow-lg">
                  <img
                    src="/assets/branding/nss-logo.png"
                    alt="Official NSS Logo"
                    className="w-10 h-10 object-contain drop-shadow-sm"
                  />
                  <div>
                    <h2 className="text-sm font-bold tracking-wider text-[#EA580C] uppercase font-serif">
                      NSS MJCET
                    </h2>
                    <p className="text-xs font-semibold text-white tracking-tight">
                      NASHA MUKTI ABHIYAAN
                    </p>
                    <p className="text-[10px] text-slate-400 font-normal">
                      Muffakham Jah College of Engineering &amp; Technology
                    </p>
                  </div>
                </div>

                {/* Primary CTA: Explore the Campaign */}
                <button
                  type="button"
                  onClick={handleEnterHome}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#159E9A] via-[#0D9488] to-[#0F766E] hover:from-[#0D9488] hover:to-[#115E59] text-white text-sm sm:text-base font-semibold shadow-lg shadow-teal-900/40 border border-teal-400/30 hover:scale-102 active:scale-98 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <span>Explore the Campaign</span>
                  <ArrowRight className="w-4 h-4 text-teal-200" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Subtle Status Pill */}
      <footer className="relative z-30 w-full px-4 sm:px-8 pb-4 flex items-center justify-between text-[11px] text-slate-400 font-mono pointer-events-none">
        <span className="hidden sm:inline">
          Documentary Journey &bull; From Silence to Strength
        </span>
        <span className="ml-auto">
          {Math.floor(chapterElapsed)}s / {Math.floor(activeChapter.duration)}s
        </span>
      </footer>
    </div>
  );
};
