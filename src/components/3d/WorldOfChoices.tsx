import React from 'react';
import { Html } from '@react-three/drei';
import { Brain, Calendar, Users, PhoneCall } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ArchitecturalSanctuary } from './ArchitecturalSanctuary';
import { CAMPAIGN_LANDMARKS, CampaignLandmark } from '../../data/landmarksData';

interface WorldOfChoicesProps {
  selectedLandmark?: string | null;
  onSelectLandmark?: (id: string | null) => void;
}

interface WaypointPinProps {
  landmark: CampaignLandmark;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const WaypointPin: React.FC<WaypointPinProps> = ({
  landmark,
  icon,
  isSelected,
  onSelect,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <group
      position={landmark.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(landmark.id);
      }}
    >
      {/* Invisible enlarged clickable bounding sphere for effortless touch/pointer hit testing */}
      <mesh visible={false}>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Floating 3D HTML Badge - Non-Overlapping Compact Architecture */}
      <Html
        position={landmark.pinOffset || [0, 0.45, 0]}
        center
        distanceFactor={7.5}
        zIndexRange={[10, 50]}
        style={{
          transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(landmark.id);
          }}
          className={`group inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full backdrop-blur-md whitespace-nowrap transition-all duration-200 border shadow-soft-card cursor-pointer ${
            isSelected
              ? 'bg-[#159E9A] text-white border-teal-300 scale-105 shadow-[0_4px_16px_rgba(21,158,154,0.45)] ring-2 ring-teal-400/50'
              : isDark
              ? 'bg-[#14243D]/95 text-slate-100 border-[#243A5E] hover:border-[#159E9A] hover:bg-[#1B2F4E] hover:scale-102'
              : 'bg-[#EAF5FB]/95 text-[#183153] border-[#CFE3F0] hover:border-[#159E9A] hover:bg-[#DDF3F0] hover:scale-102'
          }`}
          aria-label={`Inspect landmark ${landmark.num}: ${landmark.name}`}
          title={`Click to inspect ${landmark.name}`}
        >
          {/* Landmark Number Badge */}
          <span
            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
              isSelected
                ? 'bg-white/25 text-white'
                : isDark
                ? 'bg-slate-800 text-teal-300'
                : 'bg-white/80 text-[#183153] border border-[#CFE3F0]'
            }`}
          >
            {landmark.num}
          </span>

          {/* Glyph Icon */}
          <span
            className="inline-flex shrink-0 w-3.5 h-3.5 items-center justify-center transition-transform group-hover:scale-110"
            style={{ color: isSelected ? '#FFFFFF' : landmark.accentColor }}
          >
            {icon}
          </span>

          {/* Concise Title: Never overlaps across 3D rotation */}
          <span className="text-[11px] font-bold font-sans tracking-tight">
            {landmark.shortName}
          </span>

          {isSelected && (
            <span className="text-[9px] font-semibold text-teal-100 bg-white/20 px-1.5 py-0.2 rounded-full uppercase tracking-wider ml-0.5">
              Active
            </span>
          )}
        </button>
      </Html>
    </group>
  );
};

export const WorldOfChoices: React.FC<WorldOfChoicesProps> = ({
  selectedLandmark = null,
  onSelectLandmark = () => {},
}) => {
  const { theme } = useTheme();

  const getLandmarkIcon = (id: string) => {
    switch (id) {
      case 'awareness':
        return <Brain className="w-3.5 h-3.5" />;
      case 'events':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'community':
        return <Users className="w-3.5 h-3.5" />;
      case 'support':
        return <PhoneCall className="w-3.5 h-3.5" />;
      default:
        return <Brain className="w-3.5 h-3.5" />;
    }
  };

  return (
    <group position={[0, -0.1, 0]}>
      {/* High-Realism Terraced Architectural Sanctuary Scene */}
      <ArchitecturalSanctuary
        theme={theme}
        highlightedLandmark={selectedLandmark}
      />

      {/* Interactive Waypoint Pins with Collision-Spaced HTML Badges */}
      {CAMPAIGN_LANDMARKS.map((landmark) => (
        <WaypointPin
          key={landmark.id}
          landmark={landmark}
          icon={getLandmarkIcon(landmark.id)}
          isSelected={selectedLandmark === landmark.id}
          onSelect={onSelectLandmark}
        />
      ))}
    </group>
  );
};
