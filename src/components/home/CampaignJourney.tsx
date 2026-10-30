import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Users,
  HeartHandshake,
  PhoneCall,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Container } from '../common/Container';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { ScrollReveal } from '../common/ScrollReveal';

interface CampaignPillar {
  id: string;
  number: string;
  domain: string;
  title: string;
  kicker: string;
  tagline: string;
  description: string;
  highlights: string[];
  quote: string;
  ctaText: string;
  ctaLink: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  image: string;
  imageAlt: string;
  accentColor: string;
  themeStyle: {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    cardBg: string;
    cardBorder: string;
    glowBg: string;
    watermarkColor: string;
    accentIconBg: string;
  };
}

const CAMPAIGN_PILLARS: CampaignPillar[] = [
  {
    id: 'pillar-01',
    number: '01',
    domain: 'Curriculum Foundation',
    kicker: 'Scientific Education',
    title: 'Scientific Understanding & Prevention',
    tagline: 'Demystifying Neurobiology & Dismantling Misconceptions',
    description:
      'Addiction is a biological vulnerability, not a character failure. Our curriculum bridges neurochemistry with practical peer education—explaining how dopamine pathways adapt to chronic exposure, debunking prevalent collegiate myths, and empowering students to make informed, protective decisions.',
    highlights: [
      'Neurobiology of tolerance & dopamine receptor changes',
      'Fact-checked refutation of common student myths',
      'Cognitive resilience & evidence-based coping skills',
    ],
    quote: 'Knowledge transforms hesitation into conviction. Understanding chemical tolerance demystifies habituation.',
    ctaText: 'Explore Awareness Curriculum',
    ctaLink: '/awareness',
    ctaSecondaryText: 'Take Knowledge Quiz',
    ctaSecondaryLink: '/quiz',
    image: '/assets/campaign/pillar-01-awareness.jpg',
    imageAlt: 'Medical and academic literature representing scientific substance awareness and education',
    accentColor: '#159E9A',
    themeStyle: {
      badgeBg: 'bg-[#DDF3F0] dark:bg-teal-950/70',
      badgeText: 'text-[#159E9A] dark:text-[#5EEAD4]',
      badgeBorder: 'border-[#99F6E4]/70 dark:border-teal-800',
      cardBg:
        'bg-gradient-to-br from-[#EAF6FB]/95 via-[#E1F3F0]/85 to-[#D8ECE9]/75 dark:from-[#0E1F33] dark:via-[#0F2833] dark:to-[#0B1A24]',
      cardBorder: 'border-[#BDE5DF]/80 dark:border-[#1E434D]',
      glowBg: 'rgba(21, 158, 154, 0.15)',
      watermarkColor: 'text-[#159E9A]/10 dark:text-[#5EEAD4]/10',
      accentIconBg: 'bg-[#CCECE7] dark:bg-teal-950/80 text-[#159E9A] dark:text-[#5EEAD4]',
    },
  },
  {
    id: 'pillar-02',
    number: '02',
    domain: 'On-Ground Movement',
    kicker: 'Youth Mobilization',
    title: 'Student-Led Campus Mobilization',
    tagline: 'Energizing Advocacy Through Culture & Direct Engagement',
    description:
      'Collegiate culture shifts when students lead the dialogue. NSS MJCET volunteers spearhead energetic anti-substance drives across campus—from street theater (nukkad natak) in high-traffic quads to interactive seminars, youth pledges, and collaborative inter-collegiate forums.',
    highlights: [
      'Nukkad natak (street plays) addressing social pressures',
      'Mass student pledges & active volunteer enrollments',
      'Workshops led by trained peer facilitators',
    ],
    quote: 'When students organize for student health, cultural silence is replaced by collective courage.',
    ctaText: 'View Campus Activities & Drives',
    ctaLink: '/activities',
    ctaSecondaryText: 'View Photo Gallery',
    ctaSecondaryLink: '/gallery',
    image: '/assets/campaign/pillar-02-campus-action.jpg',
    imageAlt: 'NSS MJCET student volunteers leading an energetic campus awareness rally',
    accentColor: '#D97706',
    themeStyle: {
      badgeBg: 'bg-[#FAF0DE] dark:bg-amber-950/70',
      badgeText: 'text-[#D97706] dark:text-[#FBBF24]',
      badgeBorder: 'border-[#FDE68A]/70 dark:border-amber-800',
      cardBg:
        'bg-gradient-to-br from-[#FAF5EC]/95 via-[#F5EEDB]/85 to-[#ECE5D0]/75 dark:from-[#1A2333] dark:via-[#1D2128] dark:to-[#141A22]',
      cardBorder: 'border-[#E8DCC0]/80 dark:border-[#383E4C]',
      glowBg: 'rgba(217, 119, 6, 0.15)',
      watermarkColor: 'text-[#D97706]/10 dark:text-[#FBBF24]/10',
      accentIconBg: 'bg-[#FBE8C8] dark:bg-amber-950/80 text-[#D97706] dark:text-[#FBBF24]',
    },
  },
  {
    id: 'pillar-03',
    number: '03',
    domain: 'Campus Culture',
    kicker: 'Collective Responsibility',
    title: 'Peer Solidarity & Active Community',
    tagline: 'Creating an Empathetic, Stigma-Free Campus Circle',
    description:
      'Vulnerability should never meet judgment. We equip class representatives, hostel seniors, and student mentors with active bystander skills—ensuring that behavioral warning signs are met with confidential warmth, non-judgmental listening, and direct linkage to institutional care.',
    highlights: [
      'Active bystander intervention training for students',
      'Confidential peer listening circles & mentor check-ins',
      'Collective responsibility that dismantles isolation',
    ],
    quote: 'No student stands alone at MJCET. Empathy and active listening are our everyday campus standards.',
    ctaText: 'Discover Community Solidarity',
    ctaLink: '/gallery',
    ctaSecondaryText: 'Read Student Pledge',
    ctaSecondaryLink: '#closing-heading',
    image: '/assets/campaign/pillar-03-solidarity.jpg',
    imageAlt: 'Diverse collegiate students gathered in compassionate unity and mutual encouragement',
    accentColor: '#239B70',
    themeStyle: {
      badgeBg: 'bg-[#DDF0E6] dark:bg-emerald-950/70',
      badgeText: 'text-[#239B70] dark:text-[#34D399]',
      badgeBorder: 'border-[#A7F3D0]/70 dark:border-emerald-800',
      cardBg:
        'bg-gradient-to-br from-[#EBF6F0]/95 via-[#DFEFE7]/85 to-[#D5EAE0]/75 dark:from-[#0D211F] dark:via-[#102924] dark:to-[#0A1A17]',
      cardBorder: 'border-[#BDE5CE]/80 dark:border-[#1E4B3E]',
      glowBg: 'rgba(35, 155, 112, 0.15)',
      watermarkColor: 'text-[#239B70]/10 dark:text-[#34D399]/10',
      accentIconBg: 'bg-[#CAEADB] dark:bg-emerald-950/80 text-[#239B70] dark:text-[#34D399]',
    },
  },
  {
    id: 'pillar-04',
    number: '04',
    domain: 'Clinical Care Access',
    kicker: 'Confidential Guidance',
    title: 'Confidential Support Beacon & Lifelines',
    tagline: 'Immediate, Professional, and Stigma-Free Helplines',
    description:
      'Reaching out for help is an act of genuine courage. We provide immediate access to qualified psychological counselors, college health advisors, and national 24/7 toll-free lifelines—guaranteeing 100% confidential support with zero institutional penalty or judgment.',
    highlights: [
      '24/7 National Tele-MANAS (14446) & NMBA (14416) Helplines',
      'Strictly confidential campus psychological counseling',
      'Warm handover & individualized rehabilitation pathways',
    ],
    quote: 'Help is always available. A single conversation can illuminate the pathway to recovery and wellbeing.',
    ctaText: 'Access Verified Support Resources',
    ctaLink: '/support',
    ctaSecondaryText: 'Call Tele-MANAS (14446)',
    ctaSecondaryLink: 'tel:14446',
    image: '/assets/campaign/pillar-04-support-beacon.jpg',
    imageAlt: 'Empathetic counselor providing confidential, professional mental health guidance',
    accentColor: '#4F8FE8',
    themeStyle: {
      badgeBg: 'bg-[#DCEBF5] dark:bg-blue-950/70',
      badgeText: 'text-[#4F8FE8] dark:text-[#95C2FA]',
      badgeBorder: 'border-[#B9DDF5]/70 dark:border-blue-800',
      cardBg:
        'bg-gradient-to-br from-[#EAF3FA]/95 via-[#E1EDF7]/85 to-[#D4E4F3]/75 dark:from-[#0E1D33] dark:via-[#132540] dark:to-[#0B1626]',
      cardBorder: 'border-[#BCD7EF]/80 dark:border-[#223E66]',
      glowBg: 'rgba(79, 143, 232, 0.15)',
      watermarkColor: 'text-[#4F8FE8]/10 dark:text-[#95C2FA]/10',
      accentIconBg: 'bg-[#C7E0F2] dark:bg-blue-950/80 text-[#4F8FE8] dark:text-[#95C2FA]',
    },
  },
];

export const CampaignJourney: React.FC = () => {
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [revealedPillars, setRevealedPillars] = useState<boolean[]>([false, false, false, false]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);

  // Sequential Staggered Transition Trigger
  useEffect(() => {
    // 1. Accessibility Check: Respect user's reduced-motion preference
    if (typeof window !== 'undefined') {
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (reducedMotionQuery.matches) {
        setRevealedPillars([true, true, true, true]);
        return;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reveal card 0 immediately
          setRevealedPillars((prev) => {
            const next = [...prev];
            next[0] = true;
            return next;
          });

          // Staggered reveal for subsequent cards: ~1.2s to 1.4s interval
          const t1 = window.setTimeout(() => {
            setRevealedPillars((prev) => {
              const next = [...prev];
              next[1] = true;
              return next;
            });
          }, 1300);

          const t2 = window.setTimeout(() => {
            setRevealedPillars((prev) => {
              const next = [...prev];
              next[2] = true;
              return next;
            });
          }, 2600);

          const t3 = window.setTimeout(() => {
            setRevealedPillars((prev) => {
              const next = [...prev];
              next[3] = true;
              return next;
            });
          }, 3900);

          timersRef.current = [t1, t2, t3];

          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { threshold: 0.12 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Monitor pillar visibility on scroll to update the active timeline step
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.45;
      const pillars = CAMPAIGN_PILLARS.map((p) => {
        const el = document.getElementById(p.id);
        if (!el) return { index: 0, top: 0 };
        const rect = el.getBoundingClientRect();
        return { top: rect.top + window.pageYOffset };
      });

      for (let i = pillars.length - 1; i >= 0; i--) {
        if (pillars[i] && scrollPosition >= pillars[i].top) {
          setActivePillarIndex(i);
          // If user scrolled to this pillar, mark it and previous pillars as revealed immediately
          setRevealedPillars((prev) => {
            let changed = false;
            const next = [...prev];
            for (let j = 0; j <= i; j++) {
              if (!next[j]) {
                next[j] = true;
                changed = true;
              }
            }
            return changed ? next : prev;
          });
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPillar = useCallback((id: string, index: number) => {
    setActivePillarIndex(index);
    // Ensure this card and all previous cards are immediately revealed
    setRevealedPillars((prev) => {
      const next = [...prev];
      for (let j = 0; j <= index; j++) {
        next[j] = true;
      }
      return next;
    });

    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // Offset for fixed navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const getPillarIcon = (number: string) => {
    switch (number) {
      case '01':
        return <Brain className="w-5 h-5" aria-hidden="true" />;
      case '02':
        return <Users className="w-5 h-5" aria-hidden="true" />;
      case '03':
        return <HeartHandshake className="w-5 h-5" aria-hidden="true" />;
      case '04':
        return <PhoneCall className="w-5 h-5" aria-hidden="true" />;
      default:
        return <Sparkles className="w-5 h-5" aria-hidden="true" />;
    }
  };

  return (
    <section
      id="campaign-journey"
      ref={sectionRef}
      className="py-16 sm:py-24 border-t border-[#CFE3F0] dark:border-[#243A5E] relative overflow-hidden transition-colors duration-200"
      aria-labelledby="campaign-journey-heading"
    >
      {/* Rich Atmospheric Section Tonal Background — zero pure white */}
      <AtmosphericBackground variant="section-tonal" showRibbons />

      <Container size="wide" className="relative z-10">
        {/* =====================================================================
            1. SECTION HEADER: "From Awareness to Action"
            DM Serif Display prominent heading with Manrope supporting text
            ===================================================================== */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
          <ScrollReveal direction="up" delayMs={30}>
            {/* Institutional Campaign Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5FB]/95 dark:bg-[#14243D] border border-[#CFE3F0] dark:border-[#243A5E] text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-[#159E9A] animate-pulse" aria-hidden="true" />
              <span className="tracking-wider uppercase">Interactive Campaign Journey</span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-[#334C73] dark:text-slate-300 font-normal">NSS MJCET Framework</span>
            </div>

            {/* Primary Headline */}
            <h2
              id="campaign-journey-heading"
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#183153] dark:text-white tracking-tight leading-[1.12]"
            >
              From Awareness{' '}
              <span className="italic text-[#159E9A] dark:text-[#5EEAD4] font-serif font-normal">
                to Action
              </span>
            </h2>

            {/* Prompt Mandate Supporting Statement */}
            <p className="mt-4 sm:mt-5 text-lg sm:text-2xl font-serif text-[#183153] dark:text-slate-200 tracking-tight font-medium">
              &ldquo;Four pillars. One collective mission. A healthier tomorrow.&rdquo;
            </p>

            {/* Explanatory Context */}
            <p className="mt-3 text-sm sm:text-base text-[#334C73] dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              A structured continuum of student wellbeing—connecting scientific clarity, active campus mobilization, peer solidarity, and verified professional lifelines into a unified collegiate movement.
            </p>
          </ScrollReveal>
        </div>

        {/* =====================================================================
            2. CONNECTING TIMELINE / PROGRESSION STEPPER
            Interactive desktop stepper + mobile track connecting the 4 pillars
            ===================================================================== */}
        <div className="sticky top-20 z-30 mb-12 sm:mb-16 max-w-5xl mx-auto backdrop-blur-md bg-[#FAF9F5]/90 dark:bg-[#0B1524]/90 p-2 sm:p-3 rounded-2xl border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card">
          <div className="relative">
            {/* Animated Luminous Connective Track */}
            <div
              className="hidden md:block absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-[#DCEBF5] dark:bg-[#1E3656] -z-0"
              aria-hidden="true"
            >
              <div
                className="h-full bg-gradient-to-r from-[#159E9A] via-[#D97706] to-[#4F8FE8] transition-all duration-500 ease-out"
                style={{
                  width: `${(activePillarIndex / (CAMPAIGN_PILLARS.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* 4 Interactive Progression Step Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 relative z-10">
              {CAMPAIGN_PILLARS.map((pillar, idx) => {
                const isActive = activePillarIndex === idx;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => scrollToPillar(pillar.id, idx)}
                    aria-label={`Jump to Pillar ${pillar.number}: ${pillar.title}`}
                    className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-300 text-left cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-b from-[#EBF5FB] to-[#E1EEF6] dark:from-[#14243D] dark:to-[#0D1829] border border-[#159E9A] dark:border-teal-400 shadow-sm -translate-y-0.5'
                        : 'bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 border border-transparent text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${
                        isActive
                          ? pillar.themeStyle.accentIconBg
                          : 'bg-[#DCEBF5] dark:bg-[#1B2F4E] text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {getPillarIcon(pillar.number)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] sm:text-xs font-mono font-bold ${
                            isActive ? 'text-[#159E9A] dark:text-[#5EEAD4]' : 'text-slate-400'
                          }`}
                        >
                          {pillar.number}
                        </span>
                        <span className="hidden lg:inline text-[10px] text-slate-400">&bull;</span>
                        <span className="hidden lg:inline text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                          {pillar.kicker}
                        </span>
                      </div>
                      <p
                        className={`text-xs font-bold truncate leading-tight mt-0.5 ${
                          isActive
                            ? 'text-[#183153] dark:text-white'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {pillar.title.split('&')[0].trim()}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =====================================================================
            3. FOUR ASYMMETRICAL EDITORIAL CAMPAIGN PANELS
            Sequential spontaneous animations: elegant fade, subtle vertical slide,
            image reveal, and intentional non-overlapping editorial numeral badges
            ===================================================================== */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20">
          {/* -------------------------------------------------------------------
              PANEL 01: PILLAR 01 — AWARENESS
              Layout: Left Photo (5 cols) + Right Editorial Content (7 cols)
              ------------------------------------------------------------------- */}
          <article
            id={CAMPAIGN_PILLARS[0].id}
            aria-labelledby="pillar-01-title"
            className={`group relative rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-soft-card hover:shadow-elevated overflow-hidden ${
              revealedPillars[0]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
            style={{
              borderColor: activePillarIndex === 0 ? '#159E9A' : 'rgba(189, 229, 223, 0.8)',
            }}
          >
            {/* Subtle Tonal Card Background */}
            <div className={`absolute inset-0 ${CAMPAIGN_PILLARS[0].themeStyle.cardBg} -z-10`} />

            {/* Bounded Decorative Watermark (Strictly Isolated, Zero Overlap) */}
            <div
              className={`absolute -bottom-6 -right-4 font-serif font-bold text-9xl select-none pointer-events-none ${CAMPAIGN_PILLARS[0].themeStyle.watermarkColor} -z-5`}
              aria-hidden="true"
            >
              01
            </div>

            {/* DEDICATED EDITORIAL HEADER BAR — Clearly separates numeral from heading */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${CAMPAIGN_PILLARS[0].themeStyle.badgeBg} ${CAMPAIGN_PILLARS[0].themeStyle.badgeText} ${CAMPAIGN_PILLARS[0].themeStyle.badgeBorder}`}
                >
                  PILLAR 01 &bull; {CAMPAIGN_PILLARS[0].kicker}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                  {CAMPAIGN_PILLARS[0].domain}
                </span>
              </div>

              {/* Prominent Editorial Numeral Badge */}
              <div className="flex items-baseline gap-1.5 shrink-0 select-none">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  Pillar
                </span>
                <span
                  className={`font-serif font-bold leading-none ${CAMPAIGN_PILLARS[0].themeStyle.badgeText}`}
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
                >
                  01
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Large Campaign Photo */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-[#BDE5DF] dark:border-[#1E434D] shadow-md aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={CAMPAIGN_PILLARS[0].image}
                    alt={CAMPAIGN_PILLARS[0].imageAlt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1F33]/70 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0E1F33]/85 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-[#5EEAD4] flex items-center gap-1.5 shadow-xs">
                    <Brain className="w-3.5 h-3.5 text-[#5EEAD4]" aria-hidden="true" />
                    <span>Neuroscience &amp; Fact-Checking</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-[11px] text-slate-200 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                    Science-based education replaces stigma with clinical clarity.
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Narrative */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <h3
                    id="pillar-01-title"
                    className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#183153] dark:text-white leading-tight group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors"
                  >
                    {CAMPAIGN_PILLARS[0].title}
                  </h3>

                  <p className="mt-1 text-sm sm:text-base font-medium text-[#0F8380] dark:text-[#5EEAD4]">
                    {CAMPAIGN_PILLARS[0].tagline}
                  </p>

                  <p className="mt-4 text-sm sm:text-base text-[#334C73] dark:text-slate-300 leading-relaxed">
                    {CAMPAIGN_PILLARS[0].description}
                  </p>

                  <ul className="mt-5 space-y-2" aria-label="Key scientific takeaways">
                    {CAMPAIGN_PILLARS[0].highlights.map((highlight, hIdx) => (
                      <li
                        key={hIdx}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#183153] dark:text-slate-200"
                      >
                        <CheckCircle2
                          className="w-4 h-4 text-[#159E9A] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <blockquote className="mt-5 p-3.5 sm:p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-[#BDE5DF]/60 dark:border-[#1E434D] text-xs sm:text-sm italic text-[#334C73] dark:text-slate-300 font-serif">
                    &ldquo;{CAMPAIGN_PILLARS[0].quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-6 pt-5 border-t border-[#BDE5DF]/70 dark:border-[#1E434D] flex flex-wrap items-center gap-3">
                  <Link
                    to={CAMPAIGN_PILLARS[0].ctaLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#159E9A] hover:bg-[#0F8380] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
                  >
                    <span>{CAMPAIGN_PILLARS[0].ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {CAMPAIGN_PILLARS[0].ctaSecondaryLink && (
                    <Link
                      to={CAMPAIGN_PILLARS[0].ctaSecondaryLink}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EAF5FB]/80 dark:bg-[#14243D] hover:bg-white dark:hover:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] text-xs sm:text-sm font-semibold text-[#183153] dark:text-slate-200 transition-colors"
                    >
                      <span>{CAMPAIGN_PILLARS[0].ctaSecondaryText}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* -------------------------------------------------------------------
              PANEL 02: PILLAR 02 — CAMPUS ACTION
              Layout: Editorial Left (7 cols) + Action Photo Right (5 cols)
              ------------------------------------------------------------------- */}
          <article
            id={CAMPAIGN_PILLARS[1].id}
            aria-labelledby="pillar-02-title"
            className={`group relative rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-soft-card hover:shadow-elevated overflow-hidden ${
              revealedPillars[1]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
            style={{
              borderColor: activePillarIndex === 1 ? '#D97706' : 'rgba(232, 220, 192, 0.8)',
            }}
          >
            {/* Subtle Tonal Card Background */}
            <div className={`absolute inset-0 ${CAMPAIGN_PILLARS[1].themeStyle.cardBg} -z-10`} />

            {/* Bounded Decorative Watermark */}
            <div
              className={`absolute -bottom-6 -right-4 font-serif font-bold text-9xl select-none pointer-events-none ${CAMPAIGN_PILLARS[1].themeStyle.watermarkColor} -z-5`}
              aria-hidden="true"
            >
              02
            </div>

            {/* DEDICATED EDITORIAL HEADER BAR */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${CAMPAIGN_PILLARS[1].themeStyle.badgeBg} ${CAMPAIGN_PILLARS[1].themeStyle.badgeText} ${CAMPAIGN_PILLARS[1].themeStyle.badgeBorder}`}
                >
                  PILLAR 02 &bull; {CAMPAIGN_PILLARS[1].kicker}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                  {CAMPAIGN_PILLARS[1].domain}
                </span>
              </div>

              {/* Prominent Editorial Numeral Badge */}
              <div className="flex items-baseline gap-1.5 shrink-0 select-none">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  Pillar
                </span>
                <span
                  className={`font-serif font-bold leading-none ${CAMPAIGN_PILLARS[1].themeStyle.badgeText}`}
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
                >
                  02
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Editorial Narrative */}
              <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-between">
                <div>
                  <h3
                    id="pillar-02-title"
                    className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#183153] dark:text-white leading-tight group-hover:text-[#D97706] dark:group-hover:text-[#FBBF24] transition-colors"
                  >
                    {CAMPAIGN_PILLARS[1].title}
                  </h3>

                  <p className="mt-1 text-sm sm:text-base font-medium text-[#B45309] dark:text-[#FBBF24]">
                    {CAMPAIGN_PILLARS[1].tagline}
                  </p>

                  <p className="mt-4 text-sm sm:text-base text-[#334C73] dark:text-slate-300 leading-relaxed">
                    {CAMPAIGN_PILLARS[1].description}
                  </p>

                  <ul className="mt-5 space-y-2" aria-label="Mobilization highlights">
                    {CAMPAIGN_PILLARS[1].highlights.map((highlight, hIdx) => (
                      <li
                        key={hIdx}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#183153] dark:text-slate-200"
                      >
                        <CheckCircle2
                          className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <blockquote className="mt-5 p-3.5 sm:p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-[#E8DCC0]/60 dark:border-[#383E4C] text-xs sm:text-sm italic text-[#334C73] dark:text-slate-300 font-serif">
                    &ldquo;{CAMPAIGN_PILLARS[1].quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-6 pt-5 border-t border-[#E8DCC0]/70 dark:border-[#383E4C] flex flex-wrap items-center gap-3">
                  <Link
                    to={CAMPAIGN_PILLARS[1].ctaLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
                  >
                    <span>{CAMPAIGN_PILLARS[1].ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {CAMPAIGN_PILLARS[1].ctaSecondaryLink && (
                    <Link
                      to={CAMPAIGN_PILLARS[1].ctaSecondaryLink}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF0DE]/80 dark:bg-[#1A2333] hover:bg-white dark:hover:bg-[#222E42] border border-[#FDE68A]/70 dark:border-amber-800 text-xs sm:text-sm font-semibold text-[#183153] dark:text-slate-200 transition-colors"
                    >
                      <span>{CAMPAIGN_PILLARS[1].ctaSecondaryText}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Action Photo */}
              <div className="lg:col-span-5 order-1 lg:order-2 relative">
                <div className="relative rounded-2xl overflow-hidden border border-[#E8DCC0] dark:border-[#383E4C] shadow-md aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={CAMPAIGN_PILLARS[1].image}
                    alt={CAMPAIGN_PILLARS[1].imageAlt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1813]/70 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#1A1813]/85 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-[#FBBF24] flex items-center gap-1.5 shadow-xs">
                    <Users className="w-3.5 h-3.5 text-[#FBBF24]" aria-hidden="true" />
                    <span>NSS MJCET Chapter</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-[11px] text-slate-200 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                    Student leadership turns passive awareness into collegiate momentum.
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* -------------------------------------------------------------------
              PANEL 03: PILLAR 03 — SOLIDARITY
              Layout: Left Photo (5 cols) + Right Editorial Narrative (7 cols)
              ------------------------------------------------------------------- */}
          <article
            id={CAMPAIGN_PILLARS[2].id}
            aria-labelledby="pillar-03-title"
            className={`group relative rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-soft-card hover:shadow-elevated overflow-hidden ${
              revealedPillars[2]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
            style={{
              borderColor: activePillarIndex === 2 ? '#239B70' : 'rgba(189, 229, 206, 0.8)',
            }}
          >
            {/* Subtle Tonal Card Background */}
            <div className={`absolute inset-0 ${CAMPAIGN_PILLARS[2].themeStyle.cardBg} -z-10`} />

            {/* Bounded Decorative Watermark */}
            <div
              className={`absolute -bottom-6 -right-4 font-serif font-bold text-9xl select-none pointer-events-none ${CAMPAIGN_PILLARS[2].themeStyle.watermarkColor} -z-5`}
              aria-hidden="true"
            >
              03
            </div>

            {/* DEDICATED EDITORIAL HEADER BAR */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${CAMPAIGN_PILLARS[2].themeStyle.badgeBg} ${CAMPAIGN_PILLARS[2].themeStyle.badgeText} ${CAMPAIGN_PILLARS[2].themeStyle.badgeBorder}`}
                >
                  PILLAR 03 &bull; {CAMPAIGN_PILLARS[2].kicker}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                  {CAMPAIGN_PILLARS[2].domain}
                </span>
              </div>

              {/* Prominent Editorial Numeral Badge */}
              <div className="flex items-baseline gap-1.5 shrink-0 select-none">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  Pillar
                </span>
                <span
                  className={`font-serif font-bold leading-none ${CAMPAIGN_PILLARS[2].themeStyle.badgeText}`}
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
                >
                  03
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Community Unity Photo */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-[#BDE5CE] dark:border-[#1E4B3E] shadow-md aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={CAMPAIGN_PILLARS[2].image}
                    alt={CAMPAIGN_PILLARS[2].imageAlt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A17]/70 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0A1A17]/85 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-[#34D399] flex items-center gap-1.5 shadow-xs">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#34D399]" aria-hidden="true" />
                    <span>Active Bystander Mentorship</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-[11px] text-slate-200 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                    Standing together: compassion, active listening, and peer safety.
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Narrative */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <h3
                    id="pillar-03-title"
                    className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#183153] dark:text-white leading-tight group-hover:text-[#239B70] dark:group-hover:text-[#34D399] transition-colors"
                  >
                    {CAMPAIGN_PILLARS[2].title}
                  </h3>

                  <p className="mt-1 text-sm sm:text-base font-medium text-[#1C825E] dark:text-[#34D399]">
                    {CAMPAIGN_PILLARS[2].tagline}
                  </p>

                  <p className="mt-4 text-sm sm:text-base text-[#334C73] dark:text-slate-300 leading-relaxed">
                    {CAMPAIGN_PILLARS[2].description}
                  </p>

                  <ul className="mt-5 space-y-2" aria-label="Solidarity highlights">
                    {CAMPAIGN_PILLARS[2].highlights.map((highlight, hIdx) => (
                      <li
                        key={hIdx}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#183153] dark:text-slate-200"
                      >
                        <CheckCircle2
                          className="w-4 h-4 text-[#239B70] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <blockquote className="mt-5 p-3.5 sm:p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-[#BDE5CE]/60 dark:border-[#1E4B3E] text-xs sm:text-sm italic text-[#334C73] dark:text-slate-300 font-serif">
                    &ldquo;{CAMPAIGN_PILLARS[2].quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-6 pt-5 border-t border-[#BDE5CE]/70 dark:border-[#1E4B3E] flex flex-wrap items-center gap-3">
                  <Link
                    to={CAMPAIGN_PILLARS[2].ctaLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#239B70] hover:bg-[#1C825E] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#239B70]"
                  >
                    <span>{CAMPAIGN_PILLARS[2].ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {CAMPAIGN_PILLARS[2].ctaSecondaryLink && (
                    <a
                      href={CAMPAIGN_PILLARS[2].ctaSecondaryLink}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#EAF5FB]/80 dark:bg-[#14243D] hover:bg-white dark:hover:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] text-xs sm:text-sm font-semibold text-[#183153] dark:text-slate-200 transition-colors"
                    >
                      <span>{CAMPAIGN_PILLARS[2].ctaSecondaryText}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* -------------------------------------------------------------------
              PANEL 04: PILLAR 04 — SUPPORT BEACON
              Layout: Editorial Left (7 cols) + Support Photo Right (5 cols)
              ------------------------------------------------------------------- */}
          <article
            id={CAMPAIGN_PILLARS[3].id}
            aria-labelledby="pillar-04-title"
            className={`group relative rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-soft-card hover:shadow-elevated overflow-hidden ${
              revealedPillars[3]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8 pointer-events-none'
            }`}
            style={{
              borderColor: activePillarIndex === 3 ? '#4F8FE8' : 'rgba(188, 215, 239, 0.8)',
            }}
          >
            {/* Subtle Tonal Card Background */}
            <div className={`absolute inset-0 ${CAMPAIGN_PILLARS[3].themeStyle.cardBg} -z-10`} />

            {/* Bounded Decorative Watermark */}
            <div
              className={`absolute -bottom-6 -right-4 font-serif font-bold text-9xl select-none pointer-events-none ${CAMPAIGN_PILLARS[3].themeStyle.watermarkColor} -z-5`}
              aria-hidden="true"
            >
              04
            </div>

            {/* DEDICATED EDITORIAL HEADER BAR */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${CAMPAIGN_PILLARS[3].themeStyle.badgeBg} ${CAMPAIGN_PILLARS[3].themeStyle.badgeText} ${CAMPAIGN_PILLARS[3].themeStyle.badgeBorder}`}
                >
                  PILLAR 04 &bull; {CAMPAIGN_PILLARS[3].kicker}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                  {CAMPAIGN_PILLARS[3].domain}
                </span>
              </div>

              {/* Prominent Editorial Numeral Badge */}
              <div className="flex items-baseline gap-1.5 shrink-0 select-none">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold">
                  Pillar
                </span>
                <span
                  className={`font-serif font-bold leading-none ${CAMPAIGN_PILLARS[3].themeStyle.badgeText}`}
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
                >
                  04
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Editorial Narrative */}
              <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col justify-between">
                <div>
                  <h3
                    id="pillar-04-title"
                    className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#183153] dark:text-white leading-tight group-hover:text-[#4F8FE8] dark:group-hover:text-[#95C2FA] transition-colors"
                  >
                    {CAMPAIGN_PILLARS[3].title}
                  </h3>

                  <p className="mt-1 text-sm sm:text-base font-medium text-[#2E68B8] dark:text-[#95C2FA]">
                    {CAMPAIGN_PILLARS[3].tagline}
                  </p>

                  <p className="mt-4 text-sm sm:text-base text-[#334C73] dark:text-slate-300 leading-relaxed">
                    {CAMPAIGN_PILLARS[3].description}
                  </p>

                  {/* Helplines Interactive Callout Box */}
                  <div className="mt-5 p-4 rounded-2xl bg-white/60 dark:bg-[#112036]/90 border border-[#BCD7EF] dark:border-[#223E66] shadow-2xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#183153] dark:text-white uppercase tracking-wider mb-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#239B70]" aria-hidden="true" />
                      <span>Verified National 24/7 Helplines (Toll-Free &bull; 100% Confidential)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <a
                        href="tel:14446"
                        className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#DDF3F0] to-[#EAF5FB] dark:from-teal-950/60 dark:to-[#172B48] border border-[#99F6E4] dark:border-teal-800 text-[#183153] dark:text-white hover:border-[#159E9A] transition-all group/call"
                      >
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-4 h-4 text-[#159E9A] group-hover/call:scale-110 transition-transform" />
                          <div>
                            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              Tele-MANAS
                            </div>
                            <div className="font-mono text-base font-bold text-[#159E9A] dark:text-[#5EEAD4]">
                              14446
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#159E9A] dark:text-[#5EEAD4]">
                          Call Now &rarr;
                        </span>
                      </a>

                      <a
                        href="tel:14416"
                        className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#FAF0DE] to-[#EAF5FB] dark:from-amber-950/60 dark:to-[#172B48] border border-[#FDE68A] dark:border-amber-800 text-[#183153] dark:text-white hover:border-[#D97706] transition-all group/call"
                      >
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-4 h-4 text-[#D97706] group-hover/call:scale-110 transition-transform" />
                          <div>
                            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              NMBA Helpline
                            </div>
                            <div className="font-mono text-base font-bold text-[#D97706] dark:text-[#FBBF24]">
                              14416
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-[#D97706] dark:text-[#FBBF24]">
                          Call Now &rarr;
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-[#BCD7EF]/70 dark:border-[#223E66] flex flex-wrap items-center gap-3">
                  <Link
                    to={CAMPAIGN_PILLARS[3].ctaLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F8FE8] hover:bg-[#3B74CC] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F8FE8]"
                  >
                    <span>{CAMPAIGN_PILLARS[3].ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Support Photo */}
              <div className="lg:col-span-5 order-1 lg:order-2 relative">
                <div className="relative rounded-2xl overflow-hidden border border-[#BCD7EF] dark:border-[#223E66] shadow-md aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={CAMPAIGN_PILLARS[3].image}
                    alt={CAMPAIGN_PILLARS[3].imageAlt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1D33]/70 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#0E1D33]/85 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-[#95C2FA] flex items-center gap-1.5 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#95C2FA]" aria-hidden="true" />
                    <span>Zero Penalty &bull; 100% Confidential</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-[11px] text-slate-200 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                    Professional, non-judgmental counseling available anytime for students.
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
};
