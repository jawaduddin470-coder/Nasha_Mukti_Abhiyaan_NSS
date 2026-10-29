import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Phone,
  Compass,
  Heart,
  MessageSquare,
  BookOpen,
  Calendar,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Container } from '../components/common/Container';
import { SectionHeader } from '../components/common/SectionHeader';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  AWARENESS_PILLARS,
  MYTHS_VS_FACTS,
  WARNING_SIGNS,
  INTERACTIVE_SCENARIOS,
  SELF_SUPPORT_STEPS,
  PEER_SUPPORT_GUIDELINES,
} from '../data/awarenessData';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const AwarenessPage: React.FC = () => {
  // Stage A: Active Pillar Tab
  const [activePillarTab, setActivePillarTab] = useState<string>(AWARENESS_PILLARS[0].id);

  // Stage C: Active Scenario & Selected Option
  const [activeScenarioId, setActiveScenarioId] = useState<string>(INTERACTIVE_SCENARIOS[0].id);
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    INTERACTIVE_SCENARIOS[0].options[1].id // Default to the recommended constructive choice
  );

  // Stage D: Support Mode Toggle ('self' | 'peer')
  const [supportMode, setSupportMode] = useState<'self' | 'peer'>('self');

  const selectedPillar =
    AWARENESS_PILLARS.find((p) => p.id === activePillarTab) || AWARENESS_PILLARS[0];

  const currentScenario =
    INTERACTIVE_SCENARIOS.find((s) => s.id === activeScenarioId) || INTERACTIVE_SCENARIOS[0];

  const activeOption =
    currentScenario.options.find((o) => o.id === selectedOptionId) || currentScenario.options[0];

  const scrollToStage = (stageId: string) => {
    const el = document.getElementById(stageId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const STAGES = [
    { id: 'stage-understand', label: 'A. Understand', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: 'stage-recognise', label: 'B. Recognise', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { id: 'stage-choose', label: 'C. Choose', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'stage-support', label: 'D. Support', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'stage-continue', label: 'E. Continue', icon: <ArrowRight className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="py-12 sm:py-20 bg-[#EAF6FC]/50 dark:bg-[#0B1524] transition-colors duration-200 relative overflow-hidden">
      {/* Coherent Atmospheric Background with flowing ribbons and authentic watermark */}
      <AtmosphericBackground
        variant="page-header"
        showWatermark
        watermarkPosition="top-right"
        showRibbons
      />

      <Container size="wide" className="relative z-10">
        {/* Page Header */}
        <ScrollReveal direction="up" delayMs={40}>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5FB]/90 dark:bg-[#14243D] border border-[#CFE3F0] dark:border-[#243A5E] text-xs text-[#0F8380] dark:text-[#5EEAD4] font-semibold mb-4 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#159E9A]" aria-hidden="true" />
              <span>Interactive Campaign Journey &bull; Five Educational Stages</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#183153] dark:text-white tracking-tight leading-[1.15]">
              Awareness &amp; Prevention Intelligence
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#334C73] dark:text-slate-300 leading-relaxed font-normal">
              Grounded in neurobiology, behavioral science, and non-judgmental guidance. Understanding chemical dependency removes shame, empowers conscious decisions, and illuminates the road to lasting health.
            </p>
          </div>
        </ScrollReveal>

        {/* =========================================================================
            STAGE NAVIGATOR: EDITORIAL ROADMAP
            ========================================================================= */}
        <div className="sticky top-20 z-30 mb-14 py-2.5 px-3 rounded-2xl bg-[#EAF5FB]/95 dark:bg-[#14243D]/95 backdrop-blur-md border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
            {STAGES.map((stage) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => scrollToStage(stage.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#183153] dark:text-slate-300 hover:text-[#159E9A] dark:hover:text-[#5EEAD4] hover:bg-[#DCEBF5] dark:hover:bg-[#1B2F4E] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
              >
                <span className="text-[#159E9A] dark:text-[#5EEAD4]">{stage.icon}</span>
                <span>{stage.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            STAGE A: UNDERSTAND — THE NEUROBIOLOGY OF DEPENDENCY
            ========================================================================= */}
        <section id="stage-understand" className="pt-6 pb-16 scroll-mt-28" aria-labelledby="heading-understand">
          <ScrollReveal direction="up" delayMs={50}>
            <SectionHeader
              kicker="Stage A: Understand"
              kickerVariant="teal"
              title="The Neurobiology of Chemical Dependency"
              subtitle="Chemical dependence is a physiological condition altering reward receptors, impulse governance, and memory circuits. Removing moralizing stigma is the first step toward effective health."
              headingLevel="h2"
            />
          </ScrollReveal>

          {/* Pillar Selector Tabs */}
          <div
            className="flex flex-wrap gap-2.5 pb-4 border-b border-[#CFE3F0] dark:border-[#243A5E] mt-8"
            role="tablist"
            aria-label="Scientific Understanding Topics"
          >
            {AWARENESS_PILLARS.map((pillar) => {
              const isSelected = activePillarTab === pillar.id;
              return (
                <button
                  key={pillar.id}
                  id={`tab-${pillar.id}`}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-${pillar.id}`}
                  onClick={() => setActivePillarTab(pillar.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[44px] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] cursor-pointer ${
                    isSelected
                      ? 'bg-[#159E9A] text-white shadow-teal-subtle border border-[#159E9A]'
                      : 'bg-[#EAF5FB] dark:bg-[#14243D] text-[#183153] dark:text-slate-300 hover:text-[#0F8380] dark:hover:text-white hover:bg-[#DDF3F0] dark:hover:bg-[#172B48] border border-[#CFE3F0] dark:border-[#243A5E] shadow-2xs'
                  }`}
                >
                  <Brain className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{pillar.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Card */}
          <div
            id={`panel-${selectedPillar.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${selectedPillar.id}`}
            className="mt-8 rounded-2xl border border-[#D7E7F0] dark:border-[#243A5E] bg-gradient-to-br from-white to-[#F8FBFE] dark:from-[#14243D] dark:to-[#112036] p-6 sm:p-10 shadow-soft-card relative overflow-hidden transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2.5 mb-3">
                  <Badge variant="teal">{selectedPillar.shortTag}</Badge>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider font-mono">
                    Scientific Deep-Dive
                  </span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#183153] dark:text-white leading-tight">
                  {selectedPillar.title}
                </h3>
                <p className="mt-2 text-base text-[#159E9A] dark:text-[#5EEAD4] font-medium">
                  {selectedPillar.tagline}
                </p>

                <p className="mt-4 text-[#334C73] dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                  {selectedPillar.summary}
                </p>

                <div className="mt-8 space-y-3.5">
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
                    Scientific Insights &amp; Neural Mechanics:
                  </p>
                  {selectedPillar.detailedPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm text-[#183153] dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#239B70] dark:text-[#34D399] shrink-0 mt-0.5" aria-hidden="true" />
                      <p className="leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Takeaway Highlight Callout */}
              <div className="lg:w-80 shrink-0 rounded-2xl bg-[#F0F7FB] dark:bg-[#112036] border border-[#B9DDF5] dark:border-[#243A5E] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#0F8380] dark:text-[#5EEAD4] uppercase tracking-wider mb-2 font-mono">
                    <Sparkles className="w-4 h-4 text-[#159E9A]" aria-hidden="true" />
                    Key Takeaway
                  </div>
                  <blockquote className="font-serif text-base font-bold text-[#183153] dark:text-white italic leading-snug">
                    &ldquo;{selectedPillar.keyTakeaway}&rdquo;
                  </blockquote>
                  <p className="mt-4 text-xs text-[#334C73] dark:text-slate-300 leading-relaxed">
                    NSS MJCET peer ambassadors and university counselors are dedicated to confidential guidance without punitive retribution.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#CFE3F0] dark:border-[#243A5E]">
                  <Button
                    to="/support"
                    variant="teal"
                    size="sm"
                    className="w-full text-xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
                  >
                    Confidential Support Pathways
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            STAGE B: RECOGNISE — CAMPUS MYTHS & NON-JUDGMENTAL OBSERVATION
            ========================================================================= */}
        <section id="stage-recognise" className="py-16 border-t border-[#D7E7F0] dark:border-[#243A5E] scroll-mt-28" aria-labelledby="heading-recognise">
          <ScrollReveal direction="up" delayMs={50}>
            <SectionHeader
              kicker="Stage B: Recognise"
              kickerVariant="blue"
              kickerIcon={<HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />}
              title="Recognising Misconceptions &amp; Early Indicators"
              subtitle="Stigma flourishes in whispers. Grounding conversations in clinical realities dismantles false assumptions and enables empathetic peer observation."
              headingLevel="h2"
            />
          </ScrollReveal>

          {/* Myths vs Facts Grid */}
          <div className="mt-10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-5 font-mono">
              Part 1: Debunking Collegiate Assumptions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MYTHS_VS_FACTS.map((item) => (
                <div
                  key={item.id}
                  className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <span className="px-2.5 py-1 rounded-md bg-[#FEF2F2] dark:bg-red-950/60 border border-[#FECACA] dark:border-red-800 text-[#991B1B] dark:text-[#FCA5A5] font-bold text-xs uppercase tracking-wider shrink-0 font-mono">
                        Myth
                      </span>
                      <p className="text-sm font-semibold text-[#183153] dark:text-white italic leading-snug">
                        {item.myth}
                      </p>
                    </div>

                    <div className="flex items-start gap-3 mt-4 pt-4 border-t border-[#CFE3F0] dark:border-[#243A5E]">
                      <span className="px-2.5 py-1 rounded-md bg-[#ECFDF5] dark:bg-emerald-950/60 border border-[#A7F3D0] dark:border-emerald-800 text-[#166534] dark:text-[#86EFAC] font-bold text-xs uppercase tracking-wider shrink-0 font-mono">
                        Fact
                      </span>
                      <div>
                        <p className="text-sm text-[#183153] dark:text-slate-200 font-medium leading-relaxed">
                          {item.fact}
                        </p>
                        <p className="mt-2 text-xs text-[#334C73] dark:text-slate-400 leading-relaxed">
                          {item.clinicalContext}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Signs Grid */}
          <div className="mt-14">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-5 font-mono">
              Part 2: Non-Judgmental Observation Without Stigma
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WARNING_SIGNS.map((group, index) => (
                <div
                  key={index}
                  className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ShieldCheck className="w-5 h-5 text-[#159E9A] dark:text-[#5EEAD4] shrink-0" aria-hidden="true" />
                      <h4 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
                        {group.category}
                      </h4>
                    </div>

                    <ul className="space-y-2.5 text-xs text-[#334C73] dark:text-slate-300">
                      {group.signs.map((sign, signIndex) => (
                        <li key={signIndex} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#159E9A] shrink-0 mt-1.5" />
                          <span className="leading-relaxed">{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#CFE3F0] dark:border-[#243A5E] bg-[#DCEBF5]/80 dark:bg-[#112036] -mx-6 -mb-6 p-5 rounded-b-2xl">
                    <p className="text-[11px] uppercase tracking-wider font-bold text-[#0F8380] dark:text-[#5EEAD4] mb-1 font-mono">
                      Recommended Response
                    </p>
                    <p className="text-xs text-[#183153] dark:text-slate-300 leading-relaxed">
                      {group.recommendedResponse}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            STAGE C: CHOOSE — INTERACTIVE DECISION SCENARIO SIMULATOR
            ========================================================================= */}
        <section id="stage-choose" className="py-16 border-t border-[#CFE3F0] dark:border-[#243A5E] scroll-mt-28" aria-labelledby="heading-choose">
          <ScrollReveal direction="up" delayMs={50}>
            <SectionHeader
              kicker="Stage C: Choose"
              kickerVariant="teal"
              kickerIcon={<Compass className="w-3.5 h-3.5" aria-hidden="true" />}
              title="Interactive Decision Scenarios: Exploring Agency"
              subtitle="Test realistic collegiate pressure dilemmas. Discover practical, non-awkward spoken exit scripts and sustainable alternatives to chemical coping."
              headingLevel="h2"
            />
          </ScrollReveal>

          {/* Scenario Tab Selector */}
          <div className="mt-8 flex flex-wrap gap-2.5 pb-4 border-b border-[#CFE3F0] dark:border-[#243A5E]">
            {INTERACTIVE_SCENARIOS.map((scen, idx) => {
              const isSelected = activeScenarioId === scen.id;
              return (
                <button
                  key={scen.id}
                  type="button"
                  data-cursor="SCENARIO"
                  onClick={() => {
                    setActiveScenarioId(scen.id);
                    const constructiveOpt = scen.options.find((o) => o.isConstructive) || scen.options[0];
                    setSelectedOptionId(constructiveOpt.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[44px] flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                    isSelected
                      ? 'bg-[#159E9A] text-white shadow-teal-subtle border border-[#159E9A]'
                      : 'bg-[#EAF5FB] dark:bg-[#14243D] text-[#183153] dark:text-slate-300 hover:text-[#0F8380] dark:hover:text-white hover:bg-[#DDF3F0] dark:hover:bg-[#172B48] border border-[#CFE3F0] dark:border-[#243A5E] shadow-2xs'
                  }`}
                >
                  <span className="font-mono text-xs opacity-80">0{idx + 1}.</span>
                  <span>{scen.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Scenario Card & Decision Engine */}
          <div className="mt-8 rounded-3xl bg-gradient-to-br from-[#EAF5FB] to-[#F4FAFD] dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] p-6 sm:p-10 shadow-soft-card">
            {/* Scenario Header */}
            <div className="max-w-3xl mb-8">
              <div className="flex items-center gap-2.5 mb-2.5">
                <Badge variant="teal">{currentScenario.tag}</Badge>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Collegiate Scenario
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#183153] dark:text-white">
                {currentScenario.title}
              </h3>
              <div className="mt-3.5 p-4 rounded-xl bg-[#F0F7FB] dark:bg-[#112036] border border-[#B9DDF5] dark:border-[#243A5E] text-sm text-[#183153] dark:text-slate-200 leading-relaxed italic">
                &ldquo;{currentScenario.situation}&rdquo;
              </div>
            </div>

            {/* Split Screen: Choices on Left, Consequence & Script Analysis on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Choices */}
              <div className="lg:col-span-5 space-y-3">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Select a Response Pathway:
                </p>
                {currentScenario.options.map((opt) => {
                  const isOptSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                        isOptSelected
                          ? opt.isConstructive
                            ? 'bg-[#DDF0E6] dark:bg-emerald-950/40 border-[#239B70] text-[#183153] dark:text-white shadow-sm ring-1 ring-[#239B70]'
                            : 'bg-[#FEE2E2] dark:bg-red-950/40 border-red-400 text-[#183153] dark:text-white shadow-sm ring-1 ring-red-400'
                          : 'bg-[#DCEBF5]/40 dark:bg-[#112036] border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#DDF3F0] dark:hover:bg-[#14243D] text-[#334C73] dark:text-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                          isOptSelected
                            ? opt.isConstructive
                              ? 'bg-[#239B70] text-white border-[#239B70]'
                              : 'bg-red-500 text-white border-red-500'
                            : 'border-slate-400 dark:border-slate-500'
                        }`}
                      >
                        {isOptSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex-1">
                        <span className="text-sm font-semibold block leading-tight">
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                          {opt.isConstructive ? 'Constructive Empowerment' : 'Compromised Boundary'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Dynamic Analysis & Script Box */}
              <div className="lg:col-span-7 rounded-2xl bg-[#EAF5FB]/70 dark:bg-[#112036] border border-[#CFE3F0] dark:border-[#243A5E] p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono tracking-wider uppercase ${
                      activeOption.isConstructive
                        ? 'bg-[#ECFDF5] dark:bg-emerald-950 text-[#166534] dark:text-[#86EFAC] border border-[#A7F3D0] dark:border-emerald-800'
                        : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800'
                    }`}
                  >
                    {activeOption.isConstructive ? 'Constructive Outcome' : 'Compromised Outcome'}
                  </span>
                </div>

                <h4 className="font-serif text-xl font-bold text-[#183153] dark:text-white">
                  {activeOption.responseTitle}
                </h4>

                <p className="mt-3 text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                  {activeOption.analysis}
                </p>

                {/* Practical Spoken Exit Script (if available) */}
                {activeOption.practicalScript && (
                  <div className="mt-5 p-4 rounded-xl bg-[#EAF5FB] dark:bg-[#14243D] border border-[#CFE3F0] dark:border-[#243A5E]">
                    <p className="text-[11px] font-mono uppercase font-bold text-[#0F8380] dark:text-[#5EEAD4] flex items-center gap-1.5 mb-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#159E9A]" />
                      Suggested Spoken Exit Script:
                    </p>
                    <p className="text-sm font-medium text-[#183153] dark:text-white font-serif italic">
                      {activeOption.practicalScript}
                    </p>
                  </div>
                )}

                {/* Science-Backed Dopamine Alternative */}
                <div className="mt-5 pt-4 border-t border-[#CFE3F0] dark:border-[#243A5E] text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong className="text-[#183153] dark:text-white">Sustainable Alternative:</strong>{' '}
                  {activeOption.healthyAlternative}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            STAGE D: SUPPORT — DIGNIFIED CARE PATHWAYS & ACTIVE LISTENING
            ========================================================================= */}
        <section id="stage-support" className="py-16 border-t border-[#CFE3F0] dark:border-[#243A5E] scroll-mt-28" aria-labelledby="heading-support">
          <ScrollReveal direction="up" delayMs={50}>
            <SectionHeader
              kicker="Stage D: Support"
              kickerVariant="emerald"
              kickerIcon={<Heart className="w-3.5 h-3.5" aria-hidden="true" />}
              title="Dignified Action: Seeking &amp; Offering Help"
              subtitle="Reaching out requires self-awareness, not desperation. Here are concrete protocols for seeking guidance for yourself and supporting a peer with empathy."
              headingLevel="h2"
            />
          </ScrollReveal>

          {/* Support Mode Toggle */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex p-1.5 rounded-2xl bg-[#EAF5FB] dark:bg-[#14243D] border border-[#CFE3F0] dark:border-[#243A5E] shadow-xs">
              <button
                type="button"
                onClick={() => setSupportMode('self')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  supportMode === 'self'
                    ? 'bg-[#159E9A] text-white shadow-teal-subtle'
                    : 'text-[#183153] dark:text-slate-400 hover:text-[#0F8380] dark:hover:text-white'
                }`}
              >
                Seeking Help For Yourself
              </button>
              <button
                type="button"
                onClick={() => setSupportMode('peer')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  supportMode === 'peer'
                    ? 'bg-[#159E9A] text-white shadow-teal-subtle'
                    : 'text-[#183153] dark:text-slate-400 hover:text-[#0F8380] dark:hover:text-white'
                }`}
              >
                Supporting a Peer Respectfully
              </button>
            </div>
          </div>

          {/* Conditional Support Cards */}
          {supportMode === 'self' ? (
            /* Mode 1: Self-Support Steps */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {SELF_SUPPORT_STEPS.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#DDF3F0] dark:bg-teal-950/50 border border-[#99F6E4] dark:border-teal-800 flex items-center justify-center text-[#159E9A] dark:text-[#5EEAD4] mb-4 font-mono font-bold text-sm">
                      {step.stepNumber}
                    </div>
                    <h4 className="font-serif text-xl font-bold text-[#183153] dark:text-white">
                      {step.title}
                    </h4>
                    <p className="mt-3 text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#CFE3F0] dark:border-[#243A5E] text-xs text-[#0F8380] dark:text-[#5EEAD4] font-medium">
                    &bull; {step.keyTip}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Mode 2: Peer Support Guidelines with Dialogue Starters */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {PEER_SUPPORT_GUIDELINES.map((item, idx) => (
                <div
                  key={idx}
                  className="p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-[#DDF0E6] dark:bg-emerald-950/60 text-[#166534] dark:text-[#86EFAC] flex items-center justify-center font-mono font-bold text-xs">
                        {idx + 1}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
                        {item.principle}
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed mb-4">
                      {item.guidance}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#DCEBF5]/80 dark:bg-[#112036] border border-[#CFE3F0] dark:border-[#243A5E]">
                    <p className="text-[11px] font-mono uppercase font-bold text-[#0F8380] dark:text-[#5EEAD4] mb-1">
                      Respectful Dialogue Starter:
                    </p>
                    <p className="text-xs text-[#183153] dark:text-slate-200 italic font-serif">
                      {item.dialogueStarter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =========================================================================
            STAGE E: CONTINUE — EXTENDED ACTION PATHWAYS & VERIFIED RESOURCES
            ========================================================================= */}
        <section id="stage-continue" className="py-16 border-t border-[#CFE3F0] dark:border-[#243A5E] scroll-mt-28" aria-labelledby="heading-continue">
          <ScrollReveal direction="up" delayMs={50}>
            <SectionHeader
              kicker="Stage E: Continue"
              kickerVariant="blue"
              kickerIcon={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
              title="Sustaining the Movement: Action Pathways"
              subtitle="Awareness becomes cultural resilience through active participation. Connect directly with campus initiatives, event drives, and accredited national care networks."
              headingLevel="h2"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* Pathway 1: Events */}
            <div className="p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#DDF3F0] dark:bg-teal-950/50 border border-[#99F6E4] dark:border-teal-800 flex items-center justify-center text-[#159E9A] dark:text-[#5EEAD4] mb-4">
                  <Calendar className="w-5 h-5" aria-hidden="true" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#183153] dark:text-white">
                  Join Campus Action Drives
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                  Participate in upcoming student rallies, expert psychological workshops, and youth-led awareness drives on campus.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#CFE3F0] dark:border-[#243A5E]">
                <Button
                  to="/activities"
                  variant="teal"
                  size="sm"
                  className="w-full text-xs"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
                >
                  Explore Campus Activities
                </Button>
              </div>
            </div>

            {/* Pathway 2: Helplines */}
            <div className="p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#DDF0E6] dark:bg-emerald-950/50 border border-[#BBF7D0] dark:border-emerald-800 flex items-center justify-center text-[#239B70] dark:text-[#34D399] mb-4">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#183153] dark:text-white">
                  Verified National Helplines
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                  Toll-free 24/7 direct dial access to certified medical counselors and mental health psychologists: <strong className="font-mono text-[#183153] dark:text-white">14446</strong> and <strong className="font-mono text-[#183153] dark:text-white">14416</strong>.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#CFE3F0] dark:border-[#243A5E]">
                <Button
                  to="/support"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs bg-[#EAF5FB] dark:bg-[#112036] dark:text-white border-[#CFE3F0] dark:border-[#243A5E]"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />}
                >
                  Access All Helplines
                </Button>
              </div>
            </div>

            {/* Pathway 3: Official NSS MJCET Portal */}
            <div className="p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#F0F7FB] dark:bg-[#112036] border border-[#B9DDF5] dark:border-[#243A5E] flex items-center justify-center text-[#4F8FE8] dark:text-[#80B3F4] mb-4">
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#183153] dark:text-white">
                  NSS MJCET Chapter
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                  Discover youth volunteering opportunities, community service activities, and official updates from the NSS units at MJCET.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#CFE3F0] dark:border-[#243A5E]">
                <a
                  href="https://www.nssmjcet.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#EAF5FB] dark:bg-[#112036] hover:bg-[#DDF3F0] dark:hover:bg-[#172B48] text-xs font-semibold text-[#183153] dark:text-slate-200 border border-[#CFE3F0] dark:border-[#243A5E] transition-colors min-h-[38px]"
                >
                  <span>Visit nssmjcet.in</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};
