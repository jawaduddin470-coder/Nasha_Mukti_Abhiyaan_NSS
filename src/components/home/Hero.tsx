import React from 'react';
import { ChevronRight, Calendar, PhoneCall, ShieldCheck, HeartPulse, Compass } from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { ScrollReveal } from '../common/ScrollReveal';

interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section className="relative pt-6 pb-16 sm:pt-12 sm:pb-24 overflow-hidden" aria-labelledby="hero-heading">
      {/* Dynamic Layered Atmospheric Background with Flowing Ribbons & Institutional Watermark */}
      <AtmosphericBackground variant="hero" showWatermark watermarkPosition="top-right" showRibbons />

      <Container size="wide" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Editorial Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <ScrollReveal direction="up" delayMs={30}>
              {/* Institutional Unit Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5FB]/90 dark:bg-[#14243D] border border-[#CFE3F0] dark:border-[#243A5E] text-xs text-[#183153] dark:text-slate-200 mb-5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#239B70]" aria-hidden="true" />
                <span className="font-bold text-[#183153] dark:text-white">NSS MJCET</span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-[#334C73] dark:text-slate-300 font-medium">Osmania University</span>
              </div>

              {/* Expressive Editorial Headline */}
              <h1
                id="hero-heading"
                className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-[#183153] dark:text-white tracking-tight leading-[1.14]"
              >
                Every choice <br />
                shapes a{' '}
                <span className="italic text-[#159E9A] dark:text-[#5EEAD4] font-serif font-normal">
                  future.
                </span>
              </h1>

              {/* Concise Supporting Description */}
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-[#334C73] dark:text-slate-300 leading-relaxed max-w-xl font-normal">
                Awareness begins with understanding. An institutional initiative by the National Service Scheme Unit of Muffakham Jah College of Engineering &amp; Technology, fostering informed decisions, resilient campus culture, and confidential support.
              </p>

              {/* Call To Actions */}
              <div className="mt-7 flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <Button
                  href="#campaign-journey"
                  variant="teal"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<ChevronRight className="w-4 h-4" aria-hidden="true" />}
                >
                  Explore Campaign Journey
                </Button>

                <Button
                  to="/activities"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  leftIcon={<Calendar className="w-4 h-4 text-[#159E9A]" aria-hidden="true" />}
                >
                  Campus Activities
                </Button>

                <Button
                  to="/support"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-[#EAF5FB]/90 dark:bg-[#14243D] dark:text-slate-200 border-[#CFE3F0] dark:border-[#243A5E]"
                  leftIcon={<PhoneCall className="w-4 h-4 text-[#239B70]" aria-hidden="true" />}
                >
                  Verified Helplines
                </Button>
              </div>

              {/* Value Indicators */}
              <div className="mt-8 pt-6 border-t border-[#CFE3F0] dark:border-[#243A5E] w-full flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#4F678A] dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#239B70]" aria-hidden="true" />
                  Confidential Guidance
                </span>
                <span className="text-[#CFE3F0] dark:text-[#243A5E]">&bull;</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <HeartPulse className="w-4 h-4 text-[#159E9A]" aria-hidden="true" />
                  Science-Based Education
                </span>
                <span className="text-[#CFE3F0] dark:text-[#243A5E]">&bull;</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Compass className="w-4 h-4 text-[#4F8FE8]" aria-hidden="true" />
                  Student-Led Culture
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Editorial Campaign Visual Anchor (Zero 3D, Pure Institutional Caliber) */}
          <div className="lg:col-span-6 w-full relative">
            {/* Soft Ambient Spotlight Glow Behind Editorial Visual */}
            <div
              className="absolute -inset-4 sm:-inset-8 rounded-3xl blur-2xl opacity-65 dark:opacity-35 pointer-events-none -z-10"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(185, 221, 245, 0.65) 0%, rgba(21, 158, 154, 0.15) 45%, transparent 75%)',
              }}
            />

            <ScrollReveal direction="up" delayMs={60}>
              <div className="relative rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-[#EBF5FB]/90 via-[#F3F9FD]/80 to-[#E1EEF6]/90 dark:from-[#14243D] dark:via-[#101D33] dark:to-[#0D1829] border border-[#CFE3F0] dark:border-[#243A5E] shadow-elevated overflow-hidden group">
                {/* Main Featured Editorial Photography Frame */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] border border-[#BDE5DF]/60 dark:border-[#1E434D]">
                  <img
                    src="/assets/campaign/pillar-02-campus-action.jpg"
                    alt="NSS MJCET student advocates participating in campaign outreach"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1D33]/85 via-[#0E1D33]/25 to-transparent pointer-events-none" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1D33]/85 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#5EEAD4] shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#159E9A] animate-pulse" aria-hidden="true" />
                      NSS MJCET &bull; Active Unit
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] text-slate-200">
                      Chapter 2024–25
                    </span>
                  </div>

                  {/* Inset Bottom Editorial Card */}
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 sm:p-4 rounded-xl bg-[#0E1D33]/90 backdrop-blur-md border border-white/15 text-white shadow-lg">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-[#5EEAD4] uppercase tracking-wider">
                        From Awareness to Action
                      </span>
                      <a
                        href="#campaign-journey"
                        className="text-[11px] font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1 transition-colors group/link"
                      >
                        <span>Explore Journey</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 font-serif italic line-clamp-1 sm:line-clamp-none">
                      &ldquo;Four pillars. One collective mission. A healthier tomorrow.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Bottom Quick-Action Mini Grid Linking to the 4 Pillars */}
                <div className="mt-3.5 pt-3 border-t border-[#CFE3F0] dark:border-[#243A5E] grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <a
                    href="#pillar-01"
                    className="p-2 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-[#159E9A] text-left transition-all group/item"
                  >
                    <span className="block text-[10px] font-mono font-bold text-[#159E9A] dark:text-[#5EEAD4]">
                      01 &bull; Awareness
                    </span>
                    <span className="block text-xs font-semibold text-[#183153] dark:text-white truncate">
                      Neuroscience
                    </span>
                  </a>

                  <a
                    href="#pillar-02"
                    className="p-2 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-[#D97706] text-left transition-all group/item"
                  >
                    <span className="block text-[10px] font-mono font-bold text-[#D97706] dark:text-[#FBBF24]">
                      02 &bull; Action
                    </span>
                    <span className="block text-xs font-semibold text-[#183153] dark:text-white truncate">
                      Campus Drives
                    </span>
                  </a>

                  <a
                    href="#pillar-03"
                    className="p-2 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-[#239B70] text-left transition-all group/item"
                  >
                    <span className="block text-[10px] font-mono font-bold text-[#239B70] dark:text-[#34D399]">
                      03 &bull; Solidarity
                    </span>
                    <span className="block text-xs font-semibold text-[#183153] dark:text-white truncate">
                      Peer Circle
                    </span>
                  </a>

                  <a
                    href="#pillar-04"
                    className="p-2 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-[#4F8FE8] text-left transition-all group/item"
                  >
                    <span className="block text-[10px] font-mono font-bold text-[#4F8FE8] dark:text-[#95C2FA]">
                      04 &bull; Lifeline
                    </span>
                    <span className="block text-xs font-semibold text-[#183153] dark:text-white truncate">
                      24/7 Helplines
                    </span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* =====================================================================
            PHASE 5.8: LARGE, DYNAMIC & PREMIUM INSTITUTIONAL LOGO SHOWCASE
            Spacious 3-plus-2 desktop composition with prominent 120-144px logos
            ===================================================================== */}
        <section
          aria-labelledby="institutional-affiliations-heading"
          className="mt-16 pt-12 border-t border-[#CFE3F0] dark:border-[#243A5E]"
        >
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF5FB]/90 dark:bg-[#14243D] border border-[#CFE3F0] dark:border-[#243A5E] text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#159E9A] animate-pulse" aria-hidden="true" />
              <span>VERIFIED INSTITUTIONAL FRAMEWORK</span>
            </div>
            <h3
              id="institutional-affiliations-heading"
              className="text-2xl sm:text-3xl font-serif font-bold text-[#183153] dark:text-white tracking-tight"
            >
              Official Campaign Affiliations &amp; Institutional Backing
            </h3>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Unified collegiate substance awareness under the auspices of the Government of India, Osmania University, and the Sultan-ul-Uloom Education Society.
            </p>
          </div>

          {/* Spacious 3-Plus-2 Dynamic Card Composition */}
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6 lg:gap-7 max-w-6xl mx-auto">
            {/* 1. NSS India */}
            <div
              tabIndex={0}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-19px)] max-w-[340px] flex flex-col items-center text-center justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#EBF5FB] via-[#F3F9FD] to-[#E1EEF6] dark:from-[#14243D] dark:via-[#101D33] dark:to-[#0D1829] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card dark:shadow-dark-soft hover:-translate-y-2 hover:border-[#159E9A] dark:hover:border-teal-400 hover:shadow-[0_20px_40px_rgba(21,158,154,0.18)] dark:hover:shadow-[0_20px_40px_rgba(21,158,154,0.12)] transition-all duration-300 cursor-default group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDF3F0] dark:bg-teal-950/60 text-[#159E9A] dark:text-[#5EEAD4] border border-[#99F6E4]/70 dark:border-teal-800 mb-4">
                Youth Affairs &amp; Sports
              </span>
              <div className="w-full h-32 sm:h-36 flex items-center justify-center p-3.5 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-xs border border-white/80 dark:border-white/10 shadow-xs mb-4 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <img
                  src="/assets/branding/nss-logo.png"
                  alt="National Service Scheme Official Seal"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                  loading="lazy"
                />
              </div>
              <div className="mt-auto">
                <h4 className="text-base sm:text-lg font-bold font-serif text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors leading-snug">
                  NSS India
                </h4>
                <p className="text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] mt-0.5">
                  National Service Scheme
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-2">
                  Ministry of Youth Affairs &amp; Sports, Government of India
                </p>
              </div>
            </div>

            {/* 2. Nasha Mukt Bharat */}
            <div
              tabIndex={0}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-19px)] max-w-[340px] flex flex-col items-center text-center justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#EBF5FB] via-[#F3F9FD] to-[#E1EEF6] dark:from-[#14243D] dark:via-[#101D33] dark:to-[#0D1829] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card dark:shadow-dark-soft hover:-translate-y-2 hover:border-[#159E9A] dark:hover:border-teal-400 hover:shadow-[0_20px_40px_rgba(21,158,154,0.18)] dark:hover:shadow-[0_20px_40px_rgba(21,158,154,0.12)] transition-all duration-300 cursor-default group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDF3F0] dark:bg-teal-950/60 text-[#159E9A] dark:text-[#5EEAD4] border border-[#99F6E4]/70 dark:border-teal-800 mb-4">
                Apex Anti-Drug Initiative
              </span>
              <div className="w-full h-32 sm:h-36 flex items-center justify-center p-3.5 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-xs border border-white/80 dark:border-white/10 shadow-xs mb-4 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <img
                  src="/assets/branding/nmba-logo.png"
                  alt="Nasha Mukt Bharat Abhiyaan Official Emblem"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                  loading="lazy"
                />
              </div>
              <div className="mt-auto">
                <h4 className="text-base sm:text-lg font-bold font-serif text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors leading-snug">
                  Nasha Mukt Bharat
                </h4>
                <p className="text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] mt-0.5">
                  Nasha Mukt Bharat Abhiyaan
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-2">
                  Ministry of Social Justice &amp; Empowerment, Government of India
                </p>
              </div>
            </div>

            {/* 3. MY Bharat */}
            <div
              tabIndex={0}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-19px)] max-w-[340px] flex flex-col items-center text-center justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#EBF5FB] via-[#F3F9FD] to-[#E1EEF6] dark:from-[#14243D] dark:via-[#101D33] dark:to-[#0D1829] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card dark:shadow-dark-soft hover:-translate-y-2 hover:border-[#159E9A] dark:hover:border-teal-400 hover:shadow-[0_20px_40px_rgba(21,158,154,0.18)] dark:hover:shadow-[0_20px_40px_rgba(21,158,154,0.12)] transition-all duration-300 cursor-default group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDF3F0] dark:bg-teal-950/60 text-[#159E9A] dark:text-[#5EEAD4] border border-[#99F6E4]/70 dark:border-teal-800 mb-4">
                National Youth Platform
              </span>
              <div className="w-full h-32 sm:h-36 flex items-center justify-center p-3.5 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-xs border border-white/80 dark:border-white/10 shadow-xs mb-4 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <img
                  src="/assets/branding/my-bharat-logo.png"
                  alt="MY Bharat Official Identity"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                  loading="lazy"
                />
              </div>
              <div className="mt-auto">
                <h4 className="text-base sm:text-lg font-bold font-serif text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors leading-snug">
                  MY Bharat
                </h4>
                <p className="text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] mt-0.5">
                  Mera Yuva Bharat
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-2">
                  Department of Youth Affairs, Government of India
                </p>
              </div>
            </div>

            {/* 4. Osmania University */}
            <div
              tabIndex={0}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-19px)] max-w-[340px] flex flex-col items-center text-center justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#EBF5FB] via-[#F3F9FD] to-[#E1EEF6] dark:from-[#14243D] dark:via-[#101D33] dark:to-[#0D1829] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card dark:shadow-dark-soft hover:-translate-y-2 hover:border-[#159E9A] dark:hover:border-teal-400 hover:shadow-[0_20px_40px_rgba(21,158,154,0.18)] dark:hover:shadow-[0_20px_40px_rgba(21,158,154,0.12)] transition-all duration-300 cursor-default group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDF3F0] dark:bg-teal-950/60 text-[#159E9A] dark:text-[#5EEAD4] border border-[#99F6E4]/70 dark:border-teal-800 mb-4">
                University Governance
              </span>
              <div className="w-full h-32 sm:h-36 flex items-center justify-center p-3.5 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-xs border border-white/80 dark:border-white/10 shadow-xs mb-4 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <img
                  src="/assets/branding/osmania-logo.png"
                  alt="Osmania University Official Crest"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                  loading="lazy"
                />
              </div>
              <div className="mt-auto">
                <h4 className="text-base sm:text-lg font-bold font-serif text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors leading-snug">
                  Osmania University
                </h4>
                <p className="text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] mt-0.5">
                  Affiliated Collegiate Cell
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-2">
                  State University NSS Governance &amp; Certification Body
                </p>
              </div>
            </div>

            {/* 5. MJCET Hyderabad */}
            <div
              tabIndex={0}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-19px)] max-w-[340px] flex flex-col items-center text-center justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#EBF5FB] via-[#F3F9FD] to-[#E1EEF6] dark:from-[#14243D] dark:via-[#101D33] dark:to-[#0D1829] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card dark:shadow-dark-soft hover:-translate-y-2 hover:border-[#159E9A] dark:hover:border-teal-400 hover:shadow-[0_20px_40px_rgba(21,158,154,0.18)] dark:hover:shadow-[0_20px_40px_rgba(21,158,154,0.12)] transition-all duration-300 cursor-default group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDF3F0] dark:bg-teal-950/60 text-[#159E9A] dark:text-[#5EEAD4] border border-[#99F6E4]/70 dark:border-teal-800 mb-4">
                Institutional Host Unit
              </span>
              <div className="w-full h-32 sm:h-36 flex items-center justify-center p-3.5 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-xs border border-white/80 dark:border-white/10 shadow-xs mb-4 group-hover:scale-105 group-hover:shadow-md transition-all duration-300">
                <img
                  src="/assets/branding/mjcet-logo.png"
                  alt="MJCET Hyderabad / Sultan-ul-Uloom Education Society Official Emblem"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                  loading="lazy"
                />
              </div>
              <div className="mt-auto">
                <h4 className="text-base sm:text-lg font-bold font-serif text-[#183153] dark:text-white group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors leading-snug">
                  MJCET Hyderabad
                </h4>
                <p className="text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] mt-0.5">
                  Sultan-ul-Uloom Education Society
                </p>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-2">
                  Muffakham Jah College of Engineering &amp; Technology, Mount Pleasant
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </section>
  );
};
