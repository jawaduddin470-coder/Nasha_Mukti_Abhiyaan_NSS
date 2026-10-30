import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, Phone, ExternalLink, Heart, Sun, Moon, Film } from 'lucide-react';
import { NavItem } from '../../types/navigation';
import { MobileNav } from './MobileNav';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useIntro } from '../../context/IntroContext';

export const NAV_ITEMS: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Awareness', href: '/awareness', description: 'Science & Prevention' },
  { name: 'Activities', href: '/activities', description: 'Campus Action & Drives' },
  { name: 'Gallery', href: '/gallery', description: 'Visual Moments' },
  { name: 'Quiz', href: '/quiz', description: 'Awareness Challenge' },
  { name: 'Support', href: '/support', description: 'Helplines & Guidance' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { playIntro } = useIntro();
  const location = useLocation();

  // Scroll detection for dynamic sticky header compression
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#E8F3FA]/95 dark:bg-[#0B1524]/95 backdrop-blur-xl shadow-soft-card border-b border-[#CFE3F0] dark:border-[#243A5E]'
          : 'bg-[#E8F3FA]/88 dark:bg-[#0B1524]/85 backdrop-blur-md border-b border-[#CFE3F0]/70 dark:border-[#243A5E]/60'
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-18 sm:h-20'
        }`}
      >
        {/* Brand / Logo Group: Refined Institutional Lockup */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] rounded-xl p-1 min-w-0"
          aria-label="NSS MJCET Nasha Mukti Abhiyaan Home"
        >
          <div className="relative shrink-0">
            <img
              src="/assets/branding/nss-logo.png"
              alt="Official National Service Scheme Seal"
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs"
            />
            {/* Subtle national saffron indicator dot */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F3A54A] border-2 border-[#E8F3FA] dark:border-[#0B1524]"
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col text-left min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[10px] sm:text-[11px] uppercase font-extrabold tracking-wider text-[#183153] dark:text-[#B9DDF5] font-sans">
                NSS MJCET
              </span>
              <span className="text-slate-400 text-[10px] hidden sm:inline">&bull;</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                Osmania University
              </span>
            </div>
            <span className="text-xs sm:text-base md:text-lg font-bold text-[#183153] dark:text-white font-serif tracking-tight group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors leading-tight mt-0.5 truncate sm:whitespace-nowrap">
              Nasha Mukti Abhiyaan
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden xl:flex items-center gap-1"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `relative px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                  isActive
                    ? 'text-[#0F8380] dark:text-[#5EEAD4] bg-[#DDF3F0] dark:bg-teal-950/40 font-bold'
                    : 'text-[#1F3F6B] dark:text-slate-300 hover:text-[#183153] dark:hover:text-white hover:bg-[#DCEBF5] dark:hover:bg-[#172B48]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.name}</span>
                  {isActive && (
                    <span
                      className="absolute bottom-0 inset-x-2 h-0.5 bg-[#159E9A] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Medium Screen Navigation */}
        <nav
          className="hidden lg:flex xl:hidden items-center gap-0.5"
          aria-label="Compact Desktop Navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                  isActive
                    ? 'text-[#0F8380] dark:text-[#5EEAD4] bg-[#DDF3F0] dark:bg-teal-950/40 font-bold'
                    : 'text-[#1F3F6B] dark:text-slate-300 hover:text-[#183153] dark:hover:text-white hover:bg-[#DCEBF5] dark:hover:bg-[#172B48]'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Cluster (Desktop >= 1024px) */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* 1. Official Portal Link */}
          <a
            href="https://www.nssmjcet.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#334C73] dark:text-slate-300 hover:text-[#159E9A] dark:hover:text-[#5EEAD4] transition-colors px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
            title="Visit NSS MJCET Official Portal"
          >
            <span className="hidden 2xl:inline">nssmjcet.in</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
          </a>

          {/* 2. Toll-Free Helpline Utility Badge */}
          <a
            href="tel:14446"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#DCEBF5] dark:bg-[#14243D] border border-[#B9DDF5] dark:border-[#243A5E] text-xs text-[#183153] dark:text-slate-200 hover:border-[#159E9A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] shadow-2xs"
            title="National Drug De-Addiction Helpline (Toll-Free 24/7)"
          >
            <Phone className="w-3 h-3 text-[#159E9A]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-bold text-[#183153] dark:text-white">14446</span>
          </a>

          {/* 3. Replay Intro Button (Signature Experience) */}
          <button
            type="button"
            onClick={playIntro}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#CFE3F0] dark:border-[#243A5E] bg-[#EAF5FB]/90 dark:bg-[#14243D] text-[#183153] dark:text-slate-200 hover:text-[#0F8380] dark:hover:text-white hover:border-[#159E9A] hover:bg-[#DDF3F0] dark:hover:bg-[#172B48] transition-all duration-200 hover:scale-102 active:scale-98 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
            title="Replay Cinematic Campaign Journey"
            aria-label="Replay Cinematic Campaign Journey"
          >
            <Film className="w-3.5 h-3.5 text-[#159E9A] group-hover:rotate-[-20deg] transition-transform duration-300" aria-hidden="true" />
            <span className="text-xs font-semibold">Replay Intro</span>
          </button>

          {/* 4. Global Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[#CFE3F0] dark:border-[#243A5E] text-[#183153] dark:text-slate-300 hover:text-[#0F8380] dark:hover:text-white hover:bg-[#DCEBF5] dark:hover:bg-[#172B48] transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] shadow-2xs"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F3A54A]" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-[#183153]" aria-hidden="true" />
            )}
          </button>

          {/* 5. Campaign Action */}
          <Button
            to="/awareness"
            variant="teal"
            size="sm"
            leftIcon={<Heart className="w-3.5 h-3.5" aria-hidden="true" />}
            className="text-xs py-1.5 shadow-2xs"
          >
            Explore
          </Button>
        </div>

        {/* Mobile & Tablet Control Cluster (< 1024px) */}
        <div className="flex lg:hidden items-center gap-1.5">
          {/* Tablet Helpline Badge */}
          <a
            href="tel:14446"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#DCEBF5] dark:bg-[#14243D] border border-[#B9DDF5] dark:border-[#243A5E] text-xs text-[#183153] dark:text-slate-200 hover:border-[#159E9A] transition-colors shadow-2xs mr-1"
            title="National Drug De-Addiction Helpline (Toll-Free 24/7)"
          >
            <Phone className="w-3 h-3 text-[#159E9A]" aria-hidden="true" />
            <span className="text-[11px] font-mono font-bold text-[#183153] dark:text-white">14446</span>
          </a>

          {/* Mobile Replay Intro Icon (Preserved on tablet/desktop, accessible via drawer on mobile) */}
          <button
            type="button"
            onClick={playIntro}
            className="hidden sm:flex p-2.5 min-w-[40px] min-h-[40px] rounded-xl border border-[#D7E7F0] dark:border-[#243A5E] text-[#159E9A] hover:bg-[#EAF6FC] dark:hover:bg-[#172B48] items-center justify-center transition-colors active:scale-95"
            title="Replay Cinematic Intro"
            aria-label="Replay Cinematic Intro"
          >
            <Film className="w-4 h-4" aria-hidden="true" />
          </button>

          {/* Mobile Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 min-w-[40px] min-h-[40px] rounded-xl border border-[#D7E7F0] dark:border-[#243A5E] text-[#183153] dark:text-slate-300 hover:bg-[#EAF6FC] dark:hover:bg-[#172B48] flex items-center justify-center transition-colors active:scale-95"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F3A54A]" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-[#183153]" aria-hidden="true" />
            )}
          </button>

          {/* Hamburger Menu Toggle (Touch Target >= 44x44px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 min-w-[44px] min-h-[44px] rounded-xl border border-[#D7E7F0] dark:border-[#243A5E] text-[#183153] dark:text-slate-200 hover:text-[#183153] dark:hover:text-white hover:bg-[#EAF6FC] dark:hover:bg-[#172B48] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] transition-colors active:scale-95"
            aria-label="Open mobile navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Accessible Mobile Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={NAV_ITEMS}
      />
    </header>
  );
};
