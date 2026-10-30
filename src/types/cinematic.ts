export interface CinematicChapter {
  id: string;
  chapterNumber: string;
  title: string;
  theme: string;
  headline: string;
  supportingText: string;
  imageSrc: string;
  startTime: number; // in seconds
  duration: number;  // in seconds
  accentColor: string;
  lightSweepColor: string;
  cameraDirection: 'push-in' | 'pan-tilt' | 'focus-dolly' | 'pull-back';
}

export const CINEMATIC_CHAPTERS: CinematicChapter[] = [
  {
    id: 'reality',
    chapterNumber: '01',
    title: 'THE REALITY',
    theme: 'The problem often begins silently.',
    headline: 'Every journey has a beginning. Not every beginning is visible.',
    supportingText: 'Sometimes, the greatest challenges begin in silence.',
    imageSrc: '/assets/intro/chapter-01-the-reality.jpg',
    startTime: 0,
    duration: 4.0,
    accentColor: '#38BDF8', // Ice Blue / Sky
    lightSweepColor: 'rgba(56, 189, 248, 0.22)',
    cameraDirection: 'push-in',
  },
  {
    id: 'awareness',
    chapterNumber: '02',
    title: 'THE AWARENESS',
    theme: 'Understanding changes perspectives.',
    headline: 'Awareness is where change begins.',
    supportingText: 'Knowledge replaces misconceptions. Understanding replaces stigma.',
    imageSrc: '/assets/intro/chapter-02-the-awareness.jpg',
    startTime: 4.0,
    duration: 4.0,
    accentColor: '#159E9A', // Misty Teal
    lightSweepColor: 'rgba(21, 158, 154, 0.28)',
    cameraDirection: 'pan-tilt',
  },
  {
    id: 'action',
    chapterNumber: '03',
    title: 'THE ACTION',
    theme: 'Change requires collective action.',
    headline: 'One decision can inspire a movement.',
    supportingText: 'Speak up. Support one another. Build a community that chooses wellbeing.',
    imageSrc: '/assets/intro/chapter-03-the-action.jpg',
    startTime: 8.0,
    duration: 4.0,
    accentColor: '#10B981', // Soft Emerald
    lightSweepColor: 'rgba(16, 185, 129, 0.28)',
    cameraDirection: 'focus-dolly',
  },
  {
    id: 'tomorrow',
    chapterNumber: '04',
    title: 'A BRIGHTER TOMORROW',
    theme: 'A healthier individual. A stronger community.',
    headline: 'A Healthier You. A Stronger Tomorrow.',
    supportingText: 'Together, we can build safer campuses, healthier communities and a drug-free future.',
    imageSrc: '/assets/intro/chapter-04-a-brighter-tomorrow.jpg',
    startTime: 12.0,
    duration: 4.8,
    accentColor: '#F59E0B', // Golden hour amber / subtle saffron
    lightSweepColor: 'rgba(245, 158, 11, 0.32)',
    cameraDirection: 'pull-back',
  },
];

export const TOTAL_CINEMATIC_DURATION = 16.8; // in seconds (calibrated to ~16.8s within 15–18s window)

// Backward compatibility alias for legacy types if referenced
export type StoryCardBeat = CinematicChapter;
export const CINEMATIC_BEATS = CINEMATIC_CHAPTERS;
