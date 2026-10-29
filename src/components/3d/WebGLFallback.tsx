import React from 'react';
import { Compass, Sparkles, ArrowRight, Brain, Calendar, Users, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { CAMPAIGN_LANDMARKS } from '../../data/landmarksData';

interface WebGLFallbackProps {
  onSelect?: (target: string) => void;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getIcon = (id: string) => {
    switch (id) {
      case 'awareness':
        return <Brain className="w-4 h-4" />;
      case 'events':
        return <Calendar className="w-4 h-4" />;
      case 'community':
        return <Users className="w-4 h-4" />;
      case 'support':
        return <PhoneCall className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`relative w-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-soft-card border transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-b from-darkSurface-card to-darkSurface-base border-darkSurface-border text-white'
          : 'bg-gradient-to-b from-ivory-100 to-ivory-200/70 border-ivory-300/80 text-charcoal-900'
      }`}
      role="region"
      aria-label="Interactive Campaign Pathways Overview"
    >
      {/* Decorative architectural background rings */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-saffron-500/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-nssGreen-600/15" />
      </div>

      <div className="relative z-10 mb-6">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 shadow-xs border ${
            isDark
              ? 'bg-darkSurface-elevated border-darkSurface-border text-charcoal-300'
              : 'bg-[#EAF5FB] border-[#CFE3F0] text-[#183153]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-saffron-500" aria-hidden="true" />
          <span>Spatial Campaign Map (Accessible 2D View)</span>
        </div>
        <h3
          className={`font-serif text-2xl sm:text-3xl font-bold ${
            isDark ? 'text-white' : 'text-charcoal-900'
          }`}
        >
          The Sanctuary of Conscious Choice
        </h3>
        <p
          className={`mt-2 text-sm max-w-xl leading-relaxed ${
            isDark ? 'text-charcoal-300' : 'text-charcoal-700'
          }`}
        >
          Four interconnected pillars guiding students from uncertainty toward scientific clarity, peer solidarity, campus action, and confidential clinical guidance.
        </p>
      </div>

      {/* 4 Interactive Waypoint Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-auto">
        {CAMPAIGN_LANDMARKS.map((landmark) => (
          <Link
            key={landmark.id}
            to={landmark.route}
            className={`p-4 rounded-xl border transition-all hover:-translate-y-1 shadow-xs group flex flex-col justify-between ${
              isDark
                ? 'bg-darkSurface-elevated border-darkSurface-border hover:border-saffron-500/50'
                : 'bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 border-[#CFE3F0] hover:border-[#159E9A]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-charcoal-400 dark:text-charcoal-500">
                  {landmark.num}
                </span>
                <span
                  className="p-1.5 rounded-lg shrink-0"
                  style={{
                    backgroundColor: `${landmark.accentColor}18`,
                    color: landmark.accentColor,
                  }}
                >
                  {getIcon(landmark.id)}
                </span>
              </div>
              <h4
                className={`font-semibold text-sm transition-colors group-hover:text-saffron-500 ${
                  isDark ? 'text-white' : 'text-charcoal-900'
                }`}
              >
                {landmark.name}
              </h4>
              <p
                className={`text-xs mt-1 font-medium ${
                  isDark ? 'text-charcoal-300' : 'text-charcoal-600'
                }`}
              >
                {landmark.subtitle}
              </p>
              <p
                className={`text-xs mt-2 leading-relaxed ${
                  isDark ? 'text-charcoal-400' : 'text-charcoal-500'
                }`}
              >
                {landmark.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-ivory-200 dark:border-darkSurface-border flex items-center text-xs font-semibold text-saffron-600 dark:text-saffron-400 group-hover:translate-x-0.5 transition-transform">
              <span>Explore Section</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>

      <div
        className={`relative z-10 flex items-center justify-between pt-6 mt-6 border-t text-xs ${
          isDark
            ? 'border-darkSurface-border text-charcoal-400'
            : 'border-ivory-300/80 text-charcoal-600'
        }`}
      >
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-saffron-500" aria-hidden="true" />
          NSS MJCET Institutional Framework &bull; Government of India NMBA
        </span>
        <Link
          to="/awareness"
          className="inline-flex items-center gap-1 font-semibold text-saffron-600 hover:text-saffron-700 dark:text-saffron-400"
        >
          <span>Begin Awareness Journey</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};
