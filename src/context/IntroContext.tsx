import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CinematicIntro } from '../components/intro/CinematicIntro';

interface IntroContextType {
  isIntroActive: boolean;
  playIntro: () => void;
  closeIntro: () => void;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

// Tracks whether the intro has played during the current browser tab / page-load session.
// In-memory module variable ensures:
// 1. Fresh page loads (new tab, refresh, direct URL load) ALWAYS play the intro automatically.
// 2. Client-side route changes (e.g. / to /awareness or back) do NOT re-trigger the intro.
let hasPlayedInCurrentSession = false;

export const IntroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fresh website opening starts with intro active (unless URL has #skip-intro or admin login routes)
  const [isIntroActive, setIsIntroActive] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    // Do not show intro on admin portal routes, or if skip-intro is present in hash or query
    const path = window.location.pathname;
    if (
      path.startsWith('/admin') ||
      path.startsWith('/login/') ||
      window.location.hash.includes('skip-intro') ||
      window.location.search.includes('skip-intro') ||
      window.sessionStorage.getItem('nss_intro_dismissed') === 'true'
    ) {
      hasPlayedInCurrentSession = true;
      return false;
    }

    // If already played during this in-memory session and not requested via replay query
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('intro') === 'replay') {
      return true;
    }

    if (!hasPlayedInCurrentSession) {
      return true;
    }

    return false;
  });

  const playIntro = useCallback(() => {
    setIsIntroActive(true);
  }, []);

  const closeIntro = useCallback(() => {
    hasPlayedInCurrentSession = true;
    try {
      window.sessionStorage.setItem('nss_intro_dismissed', 'true');
    } catch {}
    setIsIntroActive(false);

    // If intro was triggered via explicit replay while on another page, return smoothly to the homepage
    if (window.location.search.includes('intro=replay') && location.pathname !== '/') {
      navigate('/');
    }

    // Clean up replay query param if present
    if (window.location.search.includes('intro=replay')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('intro');
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    }
  }, [location.pathname, navigate]);

  // Clean up any stale localStorage intro completed keys from older versions
  useEffect(() => {
    try {
      localStorage.removeItem('nss_intro_completed_v2');
      localStorage.removeItem('nss_intro_completed');
    } catch {
      // Safe fallback
    }
  }, []);

  return (
    <IntroContext.Provider value={{ isIntroActive, playIntro, closeIntro }}>
      {children}
      {isIntroActive && (
        <CinematicIntro onComplete={closeIntro} />
      )}
    </IntroContext.Provider>
  );
};

export const useIntro = (): IntroContextType => {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error('useIntro must be used within an IntroProvider');
  }
  return context;
};
