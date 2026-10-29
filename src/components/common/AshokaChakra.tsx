import React from 'react';

interface AshokaChakraProps {
  className?: string;
  size?: number | string;
  color?: string; // CSS color or Tailwind class
  strokeWidth?: number;
  animate?: boolean;
}

/**
 * Authentic 24-spoke Ashoka Chakra (Dharmachakra) vector component.
 * Exact geometry:
 * - 24 spokes evenly distributed at 15° intervals (360° / 24)
 * - Central hub with circular boss and axle ring
 * - Outer double rim with 24 circular nodes / lotus nodules located between the spokes
 * - Monochromatic navy blue rendering per institutional guidelines
 */
export const AshokaChakra: React.FC<AshokaChakraProps> = ({
  className = '',
  size = 200,
  color = 'currentColor',
  strokeWidth = 1.2,
  animate = false,
}) => {
  const cx = 100;
  const cy = 100;
  const outerR = 92;
  const innerRimR = 84;
  const hubOuterR = 18;
  const hubInnerR = 7;
  const spokeCount = 24;

  // Generate 24 spokes at exactly 15° intervals
  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angleDeg = (i * 360) / spokeCount;
    const angleRad = (angleDeg * Math.PI) / 180;

    // Spoke tip at inner rim
    const x2 = cx + innerRimR * Math.cos(angleRad);
    const y2 = cy + innerRimR * Math.sin(angleRad);

    // Spoke base at hub
    const x1 = cx + hubOuterR * Math.cos(angleRad);
    const y1 = cy + hubOuterR * Math.sin(angleRad);

    // Subtle wedge width at hub for authentic Dharmachakra appearance
    const perpAngle = angleRad + Math.PI / 2;
    const wedgeHalfWidth = 1.2;
    const wx1 = x1 + wedgeHalfWidth * Math.cos(perpAngle);
    const wy1 = y1 + wedgeHalfWidth * Math.sin(perpAngle);
    const wx2 = x1 - wedgeHalfWidth * Math.cos(perpAngle);
    const wy2 = y1 - wedgeHalfWidth * Math.sin(perpAngle);

    return {
      id: i,
      path: `M ${wx1} ${wy1} L ${x2} ${y2} L ${wx2} ${wy2} Z`,
    };
  });

  // Generate 24 circular nodes positioned along the rim between each pair of spokes (offset by 7.5°)
  const nodes = Array.from({ length: spokeCount }, (_, i) => {
    const angleDeg = (i * 360) / spokeCount + 180 / spokeCount;
    const angleRad = (angleDeg * Math.PI) / 180;
    const nodeR = (outerR + innerRimR) / 2;
    const nx = cx + nodeR * Math.cos(angleRad);
    const ny = cy + nodeR * Math.sin(angleRad);

    return {
      id: i,
      cx: nx,
      cy: ny,
      r: 1.6,
    };
  });

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? 'animate-spin-very-slow' : ''} ${className}`}
      aria-hidden="true"
      style={{ color }}
    >
      {/* Outer Rim */}
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        stroke="currentColor"
        strokeWidth={strokeWidth * 1.5}
      />

      {/* Inner Rim */}
      <circle
        cx={cx}
        cy={cy}
        r={innerRimR}
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />

      {/* 24 Intermediate Nodes / Lotus Buds between spokes */}
      {nodes.map((node) => (
        <circle
          key={`node-${node.id}`}
          cx={node.cx}
          cy={node.cy}
          r={node.r}
          fill="currentColor"
        />
      ))}

      {/* 24 Geometric Spokes */}
      {spokes.map((spoke) => (
        <path
          key={`spoke-${spoke.id}`}
          d={spoke.path}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={0.4}
        />
      ))}

      {/* Outer Hub Ring */}
      <circle
        cx={cx}
        cy={cy}
        r={hubOuterR}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth * 1.2}
      />

      {/* Inner Hub Ring */}
      <circle
        cx={cx}
        cy={cy}
        r={hubInnerR}
        fill="currentColor"
      />

      {/* Central Axle Pin */}
      <circle
        cx={cx}
        cy={cy}
        r={2.2}
        fill="#FAF9F5"
      />
    </svg>
  );
};
