import React from 'react';
import { Target, Users, BookOpenCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Container } from '../common/Container';
import { SectionHeader } from '../common/SectionHeader';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { ScrollReveal } from '../common/ScrollReveal';

export const IntroSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 border-t border-b border-[#CFE3F0] dark:border-[#243A5E] relative overflow-hidden transition-colors duration-200" aria-labelledby="intro-heading">
      {/* Rich Atmospheric Section Tonal Background */}
      <AtmosphericBackground variant="section-tonal" showRibbons />

      <Container size="wide" className="relative z-10">
        {/* Editorial Split Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <ScrollReveal direction="up" delayMs={50}>
              <SectionHeader
                kicker="Institutional Mission"
                kickerVariant="teal"
                title="A Purposeful Campus Stand for Student Wellbeing"
                subtitle="At Muffakham Jah College of Engineering and Technology, our student-led National Service Scheme units are breaking silence, addressing collegiate stress, and replacing stigma with verified medical and psychological guidance."
                className="mb-6"
              />

              <div className="p-6 rounded-2xl bg-[#F5F0E5]/90 dark:bg-[#14243D]/95 backdrop-blur-xs border border-[#E2D7C3] dark:border-[#243A5E] text-sm text-[#1F3F6B] dark:text-slate-300 leading-relaxed space-y-3 shadow-2xs">
                <p className="font-semibold text-[#183153] dark:text-white">
                  Why collegiate intervention matters:
                </p>
                <p>
                  Engineering rigor, new social environments, and career expectations can create acute vulnerability. We ensure every student knows that seeking help is a courageous, confidential choice.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Varied Asymmetrical Layout with Distinct Tonal Surfaces */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Box 1: Science & Medical (Misty Teal Tint) */}
            <ScrollReveal direction="up" delayMs={100}>
              <div className="p-7 rounded-2xl bg-[#DDF3F0]/65 dark:bg-[#0E202B] border border-[#B2E4DC] dark:border-[#1A3845] hover:border-[#159E9A] dark:hover:border-teal-500 hover:-translate-y-1.5 transition-all duration-300 shadow-soft-card hover:shadow-elevated flex flex-col justify-between h-full">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#CCECE7] dark:bg-teal-950/80 border border-[#99F6E4] dark:border-teal-800 flex items-center justify-center text-[#159E9A] dark:text-[#5EEAD4] mb-5 shadow-2xs">
                    <Target className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#183153] dark:text-white">
                    Neuroscience, Not Moralizing
                  </h3>
                  <p className="mt-3 text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                    Understanding dopamine receptors and chemical tolerance demystifies habituation. We treat dependence as a medical condition, never a character flaw.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#B2E4DC]/60 dark:border-[#1A3845] flex items-center gap-1.5 text-xs text-[#0F8380] dark:text-[#5EEAD4] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Evidence-based facts
                </div>
              </div>
            </ScrollReveal>

            {/* Box 2: Solidarity (Soft Emerald Tint) */}
            <ScrollReveal direction="up" delayMs={180}>
              <div className="p-7 rounded-2xl bg-[#DDF0E6]/65 dark:bg-[#0E221E] border border-[#A8E6CF] dark:border-[#173D32] hover:border-[#239B70] dark:hover:border-emerald-500 hover:-translate-y-1.5 transition-all duration-300 shadow-soft-card hover:shadow-elevated flex flex-col justify-between sm:translate-y-4 h-full">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#CAEADB] dark:bg-emerald-950/80 border border-[#A7F3D0] dark:border-emerald-800 flex items-center justify-center text-[#239B70] dark:text-[#34D399] mb-5 shadow-2xs">
                    <Users className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#183153] dark:text-white">
                    Active Bystander Culture
                  </h3>
                  <p className="mt-3 text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                    Training class representatives and peer mentors to recognize behavioral shifts and offer compassionate, non-judgmental assistance before crises escalate.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#A8E6CF]/60 dark:border-[#173D32] flex items-center gap-1.5 text-xs text-[#1C825E] dark:text-[#34D399] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Student-to-student solidarity
                </div>
              </div>
            </ScrollReveal>

            {/* Box 3: Constructive Outlets (Pale Sky Blue Tint) */}
            <ScrollReveal direction="up" delayMs={260}>
              <div className="p-7 rounded-2xl bg-[#DCEBF5]/65 dark:bg-[#0F1E33] border border-[#B9DDF5] dark:border-[#1C3658] hover:border-[#4F8FE8] dark:hover:border-blue-500 hover:-translate-y-1.5 transition-all duration-300 shadow-soft-card hover:shadow-elevated flex flex-col justify-between h-full">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#C7E0F2] dark:bg-blue-950/80 border border-[#B9DDF5] dark:border-blue-800 flex items-center justify-center text-[#4F8FE8] dark:text-[#95C2FA] mb-5 shadow-2xs">
                    <BookOpenCheck className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#183153] dark:text-white">
                    Constructive Outlets
                  </h3>
                  <p className="mt-3 text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                    Replacing artificial escapes with authentic dopamine sources: sports, technical innovation, community service, and supportive campus circles.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#B9DDF5]/60 dark:border-[#1C3658] flex items-center gap-1.5 text-xs text-[#204179] dark:text-[#95C2FA] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Sustainable mental stamina
                </div>
              </div>
            </ScrollReveal>

            {/* Box 4: Dignified Sanctuary (Calm Tinted Ivory) */}
            <ScrollReveal direction="up" delayMs={340}>
              <div className="p-7 rounded-2xl bg-[#F5F0E5]/80 dark:bg-[#1C2028] border border-[#E2D7C3] dark:border-[#2E3544] hover:border-[#A8D8CB] dark:hover:border-slate-500 hover:-translate-y-1.5 transition-all duration-300 shadow-soft-card hover:shadow-elevated flex flex-col justify-between sm:translate-y-4 h-full">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#E8DFC8] dark:bg-slate-900/80 border border-[#D5C7A8] dark:border-slate-700 flex items-center justify-center text-[#183153] dark:text-[#A8D8CB] mb-5 shadow-2xs">
                    <ShieldAlert className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#183153] dark:text-white">
                    Dignified Sanctuary
                  </h3>
                  <p className="mt-3 text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                    Confidential direct connections to national clinical helplines and campus wellness officers without academic retribution or exposure.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E8E2D5]/60 dark:border-[#2E3544] flex items-center gap-1.5 text-xs text-[#183153] dark:text-[#A8D8CB] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Zero penalty medical amnesty
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
};
