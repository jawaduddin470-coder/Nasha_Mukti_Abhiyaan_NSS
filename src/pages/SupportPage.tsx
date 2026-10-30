import React, { useState } from 'react';
import { Phone, ShieldCheck, User, Users, ExternalLink } from 'lucide-react';
import { Container } from '../components/common/Container';
import { SectionHeader } from '../components/common/SectionHeader';
import { Badge } from '../components/common/Badge';
import { VERIFIED_HELPLINES, ACTION_STEPS_FOR_SELF, ACTION_STEPS_FOR_FRIENDS } from '../data/supportData';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const SupportPage: React.FC = () => {
  const [activePathway, setActivePathway] = useState<'self' | 'friend'>('self');

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
        <ScrollReveal direction="up" delayMs={50}>
          {/* Page Header */}
          <SectionHeader
            kicker="Verified Support Network"
            kickerVariant="emerald"
            title="Confidential Helplines &amp; Care Pathways"
            subtitle="You never have to navigate substance challenges in isolation. The national helplines below are free of charge, operate 24/7, and are staffed by accredited clinical psychologists and medical counselors."
            headingLevel="h1"
          />

          {/* Clear Confidentiality & Policy Banner */}
          <div className="rounded-2xl border border-[#99F6E4] dark:border-teal-800 bg-[#F0FDFB] dark:bg-teal-950/40 p-6 sm:p-7 mb-12 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#DDF0E6] dark:bg-[#14243D] border border-[#99F6E4] dark:border-teal-800 flex items-center justify-center text-[#239B70] dark:text-[#34D399] shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#183153] dark:text-white leading-tight">
                  Authoritative Privacy &amp; Anonymity Safeguards
                </p>
                <p className="text-xs text-[#334C73] dark:text-slate-300 mt-1 leading-relaxed max-w-3xl">
                  National helplines (14446 and Tele-MANAS) are operated independently by Government of India ministries. You are not required to provide your name or college roll number. Reaching out has zero bearing on academic records or student disciplinary status.
                </p>
              </div>
            </div>
            <Badge variant="emerald" size="sm" className="self-start sm:self-auto shrink-0">
              Anonymous Callers Welcome
            </Badge>
          </div>
        </ScrollReveal>

        {/* Verified Helplines Cards Grid */}
        <section aria-labelledby="helplines-heading">
          <h2 id="helplines-heading" className="font-serif text-2xl font-bold text-[#183153] dark:text-white mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#159E9A]" aria-hidden="true" />
            Verified National &amp; Campus Helplines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VERIFIED_HELPLINES.map((helpline) => (
              <div
                key={helpline.id}
                className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 via-[#F4FAFD]/90 to-[#E8F3FA]/95 dark:from-[#14243D] dark:via-[#112036] dark:to-[#0E1B2E] border border-[#CFE3F0] dark:border-[#243A5E] border-t-4 border-t-[#159E9A] shadow-soft-card hover:shadow-elevated hover:-translate-y-1.5 hover:border-[#159E9A] dark:hover:border-teal-500 transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant={helpline.cost === 'Toll-Free' ? 'emerald' : 'neutral'}>
                      {helpline.cost}
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {helpline.hours}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#183153] dark:text-white">
                    {helpline.name}
                  </h3>
                  <p className="text-xs text-[#0F8380] dark:text-[#5EEAD4] font-medium mt-0.5">
                    {helpline.governingBody}
                  </p>

                  <div className="my-5 p-3.5 sm:p-4 rounded-xl bg-[#EAF6FC]/60 dark:bg-[#1B2F4E] border border-[#D7E7F0] dark:border-[#243A5E] flex flex-col xs:flex-row xs:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                        Direct Dial Number:
                      </span>
                      <a
                        href={`tel:${helpline.primaryNumber.replace(/\s+/g, '')}`}
                        className="font-serif text-xl sm:text-2xl font-bold text-[#183153] dark:text-white hover:text-[#159E9A] dark:hover:text-[#5EEAD4] transition-colors tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] rounded"
                        aria-label={`Dial ${helpline.name} at ${helpline.primaryNumber}`}
                      >
                        {helpline.primaryNumber}
                      </a>
                    </div>

                    <a
                      href={`tel:${helpline.primaryNumber.replace(/\s+/g, '')}`}
                      data-cursor="CALL"
                      className="px-4 py-2 rounded-xl bg-[#159E9A] hover:bg-[#0F8380] text-white font-semibold text-xs transition-colors shadow-teal-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] flex items-center justify-center gap-1.5 min-h-[40px] w-full xs:w-auto shrink-0"
                    >
                      <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Call Now</span>
                    </a>
                  </div>

                  <p className="text-xs text-[#334C73] dark:text-slate-300 leading-relaxed">
                    {helpline.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#D7E7F0] dark:border-[#243A5E] text-[11px] text-slate-500 dark:text-slate-400">
                    <strong>Languages Supported:</strong> {helpline.languages.join(', ')}
                  </div>
                </div>

                {helpline.officialPortalUrl && (
                  <div className="mt-5 pt-3 border-t border-[#D7E7F0] dark:border-[#243A5E] flex justify-end">
                    <a
                      href={helpline.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#159E9A] hover:text-[#0F8380] dark:text-[#5EEAD4] inline-flex items-center gap-1 transition-colors font-medium"
                    >
                      <span>Official Ministry Portal</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Action Pathway */}
        <section aria-labelledby="pathways-heading" className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-left">
            <div>
              <h2 id="pathways-heading" className="font-serif text-2xl font-bold text-[#183153] dark:text-white">
                Step-by-Step Guidance Pathway
              </h2>
              <p className="text-sm text-[#334C73] dark:text-slate-300 mt-1">
                Practical, actionable advice to guide your next step with clarity and agency.
              </p>
            </div>

            {/* Toggle buttons between Self and Friend */}
            <div className="flex rounded-xl bg-[#EAF5FB] dark:bg-[#14243D] p-1 border border-[#CFE3F0] dark:border-[#243A5E] shadow-2xs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activePathway === 'self'}
                onClick={() => setActivePathway('self')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                  activePathway === 'self'
                    ? 'bg-[#159E9A] text-white shadow-2xs font-bold'
                    : 'text-[#334C73] dark:text-slate-300 hover:text-[#183153] dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" aria-hidden="true" />
                For Myself
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activePathway === 'friend'}
                onClick={() => setActivePathway('friend')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                  activePathway === 'friend'
                    ? 'bg-[#159E9A] text-white shadow-2xs font-bold'
                    : 'text-[#334C73] dark:text-slate-300 hover:text-[#183153] dark:hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                For a Friend
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activePathway === 'self' ? ACTION_STEPS_FOR_SELF : ACTION_STEPS_FOR_FRIENDS).map(
              (step) => (
                <div
                  key={step.stepNumber}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-[#DCEBF5] dark:bg-[#1B2F4E] border border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-center text-[#159E9A] dark:text-[#5EEAD4] font-serif font-bold text-sm mb-4">
                      {step.stepNumber}
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-xs text-[#334C73] dark:text-slate-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#CFE3F0] dark:border-[#243A5E] text-[11px] text-[#239B70] dark:text-[#34D399] font-medium">
                    &bull; {step.guideline}
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="mt-20 text-left">
          <SectionHeader
            kicker="Frequently Asked Questions"
            kickerVariant="teal"
            title="Questions About Reaching Out"
            subtitle="Straightforward answers to the most common questions students have regarding privacy, helplines, and recovery."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/90 to-[#F4FAFD]/90 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
                Will the college disciplinary committee be notified if I call a helpline?
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                No. National helplines (14446, 14416) are independent, confidential services operated by Government of India health and social justice ministries. They have zero association with college disciplinary authorities and never share caller identity.
              </p>
            </div>

            <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/90 to-[#F4FAFD]/90 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
                Can I remain completely anonymous when I call?
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                Yes. You do not have to provide your name, college roll number, or any identifying details. You can simply share what you are experiencing and ask for guidance.
              </p>
            </div>

            <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/90 to-[#F4FAFD]/90 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
                How does the NSS MJCET unit support students experiencing difficulty?
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                NSS volunteers provide empathetic peer listening and act as safe bridges to verified clinical and counseling professionals. We do not judge, lecture, or alienate any student.
              </p>
            </div>

            <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#EAF5FB]/90 to-[#F4FAFD]/90 dark:from-[#14243D] dark:to-[#0F1E33] border border-[#CFE3F0] dark:border-[#243A5E] shadow-soft-card hover:shadow-elevated hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
                What if a friend refuses help even though they are clearly struggling?
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                You cannot force someone into recovery before they are ready, but you can remain a steadfast, caring presence. Keep communication open, gently remind them of helpline 14446, and consult counselor mentors for guidance on handling the situation safely.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};
