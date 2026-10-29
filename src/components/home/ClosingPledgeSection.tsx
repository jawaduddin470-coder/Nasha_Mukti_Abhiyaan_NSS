import React from 'react';
import { ShieldCheck, HeartHandshake, PhoneCall, ArrowRight, ExternalLink } from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';
import { AtmosphericBackground } from '../common/AtmosphericBackground';
import { ScrollReveal } from '../common/ScrollReveal';

export const ClosingPledgeSection: React.FC = () => {
  return (
    <section
      className="py-20 sm:py-28 relative overflow-hidden text-white"
      aria-labelledby="closing-heading"
    >
      {/* Rich Institutional Deep Navy Atmospheric Anchor */}
      <AtmosphericBackground variant="deep-feature" showWatermark watermarkPosition="center" />

      <Container size="wide" className="relative z-10">
        <ScrollReveal direction="up" delayMs={60}>
          <div className="max-w-3xl mx-auto text-center">
            {/* Institutional Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-[#A8D8CB] font-semibold mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#159E9A]" aria-hidden="true" />
              <span>NSS MJCET Student Commitment &bull; Youth Voice</span>
            </div>

            {/* Expressive Climax Headline */}
            <h2
              id="closing-heading"
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.18]"
            >
              &ldquo;Every choice shapes a future.<br />
              <span className="text-[#5EEAD4] italic font-serif font-normal">
                Awareness begins together.&rdquo;
              </span>
            </h2>

            {/* Supportive Editorial Description */}
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              Whether you are seeking clarity for yourself or looking out for a classmate, the first step is free from judgment. You have an entire campus cohort and accredited national health services standing with you.
            </p>

            {/* Clear Dual Call To Actions with Guaranteed Legibility */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                to="/support"
                variant="teal"
                size="lg"
                className="w-full sm:w-auto font-semibold px-6 shadow-lg shadow-[#159E9A]/25"
                leftIcon={<PhoneCall className="w-4 h-4" aria-hidden="true" />}
                rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              >
                Access Confidential Helplines
              </Button>

              <Button
                to="/awareness"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto font-medium px-6 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
                leftIcon={<HeartHandshake className="w-4 h-4 text-[#A8D8CB]" aria-hidden="true" />}
              >
                Learn Prevention Strategies
              </Button>
            </div>

            {/* Institutional Credentials Strip */}
            <div className="mt-10 pt-7 border-t border-white/15 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-300">
              <span>
                National Toll-Free: <a href="tel:14446" className="font-bold text-[#5EEAD4] hover:underline font-mono">14446</a>
              </span>
              <span className="text-white/20">&bull;</span>
              <span>
                Tele-MANAS: <a href="tel:14416" className="font-bold text-[#5EEAD4] hover:underline font-mono">14416</a>
              </span>
              <span className="text-white/20">&bull;</span>
              <span>
                MJCET Guidance: <strong className="font-semibold text-white">Confidential &amp; Free</strong>
              </span>
              <span className="text-white/20">&bull;</span>
              <a
                href="https://www.nssmjcet.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white underline inline-flex items-center gap-1 font-medium text-slate-300"
              >
                <span>NSS MJCET Portal</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
};
