import React, { useState, useEffect } from 'react';
import {
  Brain,
  Megaphone,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Activity as ActivityIcon,
} from 'lucide-react';
import { ActivityStats } from '../../types/activity';

interface CampaignImpactShowcaseProps {
  stats: ActivityStats;
  className?: string;
}

interface CampaignStage {
  id: string;
  step: string;
  label: string;
  shortLabel: string;
  subtext: string;
  icon: React.ReactNode;
  accent: {
    bgLight: string;
    bgDark: string;
    textLight: string;
    textDark: string;
    borderLight: string;
    borderDark: string;
    glow: string;
  };
}

export const CampaignImpactShowcase: React.FC<CampaignImpactShowcaseProps> = ({
  stats,
  className = '',
}) => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check user preference for reduced motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Gentle sequential pulse through stages (respects reduced motion)
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const stages: CampaignStage[] = [
    {
      id: 'awareness',
      step: '01',
      label: 'Awareness',
      shortLabel: 'Learn',
      subtext: 'Scientific Education',
      icon: <Brain className="w-4 h-4" aria-hidden="true" />,
      accent: {
        bgLight: 'bg-[#DDF3F0]',
        bgDark: 'dark:bg-teal-950/70',
        textLight: 'text-[#159E9A]',
        textDark: 'dark:text-[#5EEAD4]',
        borderLight: 'border-[#99F6E4]',
        borderDark: 'dark:border-teal-800',
        glow: 'rgba(21, 158, 154, 0.3)',
      },
    },
    {
      id: 'action',
      step: '02',
      label: 'Action',
      shortLabel: 'Mobilize',
      subtext: 'Campus Rallies & Drives',
      icon: <Megaphone className="w-4 h-4" aria-hidden="true" />,
      accent: {
        bgLight: 'bg-[#FEF3C7]',
        bgDark: 'dark:bg-amber-950/60',
        textLight: 'text-[#D97706]',
        textDark: 'dark:text-[#FBBF24]',
        borderLight: 'border-[#FDE68A]',
        borderDark: 'dark:border-amber-800',
        glow: 'rgba(217, 119, 6, 0.3)',
      },
    },
    {
      id: 'solidarity',
      step: '03',
      label: 'Solidarity',
      shortLabel: 'Stand',
      subtext: 'Empathetic Peer Circles',
      icon: <HeartHandshake className="w-4 h-4" aria-hidden="true" />,
      accent: {
        bgLight: 'bg-[#DDF0E6]',
        bgDark: 'dark:bg-emerald-950/70',
        textLight: 'text-[#239B70]',
        textDark: 'dark:text-[#34D399]',
        borderLight: 'border-[#A7F3D0]',
        borderDark: 'dark:border-emerald-800',
        glow: 'rgba(35, 155, 112, 0.3)',
      },
    },
    {
      id: 'support',
      step: '04',
      label: 'Support',
      shortLabel: 'Care',
      subtext: 'Confidential Care Pathways',
      icon: <PhoneCall className="w-4 h-4" aria-hidden="true" />,
      accent: {
        bgLight: 'bg-[#DCEBF5]',
        bgDark: 'dark:bg-blue-950/70',
        textLight: 'text-[#4F8FE8]',
        textDark: 'dark:text-[#95C2FA]',
        borderLight: 'border-[#BFDBFE]',
        borderDark: 'dark:border-blue-800',
        glow: 'rgba(79, 143, 232, 0.3)',
      },
    },
  ];

  return (
    <div
      className={`relative w-full rounded-3xl p-4 sm:p-7 bg-gradient-to-br from-[#EAF5FB]/95 via-[#F4FAFD]/90 to-[#E8F3FA]/95 dark:from-[#14243D]/95 dark:via-[#112036]/90 dark:to-[#0E1B2E]/95 border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card overflow-hidden select-none transition-all duration-300 ${className}`}
      role="region"
      aria-label="Campaign Continuum & Strategic Stages"
    >
      {/* Ambient Radial Illumination Behind Visual */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none -z-0 opacity-40 dark:opacity-20 transition-opacity"
        style={{
          background:
            'radial-gradient(circle, rgba(21, 158, 154, 0.25) 0%, rgba(79, 143, 232, 0.15) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Decorative Subtle Concentric Rings */}
      <div
        className="absolute top-0 right-0 w-36 h-36 rounded-bl-full border-b border-l border-[#B9DDF5]/40 dark:border-[#243A5E]/40 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-full border-b border-l border-[#159E9A]/20 dark:border-teal-500/10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Header Badge: Operational State & Institutional Lineage */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#CFE3F0]/80 dark:border-[#243A5E]/80">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#EAF5FB] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] text-[11px] font-semibold text-[#183153] dark:text-slate-200">
          <span className="w-2 h-2 rounded-full bg-[#239B70] animate-pulse" aria-hidden="true" />
          <span className="font-mono font-bold text-[#159E9A] dark:text-[#5EEAD4]">NSS MJCET</span>
          <span className="text-slate-300 dark:text-slate-600">&bull;</span>
          <span className="truncate">Nasha Mukti</span>
        </div>

        {/* Live Status Badge */}
        {stats.upcomingCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DDF0E6] dark:bg-emerald-950/60 border border-[#A7F3D0] dark:border-emerald-800 text-[11px] font-bold text-[#239B70] dark:text-[#34D399] shrink-0 shadow-2xs">
            <ActivityIcon className="w-3 h-3 text-[#239B70] dark:text-[#34D399]" aria-hidden="true" />
            <span className="hidden xs:inline">Active Mobilization</span>
            <span className="xs:hidden">Active</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DDF3F0] dark:bg-teal-950/60 border border-[#99F6E4] dark:border-teal-800 text-[11px] font-bold text-[#159E9A] dark:text-[#5EEAD4] shrink-0">
            <Sparkles className="w-3 h-3 text-[#159E9A] dark:text-[#5EEAD4]" aria-hidden="true" />
            <span className="hidden xs:inline">Verified Drives</span>
            <span className="xs:hidden">Verified</span>
          </span>
        )}
      </div>

      {/* Prominent Core Campaign Statement */}
      <div className="relative z-10 mb-4 text-left">
        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#159E9A] dark:text-[#5EEAD4] flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          <span>Strategic Framework</span>
        </p>
        <h2 className="font-serif text-base sm:text-xl font-bold text-[#183153] dark:text-white mt-1 leading-snug">
          Building a Healthier, Drug-Free Campus Together.
        </h2>
        <p className="text-xs text-[#4F678A] dark:text-slate-300 mt-1 leading-relaxed">
          Four interconnected pillars guiding students from scientific awareness to peer solidarity and recovery lifelines.
        </p>
      </div>

      {/* Central Animated Pathway: 4 Stages Continuum */}
      <div className="relative z-10 my-4">
        {/* Animated Connecting Pathway SVG */}
        <div className="hidden sm:block absolute top-6 left-8 right-8 h-1 -z-0 pointer-events-none" aria-hidden="true">
          <svg className="w-full h-2 overflow-visible" preserveAspectRatio="none">
            {/* Base Track */}
            <line
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="text-[#CFE3F0] dark:text-[#243A5E]"
            />
            {/* Luminous Progression Segment */}
            <line
              x1="0%"
              y1="50%"
              x2={`${((activeStage + 1) / 4) * 100}%`}
              y2="50%"
              stroke="url(#gradient-flow)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#159E9A" />
                <stop offset="50%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#4F8FE8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 4 Interactive Strategic Stage Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <div
                key={stage.id}
                onMouseEnter={() => setActiveStage(idx)}
                onClick={() => setActiveStage(idx)}
                className={`group relative p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 w-full overflow-hidden ${
                  isActive
                    ? `${stage.accent.bgLight} ${stage.accent.bgDark} ${stage.accent.borderLight} ${stage.accent.borderDark} shadow-sm -translate-y-1`
                    : 'bg-white/70 dark:bg-[#1B2F4E]/60 border-[#CFE3F0]/80 dark:border-[#243A5E]/80 hover:bg-white dark:hover:bg-[#1B2F4E] hover:-translate-y-0.5'
                }`}
                style={{
                  boxShadow: isActive ? `0 8px 20px -6px ${stage.accent.glow}` : undefined,
                }}
              >
                {/* Stage Step Indicator & Icon Node */}
                <div className="flex items-center gap-2 mb-2 shrink-0">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      stage.accent.bgLight
                    } ${stage.accent.bgDark} ${stage.accent.textLight} ${stage.accent.textDark} border ${
                      stage.accent.borderLight
                    } ${stage.accent.borderDark} ${isActive ? 'scale-105 shadow-xs' : 'group-hover:scale-105'}`}
                  >
                    {stage.icon}
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isActive ? stage.accent.textLight + ' ' + stage.accent.textDark : 'text-slate-400'
                    }`}
                  >
                    {stage.step}
                  </span>
                </div>

                {/* Stage Title */}
                <h3
                  className={`text-xs font-bold leading-tight w-full truncate ${
                    isActive ? 'text-[#183153] dark:text-white' : 'text-[#334C73] dark:text-slate-200'
                  }`}
                >
                  <span className="hidden xs:inline">{stage.label}</span>
                  <span className="xs:hidden">{stage.shortLabel}</span>
                </h3>

                {/* Stage Subtext */}
                <p className="text-[10px] text-[#4F678A] dark:text-slate-300 mt-0.5 leading-snug w-full truncate">
                  {stage.subtext}
                </p>

                {/* Active Indicator Pulse Ring */}
                {isActive && (
                  <div
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#159E9A] dark:bg-[#5EEAD4] ring-2 ring-white dark:ring-[#14243D]"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Information Strip */}
      <div className="relative z-10 mt-5 pt-3.5 border-t border-[#CFE3F0]/80 dark:border-[#243A5E]/80 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 text-left">
        {/* Active Stage Callout */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-[#EAF5FB] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-center text-[#159E9A] dark:text-[#5EEAD4] shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#239B70]" aria-hidden="true" />
          </div>
          <div className="text-xs truncate">
            <span className="font-bold text-[#183153] dark:text-white">
              Stage {stages[activeStage].step}: {stages[activeStage].label}
            </span>
            <span className="text-slate-400 dark:text-slate-500 mx-1.5 hidden sm:inline">&bull;</span>
            <span className="text-[#4F678A] dark:text-slate-300 text-[11px] hidden sm:inline">
              {stages[activeStage].subtext}
            </span>
          </div>
        </div>

        {/* Ethical Safeguard Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF5FB]/90 dark:bg-[#14243D] border border-[#CFE3F0] dark:border-[#243A5E] text-[11px] font-semibold text-[#183153] dark:text-slate-300 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-[#239B70]" aria-hidden="true" />
          <span>Zero Retribution Guarantee</span>
        </div>
      </div>
    </div>
  );
};
