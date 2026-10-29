import React from 'react';
import { Volume2, VolumeX, SkipForward, ArrowRight } from 'lucide-react';
import { CINEMATIC_BEATS, TOTAL_CINEMATIC_DURATION } from '../../types/cinematic';

interface CinematicOverlaysProps {
  elapsedTime: number;
  currentBeatIndex: number;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onSkip: () => void;
  onEnterHome: () => void;
}

export const CinematicOverlays: React.FC<CinematicOverlaysProps> = ({
  elapsedTime,
  currentBeatIndex,
  isAudioActive,
  onToggleAudio,
  onSkip,
  onEnterHome,
}) => {
  const currentBeat = CINEMATIC_BEATS[currentBeatIndex] || CINEMATIC_BEATS[0];
  const isRevealBeat = currentBeatIndex === CINEMATIC_BEATS.length - 1;
  const progressPercent = Math.min(100, (elapsedTime / TOTAL_CINEMATIC_DURATION) * 100);

  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    return `00:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-8 z-30 select-none">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between gap-4 pointer-events-auto">
        {/* Campaign Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EAF5FB]/90 dark:bg-darkSurface-card/90 backdrop-blur-md border border-[#CFE3F0] dark:border-darkSurface-border shadow-xs">
          <img
            src="/assets/branding/nss-logo.png"
            alt="NSS Official Emblem"
            className="w-5 h-5 object-contain"
          />
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-[#159E9A] dark:text-[#5EEAD4]">NSS MJCET</span>
            <span className="text-charcoal-400 dark:text-charcoal-600">&bull;</span>
            <span className="text-charcoal-700 dark:text-charcoal-300 font-medium hidden sm:inline">
              Nasha Mukti Abhiyaan
            </span>
          </div>
        </div>

        {/* Story Beat Indicators */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5FB]/85 dark:bg-darkSurface-card/80 backdrop-blur-md border border-[#CFE3F0] dark:border-darkSurface-border">
          {CINEMATIC_BEATS.map((beat, idx) => (
            <div key={beat.id} className="flex items-center gap-1.5">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full transition-all duration-300 ${
                  currentBeatIndex === idx
                    ? 'bg-[#159E9A] text-white shadow-xs'
                    : currentBeatIndex > idx
                    ? 'text-charcoal-400 dark:text-charcoal-500 line-through decoration-[#159E9A]'
                    : 'text-charcoal-500 dark:text-charcoal-400'
                }`}
              >
                {beat.label}
              </span>
              {idx < CINEMATIC_BEATS.length - 1 && (
                <span className="text-charcoal-300 dark:text-charcoal-600 text-xs">&rarr;</span>
              )}
            </div>
          ))}
        </div>

        {/* Action Controls: Sound & Skip */}
        <div className="flex items-center gap-2">
          {/* Audio Toggle (Muted by default per specification) */}
          <button
            type="button"
            onClick={onToggleAudio}
            className={`p-2.5 rounded-full border transition-all duration-200 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
              isAudioActive
                ? 'bg-[#DDF3F0] dark:bg-teal-950/60 text-[#159E9A] dark:text-[#5EEAD4] border-[#159E9A]/30 dark:border-teal-700'
                : 'bg-[#EAF5FB]/85 dark:bg-darkSurface-card/85 text-charcoal-600 dark:text-charcoal-300 border-[#CFE3F0] dark:border-darkSurface-border hover:bg-[#DDF3F0] dark:hover:bg-darkSurface-card'
            }`}
            aria-label={isAudioActive ? 'Mute ambient soundtrack' : 'Enable ambient soundtrack'}
            title={isAudioActive ? 'Mute soundtrack' : 'Enable ambient cinematic soundtrack'}
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {/* Skip Intro Button */}
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#EAF5FB]/90 dark:bg-darkSurface-card/90 hover:bg-[#DDF3F0] dark:hover:bg-darkSurface-card text-xs font-semibold text-charcoal-800 dark:text-charcoal-200 border border-[#CFE3F0] dark:border-darkSurface-border shadow-xs hover:border-[#159E9A] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
            aria-label="Skip cinematic introduction and enter website"
          >
            <span>Skip Intro</span>
            <SkipForward className="w-3.5 h-3.5 text-[#159E9A]" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Center Story Beat Narrative / Cinematic Identity Reveal */}
      <div className="mx-auto max-w-xl text-center pointer-events-auto transition-opacity duration-500 my-auto">
        {!isRevealBeat ? (
          <div className="px-6 py-5 rounded-2xl bg-[#EAF5FB]/90 dark:bg-darkSurface-card/90 backdrop-blur-md border border-[#CFE3F0] dark:border-darkSurface-border shadow-elevated">
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#159E9A] dark:text-[#5EEAD4]">
              {currentBeat.chapter}
            </span>
            <h2 className="mt-1 font-serif text-xl sm:text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-white tracking-tight">
              {currentBeat.headline}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-charcoal-700 dark:text-charcoal-300 leading-relaxed font-normal">
              {currentBeat.narrative}
            </p>
          </div>
        ) : (
          /* Beat 5: Refined Institutional Campaign Identity Reveal */
          <div className="px-8 py-8 sm:px-10 sm:py-10 rounded-3xl bg-[#EAF5FB]/95 dark:bg-darkSurface-card/95 backdrop-blur-xl border border-[#CFE3F0] dark:border-darkSurface-border shadow-elevated text-center">
            {/* Emblems & Unit Lineage */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <img
                src="/assets/branding/nss-logo.png"
                alt="National Service Scheme Seal"
                className="w-10 h-10 object-contain"
              />
              <div className="text-left">
                <span className="text-[11px] uppercase font-extrabold tracking-widest text-saffron-600 dark:text-saffron-400 block leading-none">
                  NSS MJCET
                </span>
                <span className="text-[10px] text-charcoal-500 dark:text-charcoal-400 font-medium">
                  Osmania University
                </span>
              </div>
            </div>

            <h1 className="mt-3 font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 dark:text-white tracking-tight leading-tight">
              Nasha Mukti Abhiyaan
            </h1>

            <div className="mt-3 inline-block px-3.5 py-1 rounded-full bg-saffron-50 dark:bg-saffron-950/40 border border-saffron-200 dark:border-saffron-800/80 text-xs sm:text-sm font-serif italic text-saffron-700 dark:text-saffron-300">
              “Every choice shapes a future.”
            </div>

            <p className="mt-3 text-xs sm:text-sm font-medium tracking-wide text-charcoal-600 dark:text-charcoal-300">
              Awareness &bull; Resilience &bull; Compassion
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onEnterHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-sm shadow-saffron-subtle hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
              >
                <span>Enter Campaign Experience</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Progress Bar & Time */}
      <div className="w-full flex items-center gap-3 pointer-events-auto">
        <span className="text-[11px] font-mono font-medium text-charcoal-500 dark:text-charcoal-400 shrink-0">
          {formatTime(elapsedTime)}
        </span>

        <div className="flex-1 h-1.5 bg-ivory-200 dark:bg-darkSurface-border rounded-full overflow-hidden">
          <div
            className="h-full bg-saffron-500 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="text-[11px] font-mono font-medium text-charcoal-500 dark:text-charcoal-400 shrink-0">
          {formatTime(TOTAL_CINEMATIC_DURATION)}
        </span>
      </div>
    </div>
  );
};
