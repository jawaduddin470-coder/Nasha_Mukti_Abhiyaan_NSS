import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Phone, HeartHandshake, ShieldCheck, ExternalLink, Sun, Moon } from 'lucide-react';
import { NavItem } from '../../types/navigation';
import { Button } from '../common/Button';
import { useTheme } from '../../context/ThemeContext';

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1524]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Sheet */}
      <div
        ref={drawerRef}
        className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-[#EAF5FB] dark:bg-[#0B1524] border-l border-[#CFE3F0] dark:border-[#243A5E] p-5 sm:p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out overflow-y-auto"
      >
        <div>
          {/* Header of Drawer */}
          <div className="flex items-center justify-between pb-5 border-b border-[#D7E7F0] dark:border-[#243A5E]">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/branding/nss-logo.png"
                alt="NSS Logo"
                className="w-9 h-9 object-contain"
              />
              <div>
                <p className="text-xs uppercase font-extrabold tracking-wider text-[#183153] dark:text-[#B9DDF5] leading-none">
                  NSS MJCET
                </p>
                <p className="text-sm font-bold text-[#183153] dark:text-white font-serif leading-tight mt-0.5">
                  Nasha Mukti Abhiyaan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-[#D7E7F0] dark:border-[#243A5E] text-[#183153] dark:text-slate-300 hover:bg-[#EAF6FC] dark:hover:bg-[#172B48] transition-colors"
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
                className="p-2 rounded-lg text-[#334C73] dark:text-slate-300 hover:text-[#183153] dark:hover:text-white hover:bg-[#EAF6FC] dark:hover:bg-[#172B48] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] transition-colors"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 flex flex-col gap-1" aria-label="Mobile Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-[#F0FDFB] dark:bg-teal-950/50 text-[#0F8380] dark:text-[#5EEAD4] font-semibold border-l-4 border-[#159E9A]'
                      : 'text-[#1F3F6B] dark:text-slate-300 hover:text-[#183153] dark:hover:text-white hover:bg-[#EAF6FC] dark:hover:bg-[#172B48]'
                  }`
                }
              >
                <span>{item.name}</span>
                {item.description && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
                    {item.description}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* NSS MJCET Institutional Link */}
          <div className="mt-5 pt-4 border-t border-[#D7E7F0] dark:border-[#243A5E]">
            <a
              href="https://www.nssmjcet.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#183153] dark:text-slate-200 bg-[#EAF6FC] dark:bg-[#172B48] hover:bg-[#B9DDF5]/40 transition-colors"
            >
              <span>NSS MJCET Official Website</span>
              <ExternalLink className="w-4 h-4 text-[#159E9A]" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Support Callout at Bottom of Drawer */}
        <div className="pt-5 border-t border-[#D7E7F0] dark:border-[#243A5E] space-y-3 mt-6">
          <div className="p-3.5 rounded-xl bg-[#EAF6FC] dark:bg-[#14243D] border border-[#B9DDF5] dark:border-[#243A5E] flex items-start gap-3">
            <HeartHandshake className="w-4 h-4 text-[#239B70] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs">
              <p className="font-semibold text-[#183153] dark:text-white">Confidential Support</p>
              <p className="text-[#334C73] dark:text-slate-300 mt-0.5">
                National Toll-Free: <strong className="text-[#0F8380] dark:text-[#5EEAD4] font-mono">14446</strong>
              </p>
            </div>
          </div>

          <Button
            to="/support"
            variant="teal"
            size="md"
            className="w-full text-xs py-2.5"
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
    </div>
  );
};
