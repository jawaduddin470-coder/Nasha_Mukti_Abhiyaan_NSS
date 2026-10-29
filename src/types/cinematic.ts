export interface StoryCardBeat {
  id: string;
  label: string;
  chapter: string;
  badge: string;
  headline: string;
  narrative: string;
  startTime: number; // in seconds
  duration: number;  // in seconds
  motif: 'spark' | 'crossroads' | 'aperture' | 'shield' | 'emblem';
  accentColor: string;
  // Optional 3D camera properties for spatial continuity
  cameraPos?: [number, number, number];
  targetPos?: [number, number, number];
  lightIntensity?: number;
  lightColor?: string;
  fogDensity?: number;
}

export const CINEMATIC_BEATS: StoryCardBeat[] = [
  {
    id: 'possibility',
    label: 'Possibility',
    chapter: 'CHAPTER 01 / 05',
    badge: 'POSSIBILITY',
    headline: 'Every future begins with a choice.',
    narrative: 'A blank horizon of boundless potential. The quiet power to determine your path starts with a single conscious decision.',
    startTime: 0,
    duration: 2.8,
    motif: 'spark',
    accentColor: '#38BDF8', // Cyan sky
    cameraPos: [0, 4.2, 7.8],
    targetPos: [0, -0.4, 0],
    lightIntensity: 1.0,
    lightColor: '#FFF8EB',
    fogDensity: 0.04,
  },
  {
    id: 'pressure',
    label: 'Pressure',
    chapter: 'CHAPTER 02 / 05',
    badge: 'PRESSURE',
    headline: 'Not every path leads where you belong.',
    narrative: 'Collegiate stress, unspoken expectations, and deceptive shortcuts. True resilience is recognizing the trap before taking the step.',
    startTime: 2.8,
    duration: 3.0,
    motif: 'crossroads',
    accentColor: '#F97316', // Saffron warning
    cameraPos: [-2.4, 1.8, 3.6],
    targetPos: [-1.2, 0.2, -0.4],
    lightIntensity: 0.7,
    lightColor: '#CBD5E1',
    fogDensity: 0.08,
  },
  {
    id: 'awareness',
    label: 'Awareness',
    chapter: 'CHAPTER 03 / 05',
    badge: 'AWARENESS',
    headline: 'Pause. Understand. Choose.',
    narrative: 'Clarity is quiet power. Understanding the neurobiology of dependency replaces stigma with sovereign health.',
    startTime: 5.8,
    duration: 3.0,
    motif: 'aperture',
    accentColor: '#FBBF24', // Amber illumination
    cameraPos: [-0.6, 2.0, 4.4],
    targetPos: [0.2, 0.4, 0],
    lightIntensity: 1.35,
    lightColor: '#FEF3C7',
    fogDensity: 0.03,
  },
  {
    id: 'community',
    label: 'Community',
    chapter: 'CHAPTER 04 / 05',
    badge: 'COMMUNITY',
    headline: 'Asking for help is strength.',
    narrative: 'You never walk alone. Accredited psychological counselors, peer mentors, and confidential campus circles walk with you.',
    startTime: 8.8,
    duration: 3.0,
    motif: 'shield',
    accentColor: '#34D399', // Vitality emerald
    cameraPos: [1.6, 1.5, 4.8],
    targetPos: [0.8, 0.5, -0.4],
    lightIntensity: 1.4,
    lightColor: '#FFFFFF',
    fogDensity: 0.02,
  },
  {
    id: 'future',
    label: 'The Future',
    chapter: 'NSS MJCET PRESENTS',
    badge: 'THE FUTURE',
    headline: 'Every choice shapes a future.',
    narrative: 'Awareness. Resilience. Compassion.',
    startTime: 11.8,
    duration: 3.2,
    motif: 'emblem',
    accentColor: '#EA580C', // Institutional NSS saffron
    cameraPos: [0, 0.6, 5.4],
    targetPos: [0, 0, 0],
    lightIntensity: 1.2,
    lightColor: '#FFF7ED',
    fogDensity: 0.02,
  },
];

export const TOTAL_CINEMATIC_DURATION = 15.0; // in seconds
