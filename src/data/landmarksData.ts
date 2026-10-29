export interface CampaignLandmark {
  id: 'awareness' | 'events' | 'community' | 'support';
  num: string;
  name: string;
  shortName: string;
  subtitle: string;
  tagline: string;
  description: string;
  route: string;
  accentColor: string;
  badgeColor: string;
  position: [number, number, number];
  pinOffset: [number, number, number];
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
}

export const CAMPAIGN_LANDMARKS: CampaignLandmark[] = [
  {
    id: 'awareness',
    num: '01',
    name: 'Rotunda of Understanding',
    shortName: 'Awareness',
    subtitle: 'Awareness Hub',
    tagline: 'Neurobiology, Myths & Prevention',
    description:
      'Examine the chemical mechanisms of dependence, contrast collegiate myths with clinical facts, and explore the science of lasting neuroplastic recovery.',
    route: '/awareness',
    accentColor: '#EA580C',
    badgeColor: 'bg-saffron-50 dark:bg-saffron-950/60 text-saffron-600 dark:text-saffron-400 border-saffron-200 dark:border-saffron-800',
    position: [-2.8, 0.25, -0.8],
    pinOffset: [0, 1.22, 0],
    cameraPos: [-2.2, 1.4, 3.2],
    cameraTarget: [-2.8, 0.5, -0.8],
  },
  {
    id: 'events',
    num: '02',
    name: 'Crossroads Plaza & Pergolas',
    shortName: 'Campus Action',
    subtitle: 'Activities & Rallies',
    tagline: 'Anti-Drug Rallies, Pledges & Street Plays',
    description:
      'Where MJCET volunteers unite for institutional awareness rallies, interactive street performances, and campus pledge campaigns across Hyderabad.',
    route: '/activities',
    accentColor: '#D97706',
    badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    position: [-0.1, 0.35, 0.35],
    pinOffset: [0, 1.05, 0],
    cameraPos: [-0.1, 1.5, 4.2],
    cameraTarget: [-0.1, 0.5, 0.35],
  },
  {
    id: 'community',
    num: '03',
    name: 'Agora of Solidarity',
    shortName: 'Solidarity',
    subtitle: 'Peer Circles & Dialogue',
    tagline: 'Respectful Dialogue & Peer Mentorship',
    description:
      'Master respectful dialogue starters to support struggling peers, learn de-escalation protocols, and foster stigma-free collegiate environments.',
    route: '/awareness#stage-support',
    accentColor: '#15803D',
    badgeColor: 'bg-nssGreen-50 dark:bg-nssGreen-950/60 text-nssGreen-600 dark:text-nssGreen-400 border-nssGreen-200 dark:border-nssGreen-800',
    position: [2.0, 0.3, 0.0],
    pinOffset: [0, 0.98, 0],
    cameraPos: [1.8, 1.4, 3.6],
    cameraTarget: [2.0, 0.5, 0.0],
  },
  {
    id: 'support',
    num: '04',
    name: 'Lighthouse Beacon',
    shortName: 'Support Beacon',
    subtitle: 'Emergency & Clinical',
    tagline: '24/7 National Helplines & MJCET Counseling',
    description:
      'Immediate, confidential access to Government of India toll-free crisis lines (14446 / 14416), licensed psychological counselors, and rehabilitation directories.',
    route: '/support',
    accentColor: '#0284C7',
    badgeColor: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
    position: [3.3, 0.35, -1.6],
    pinOffset: [0, 1.68, 0],
    cameraPos: [2.8, 1.6, 2.8],
    cameraTarget: [3.3, 0.75, -1.6],
  },
];
