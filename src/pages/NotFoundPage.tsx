import React from 'react';
import { Home, Compass, AlertCircle } from 'lucide-react';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 sm:py-36 bg-ivory-50 dark:bg-darkSurface-base flex items-center justify-center text-center transition-colors duration-200">
      <Container size="narrow">
        <div className="rounded-3xl border border-[#CFE3F0] dark:border-darkSurface-border bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 dark:bg-darkSurface-card p-8 sm:p-14 shadow-soft-card">
          <div className="w-16 h-16 rounded-2xl bg-saffron-50 dark:bg-saffron-950/60 border border-saffron-200 dark:border-saffron-800 flex items-center justify-center text-saffron-600 dark:text-saffron-400 mx-auto mb-6">
            <AlertCircle className="w-8 h-8" aria-hidden="true" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-saffron-600 dark:text-saffron-400">
            Error 404 &bull; Page Not Found
          </span>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 dark:text-white">
            Navigational Horizon Uncharted
          </h1>

          <p className="mt-4 text-sm sm:text-base text-charcoal-600 dark:text-charcoal-300 leading-relaxed max-w-md mx-auto">
            The page or route you are looking for does not exist or has been shifted within the NSS MJCET Nasha Mukti Abhiyaan platform.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              to="/"
              variant="primary"
              size="md"
              leftIcon={<Home className="w-4 h-4" aria-hidden="true" />}
            >
              Return to Campaign Home
            </Button>

            <Button
              to="/awareness"
              variant="secondary"
              size="md"
              leftIcon={<Compass className="w-4 h-4 text-saffron-600 dark:text-saffron-400" aria-hidden="true" />}
            >
              Explore Awareness Hub
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
