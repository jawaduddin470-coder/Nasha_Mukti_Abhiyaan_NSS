import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Shield, Heart, Award, ArrowUpRight } from 'lucide-react';
import { Container } from '../common/Container';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-[#10243D] via-[#0E1D33] to-[#0A182B] text-slate-200 border-t border-[#24476B] relative overflow-hidden transition-colors duration-200" aria-label="Campaign Footer">
      {/* 1. Emergency Helpline Support Strip */}
      <div className="border-b border-[#243A5E] bg-[#142A45]/90 backdrop-blur-md">
        <Container size="wide">
          <div className="py-4 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10243D] border border-[#24476B] flex items-center justify-center text-[#5EEAD4] shrink-0 shadow-inner">
                <Phone className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#5EEAD4] font-bold">
                  24/7 National Tele-Consultation &amp; Support Helplines
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                  National Drug De-Addiction Toll-Free:{' '}
                  <a href="tel:14446" className="font-bold text-white underline font-mono hover:text-[#5EEAD4] transition-colors">
                    14446
                  </a>{' '}
                  &bull; Tele-MANAS Mental Health:{' '}
                  <a href="tel:14416" className="font-bold text-white underline font-mono hover:text-[#5EEAD4] transition-colors">
                    14416
                  </a>
                </p>
              </div>
            </div>

            <Link
              to="/support"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5EEAD4] hover:text-[#2DD4BF] transition-colors uppercase tracking-wider py-1.5 px-3 rounded-lg hover:bg-[#10243D] shrink-0 self-end md:self-auto border border-[#24476B] hover:border-[#159E9A]"
            >
              <span>Explore All Verified Helplines</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Container>
      </div>

      {/* 2. Main Institutional Footer Grid */}
      <div className="py-12 sm:py-16">
        <Container size="wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Column 1: Identity & Official Lineage (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/branding/nss-logo.png"
                  alt="Official NSS Logo"
                  className="w-11 h-11 object-contain drop-shadow"
                />
                <img
                  src="/assets/branding/nmba-emblem.jpg"
                  alt="Nasha Mukt Bharat Abhiyaan Official Emblem"
                  className="w-10 h-10 object-contain rounded-full ring-1 ring-[#24476B]"
                />
                <img
                  src="/assets/branding/my-bharat-logo.jpg"
                  alt="MY Bharat (Mera Yuva Bharat) Emblem"
                  className="h-8 object-contain bg-[#EAF5FB]/90 px-2 py-0.5 rounded border border-[#3A5D8A]"
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-serif">
                  NSS MJCET Nasha Mukti Abhiyaan
                </h3>
                <p className="text-xs text-[#5EEAD4] font-semibold mt-0.5">
                  National Service Scheme &bull; Muffakham Jah College of Engineering &amp; Technology
                </p>
              </div>

              <blockquote className="text-xs sm:text-sm text-slate-300 italic border-l-2 border-[#159E9A] pl-3 leading-relaxed">
                &ldquo;Every choice shapes a future. Awareness begins together.&rdquo;
              </blockquote>

              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                A student-led public health initiative empowering engineering students across Hyderabad through scientific awareness, constructive peer culture, and destigmatized care pathways.
              </p>
            </div>

            {/* Column 2: Navigation Hub (lg:col-span-2) */}
            <div className="lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-3.5 font-sans">
                Campaign Hub
              </p>
              <nav className="flex flex-col gap-2 text-xs sm:text-sm" aria-label="Footer Navigation">
                <Link to="/" className="text-slate-300 hover:text-[#5EEAD4] transition-colors">
                  Home Landing
                </Link>
                <Link to="/awareness" className="text-slate-300 hover:text-[#5EEAD4] transition-colors">
                  Awareness Pillars
                </Link>
                <Link to="/activities" className="text-slate-300 hover:text-[#5EEAD4] transition-colors">
                  Campus Activities
                </Link>
                <Link to="/gallery" className="text-slate-300 hover:text-[#5EEAD4] transition-colors">
                  Visual Gallery
                </Link>
                <Link to="/quiz" className="text-slate-300 hover:text-[#5EEAD4] transition-colors">
                  Awareness Quiz
                </Link>
                <Link to="/leaderboard" className="text-slate-300 hover:text-[#5EEAD4] transition-colors flex items-center gap-1.5">
                  <span>The Champions Board</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">Results</span>
                </Link>
                <Link to="/support" className="text-slate-300 hover:text-[#5EEAD4] transition-colors">
                  Support Resources
                </Link>
                <Link to="/developers" className="text-slate-300 hover:text-[#5EEAD4] transition-colors">
                  Developers Corner
                </Link>
              </nav>
            </div>

            {/* Column 3: Institutional Unit & Official Link (lg:col-span-3) */}
            <div className="lg:col-span-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-3.5 font-sans">
                Institutional Unit
              </p>
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p className="text-white font-semibold">
                  Muffakham Jah College of Engineering and Technology (MJCET)
                </p>
                <p>
                  Affiliated to Osmania University, Hyderabad<br />
                  Approved by AICTE, New Delhi
                </p>
                <p className="text-slate-400">
                  Mount Pleasant, Road No. 3, Banjara Hills, Hyderabad, Telangana 500034
                </p>
                
                {/* Official NSS MJCET Website Link */}
                <div className="pt-2">
                  <a
                    href="https://www.nssmjcet.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#142A45] border border-[#24476B] text-white font-semibold hover:border-[#159E9A] hover:text-[#5EEAD4] transition-all shadow-sm"
                  >
                    <span>NSS MJCET Official Website</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 4: Affiliations & Safeguards (lg:col-span-3) */}
            <div className="lg:col-span-3">
              <p className="text-xs font-bold uppercase tracking-wider text-white mb-3.5 font-sans">
                National Alliances
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Ministry of Social Justice (NMBA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="w-3.5 h-3.5 text-[#5EEAD4] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Ministry of Youth Affairs (NSS &amp; MY Bharat)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-3.5 h-3.5 text-[#60A5FA] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>National Health Mission (Tele-MANAS)</span>
                </li>
              </ul>

              <div className="mt-4 p-3 rounded-xl bg-[#142A45]/70 border border-[#24476B] text-[11px] text-slate-300 leading-relaxed shadow-sm">
                <strong className="text-white">Confidentiality Assurance:</strong> Reaching out to campus counselors or national helplines carries zero academic retribution or disclosure.
              </div>
            </div>
          </div>

          {/* 3. Bottom Legal & Colophon Bar */}
          <div className="mt-10 pt-5 border-t border-[#243A5E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} NSS MJCET Nasha Mukti Abhiyaan. Built for student wellness and youth awareness.
            </p>
            <div className="flex items-center gap-3">
              <span>MJCET Banjara Hills, Hyderabad</span>
              <span>&bull;</span>
              <a
                href="https://www.nssmjcet.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5EEAD4] hover:underline font-semibold"
              >
                www.nssmjcet.in
              </a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
