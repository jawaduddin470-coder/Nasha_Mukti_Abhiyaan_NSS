import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [cursorText, setCursorText] = useState<string>('');

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices with fine pointing precision and hover capability
    const pointerQuery = window.matchMedia('(pointer: fine) and (hover: hover)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const checkDevice = () => {
      // Disable on touch devices or small screens
      if (!pointerQuery.matches || motionQuery.matches || window.innerWidth < 1024 || 'ontouchstart' in window) {
        setIsEnabled(false);
        setIsVisible(false);
        return false;
      }
      setIsEnabled(true);
      return true;
    };

    if (!checkDevice()) {
      return;
    }

    const handleTouchStart = () => {
      // Immediate shutdown if touch screen detected
      setIsEnabled(false);
      setIsVisible(false);
    };

    const handleResize = () => {
      checkDevice();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Directly position central dot for zero latency
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Check if target or parent has interactive attributes
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest('a, button, [role="button"], [role="tab"], input, select, textarea, canvas, [data-cursor]');
        if (interactiveEl) {
          setIsHovered(true);
          const customLabel = interactiveEl.getAttribute('data-cursor');
          setCursorText(customLabel || '');
        } else {
          setIsHovered(false);
          setCursorText('');
        }
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp loop for the outer trailing saffron ring
    const renderLoop = () => {
      const lerpFactor = 0.18;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible]);

  if (!isEnabled) return null;

  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* 1. Precise Center Dot (Zero-latency tracking) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-[2.5px] -mt-[2.5px] pointer-events-none transition-transform duration-75 will-change-transform"
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isHovered ? 'w-1 h-1 scale-75 bg-[#159E9A]' : 'w-1.5 h-1.5'
          } ${isDark ? 'bg-[#5EEAD4]' : 'bg-[#183153]'}`}
        />
      </div>

      {/* 2. Outer Smooth Lagging Ring & Sky Blue Ambient Halo */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform flex flex-col items-center justify-center"
      >
        {/* Optional Secondary Halo: subtle sky blue ambient ring */}
        <div
          className={`absolute rounded-full transition-all duration-300 ease-out pointer-events-none ${
            isHovered
              ? 'w-12 h-12 -ml-6 -mt-6 bg-[#B9DDF5]/25 dark:bg-[#4F8FE8]/15 border border-[#B9DDF5]/40 scale-105'
              : 'w-7 h-7 -ml-3.5 -mt-3.5 bg-transparent border border-transparent scale-90 opacity-0'
          }`}
        />

        {/* Primary Precision Ring: Institutional Teal #159E9A */}
        <div
          className={`rounded-full transition-all duration-200 ease-out flex items-center justify-center ${
            isHovered
              ? 'w-9 h-9 -ml-4.5 -mt-4.5 border-2 border-[#159E9A] bg-[#159E9A]/10 scale-105 shadow-[0_0_14px_rgba(21,158,154,0.28)]'
              : 'w-6 h-6 -ml-3 -mt-3 border-[1.5px] border-[#159E9A]/70 bg-transparent'
          }`}
        />

        {/* Micro-Contextual Label (e.g. ROTATE, EXPLORE, VIEW) */}
        {cursorText && (
          <div className="absolute top-7 px-2 py-0.5 rounded-full bg-[#183153]/95 text-[9px] font-mono font-bold tracking-widest uppercase text-[#A8D8CB] border border-[#159E9A]/40 shadow-xs whitespace-nowrap animate-fadeIn">
            {cursorText}
          </div>
        )}
      </div>
    </div>
  );
};
