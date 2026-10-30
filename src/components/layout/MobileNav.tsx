import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { X, Phone, HeartHandshake, ShieldCheck, ExternalLink, Sun, Moon, Film } from 'lucide-react';
import { NavItem } from '../../types/navigation';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useIntro } from '../../context/IntroContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  navItems,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { playIntro } = useIntro();

  // Dual-state management for silky smooth slide animation on open and close
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      // Double rAF ensures the DOM element has been painted before transition starts
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 300); // 300ms matches transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Comprehensive mobile scroll lock & keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Trap Tab focus inside drawer for accessibility
      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Save previous document and body overflow styles
    const prevBodyOverflow = document.body.style.overflow;
    const prevDocOverflow = document.documentElement.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Focus close button on mount
    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 60);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevDocOverflow;
      document.body.style.touchAction = prevTouchAction;
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  if (!isRendered) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop with smooth opacity transition */}
      <div
        className={`fixed inset-0 bg-[#0B1524]/65 backdrop-blur-sm transition-opacity duration-300 ease-out touch-none ${
          isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        onTouchEnd={(e) => {
          e.preventDefault();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Drawer Sheet with smooth slide transition from right edge */}
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        className={`fixed inset-y-0 right-0 w-[86vw] max-w-xs sm:max-w-sm h-[100dvh] max-h-[100dvh] bg-[#EAF5FB] dark:bg-[#0B1524] border-l border-[#CFE3F0] dark:border-[#243A5E] flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto overscroll-contain text-left select-none ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        } pt-[max(1rem,env(safe-area-inset-top,0px))] pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pr-[max(1.25rem,env(safe-area-inset-right,0px))] pl-[max(1.25rem,env(safe-area-inset-left,0px))]`}
      >
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-[#D7E7F0] dark:border-[#243A5E] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/assets/branding/nss-logo.png"
                alt="NSS Logo"
                className="w-9 h-9 object-contain shrink-0 filter drop-shadow-xs"
              />
              <div className="min-w-0">
                <p className="text-xs uppercase font-extrabold tracking-wider text-[#183153] dark:text-[#B9DDF5] leading-none truncate">
                  NSS MJCET
                </p>
                <p className="text-sm font-bold text-[#183153] dark:text-white font-serif leading-tight mt-0.5 truncate">
                  Nasha Mukti Abhiyaan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl border border-[#D7E7F0] dark:border-[#243A5E] text-[#183153] dark:text-slate-300 hover:bg-[#EAF6FC] dark:hover:bg-[#172B48] flex items-center justify-center transition-colors active:scale-95"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#F3A54A]" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4 text-[#183153]" aria-hidden="true" />
                )}
              </button>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-xl text-[#334C73] dark:text-slate-300 hover:text-[#183153] dark:hover:text-white hover:bg-[#EAF6FC] dark:hover:bg-[#172B48] border border-[#D7E7F0] dark:border-[#243A5E] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] transition-colors active:scale-95"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 flex flex-col gap-1.5 overflow-y-auto pr-0.5" aria-label="Mobile Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[46px] select-none ${
                    isActive
                      ? 'bg-[#F0FDFB] dark:bg-teal-950/50 text-[#0F8380] dark:text-[#5EEAD4] font-bold border-l-4 border-[#159E9A] shadow-2xs'
                      : 'text-[#1F3F6B] dark:text-slate-300 hover:text-[#183153] dark:hover:text-white hover:bg-[#EAF6FC] dark:hover:bg-[#172B48]'
                  }`
                }
              >
                <span>{item.name}</span>
                {item.description && (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">
                    {item.description}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Replay Cinematic Intro Mobile Action */}
          <div className="mt-4 pt-3 border-t border-[#D7E7F0] dark:border-[#243A5E] shrink-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                playIntro();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#CFE3F0] dark:border-[#243A5E] bg-[#DCEBF5]/80 dark:bg-[#14243D] text-[#183153] dark:text-slate-200 hover:border-[#159E9A] transition-colors active:scale-99 min-h-[44px]"
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold">
                <Film className="w-4 h-4 text-[#159E9A]" aria-hidden="true" />
                <span>Replay Cinematic Intro</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-[#159E9A] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#159E9A]/15">
                16.8s
              </span>
            </button>
          </div>

          {/* NSS MJCET Institutional Link */}
          <div className="mt-2.5 shrink-0">
            <a
              href="https://www.nssmjcet.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-[#183153] dark:text-slate-200 bg-[#EAF6FC] dark:bg-[#172B48] hover:bg-[#B9DDF5]/40 transition-colors border border-[#CFE3F0]/60 dark:border-[#243A5E] min-h-[42px]"
            >
              <span>NSS MJCET Official Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#159E9A]" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Support Callout at Bottom of Drawer */}
        <div className="pt-4 border-t border-[#D7E7F0] dark:border-[#243A5E] space-y-2.5 mt-4 shrink-0">
          <div className="p-3 rounded-xl bg-[#EAF6FC] dark:bg-[#14243D] border border-[#B9DDF5] dark:border-[#243A5E] flex items-center gap-3">
            <HeartHandshake className="w-4 h-4 text-[#239B70] shrink-0" aria-hidden="true" />
            <div className="text-xs min-w-0">
              <p className="font-semibold text-[#183153] dark:text-white truncate">Confidential Support</p>
              <p className="text-[#334C73] dark:text-slate-300 mt-0.5">
                National Toll-Free: <a href="tel:14446" className="text-[#0F8380] dark:text-[#5EEAD4] font-mono font-bold hover:underline">14446</a>
              </p>
            </div>
          </div>

          <Button
            to="/support"
            variant="teal"
            size="md"
            className="w-full text-xs py-2.5 min-h-[44px]"
            leftIcon={<Phone className="w-3.5 h-3.5" aria-hidden="true" />}
            onClick={onClose}
          >
            Verified Helplines &amp; Guidance
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#239B70]" aria-hidden="true" />
            <span>Anonymous &bull; 24x7 &bull; Zero Retribution</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
