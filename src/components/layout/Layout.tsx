import React from 'react';
import { Outlet } from 'react-router-dom';
import { SkipLink } from './SkipLink';
import { Header } from './Header';
import { Footer } from './Footer';
import { CustomCursor } from '../common/CustomCursor';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-50 dark:bg-darkSurface-base text-charcoal-900 dark:text-white overflow-x-hidden selection:bg-saffron-500 selection:text-white transition-colors duration-200">
      <CustomCursor />
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
