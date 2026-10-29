import React, { useEffect, useRef, useState } from 'react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delayMs?: number;
  durationMs?: number;
  threshold?: number;
  className?: string;
  as?: React.ElementType;
  distance?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delayMs = 0,
  durationMs = 600,
  threshold = 0.12,
  className = '',
  as: Component = 'div',
  distance = 24,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 1. Accessibility Check: Respect user's reduced-motion preference
    if (typeof window !== 'undefined') {
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (reducedMotionQuery.matches) {
        setIsVisible(true);
        return;
      }
    }

    // 2. Safety Fallback: Ensure content is visible even if IntersectionObserver fails
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    // 3. IntersectionObserver logic
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      clearTimeout(safetyTimer);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(safetyTimer);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      clearTimeout(safetyTimer);
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold]);

  // Calculate transform according to direction
  const getTransform = () => {
    if (isVisible) return 'none';

    // On narrow screens, reduce transform distance
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const actualDistance = isMobile ? Math.min(distance, 14) : distance;

    switch (direction) {
      case 'up':
        return `translateY(${actualDistance}px)`;
      case 'down':
        return `translateY(-${actualDistance}px)`;
      case 'left':
        return `translateX(${actualDistance}px)`;
      case 'right':
        return `translateX(-${actualDistance}px)`;
      case 'zoom':
        return 'scale(0.95)';
      case 'fade':
      default:
        return 'none';
    }
  };

  return (
    <Component
      ref={elementRef}
      className={`${className} will-change-transform`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionProperty: 'opacity, transform',
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delayMs}ms`,
      }}
    >
      {children}
    </Component>
  );
};
