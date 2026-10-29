import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-saffron-500 focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-saffron-glow focus:outline-none focus:ring-2 focus:ring-white"
    >
      Skip to main content
    </a>
  );
};
