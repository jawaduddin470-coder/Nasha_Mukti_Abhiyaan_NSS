import React from 'react';
import { Sparkles, Compass } from 'lucide-react';
import { Badge } from './Badge';

interface RoadmapBannerProps {
  className?: string;
  variant?: 'hero' | 'standalone';
}

export const RoadmapBanner: React.FC<RoadmapBannerProps> = ({
  className = '',
  variant = 'hero',
}) => {
  if (variant === 'hero') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-midnight-900/90 border border-saffron-500/30 text-xs sm:text-sm text-slate-200 backdrop-blur-md shadow-subtle-card ${className}`}
        role="status"
        aria-label="Phase status"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron-500" />
        </span>
        <span className="font-semibold text-saffron-400">Phase 1 Foundation</span>
        <span className="text-slate-500 hidden sm:inline">•</span>
        <span className="text-slate-300 hidden sm:inline">
          Cinematic 3D Awareness Environment arriving in Phase 2
        </span>
      </div>
    );
  }

  return (
    <aside
      aria-label="Development Roadmap Notice"
      className={`rounded-2xl border border-white/10 bg-midnight-850/90 p-6 sm:p-8 relative overflow-hidden backdrop-blur-md shadow-subtle-card ${className}`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-500/5 rounded-full blur-2xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="gold" icon={<Sparkles className="w-3.5 h-3.5" aria-hidden="true" />}>
              Architecture Roadmap
            </Badge>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
              Phase 1 Live &bull; Phase 2 Preview
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
            Preparing the Explorable 3D Awareness Space
          </h3>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            This technical and visual foundation establishes the core typography, verified helplines, and structured data schemas. In the upcoming phase, an explorable Three.js environment will enable interactive visual storytelling and spatial awareness walkthroughs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col shrink-0 gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-midnight-900/80 px-3.5 py-2 rounded-lg border border-white/5">
            <Compass className="w-4 h-4 text-saffron-400 shrink-0" aria-hidden="true" />
            <span>Interactive 3D Stage (Phase 2)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 bg-midnight-900/80 px-3.5 py-2 rounded-lg border border-white/5">
            <Sparkles className="w-4 h-4 text-campaignGreen-400 shrink-0" aria-hidden="true" />
            <span>Secure Firebase CMS (Phase 3)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
