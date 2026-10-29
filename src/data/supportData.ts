import { HelplineResource, SupportActionStep } from '../types/support';

export const VERIFIED_HELPLINES: HelplineResource[] = [
  {
    id: 'hl-national-deaddiction',
    name: 'National Toll-Free Drug De-Addiction Helpline',
    shortCode: '14446',
    primaryNumber: '14446',
    governingBody: 'Ministry of Social Justice and Empowerment, Government of India',
    hours: '24 Hours / 7 Days a week',
    cost: 'Toll-Free',
    type: 'national_tollfree',
    languages: ['Hindi', 'English', 'Telugu', 'Urdu', 'and regional Indian languages'],
    description:
      'Official Government of India national helpline providing anonymous, confidential counseling, clinical referral, and rehabilitation guidance for individuals and concerned family members.',
    isVerified: true,
    officialPortalUrl: 'https://socialjustice.gov.in',
  },
  {
    id: 'hl-tele-manas',
    name: 'Tele-MANAS (National Tele Mental Health Programme)',
    shortCode: '14416',
    primaryNumber: '14416',
    alternateNumber: '1800-891-4416',
    governingBody: 'Ministry of Health and Family Welfare, Government of India',
    hours: '24 Hours / 7 Days a week',
    cost: 'Toll-Free',
    type: 'tele_manas',
    languages: ['English', 'Hindi', 'Telugu', 'Urdu', 'and 20+ recognized Indian languages'],
    description:
      'Comprehensive national mental health tele-consultation platform connecting callers with certified clinical psychologists, psychiatric social workers, and medical professionals across India.',
    isVerified: true,
    officialPortalUrl: 'https://telemanas.mohfw.gov.in',
  },
  {
    id: 'hl-kiran-msje',
    name: 'KIRAN 24/7 Mental Health Rehabilitation Helpline',
    shortCode: '1800-599-0019',
    primaryNumber: '1800-599-0019',
    governingBody: 'Department of Empowerment of Persons with Disabilities, MSJE, Govt of India',
    hours: '24 Hours / 7 Days a week',
    cost: 'Toll-Free',
    type: 'mental_health',
    languages: ['Hindi', 'English', 'Telugu', 'and 13 regional languages'],
    description:
      'Dedicated helpline providing early screening, first-aid psychological support, distress management, and psychological crisis intervention by qualified mental health experts.',
    isVerified: true,
    officialPortalUrl: 'https://depwd.gov.in',
  },
  {
    id: 'hl-mjcet-counseling',
    name: 'MJCET Student Welfare & Counseling Guidance Desk',
    shortCode: 'Campus Cell',
    primaryNumber: '+91 (040) 2335-0134',
    governingBody: 'Muffakham Jah College of Engineering and Technology, Hyderabad',
    hours: '09:30 AM - 04:30 PM IST (Academic Working Days)',
    cost: 'Standard Call',
    type: 'campus_guidance',
    languages: ['English', 'Telugu', 'Urdu', 'Hindi'],
    description:
      'On-campus confidential advisory and student welfare service located within the college campus. Provides discrete emotional guidance, academic stress counseling, and referrals to trusted medical practitioners.',
    isVerified: true,
    officialPortalUrl: 'https://mjcollege.ac.in',
  },
];

export const ACTION_STEPS_FOR_SELF: SupportActionStep[] = [
  {
    stepNumber: 1,
    title: 'Acknowledge Without Self-Judgment',
    description:
      'Recognize that feeling overwhelmed or caught in an unhealthy habit is not a character flaw. Taking a moment of honest self-reflection is the most courageous step you can make.',
    guideline: 'Give yourself permission to prioritize your health over social pressure or academic anxiety.',
  },
  {
    stepNumber: 2,
    title: 'Connect with a Confidential Resource',
    description:
      'Dial national toll-free helpline 14446 or Tele-MANAS (14416). These calls are strictly anonymous, free of charge, and handled by trained clinical professionals.',
    guideline: 'You do not need to share your identity or college details unless you choose to do so.',
  },
  {
    stepNumber: 3,
    title: 'Confide in One Trusted Individual',
    description:
      'Choose one supportive person—a close friend, an NSS mentor, an understanding professor, or a family member. Vocalizing your intention to stay healthy removes the burden of isolation.',
    guideline: 'Having even one non-judgmental ally drastically accelerates positive momentum.',
  },
  {
    stepNumber: 4,
    title: 'Establish Healthy Daily Anchors',
    description:
      'Replace chemical habits with structured routines: regular physical exertion, balanced nutrition, consistent sleep cycles, and participation in active campus communities like NSS.',
    guideline: 'Small, repeated positive actions gradually rewire dopamine pathways for lasting mental clarity.',
  },
];

export const ACTION_STEPS_FOR_FRIENDS: SupportActionStep[] = [
  {
    stepNumber: 1,
    title: 'Observe Patterns with Compassion',
    description:
      'Notice gradual behavioral shifts, changes in attendance, withdrawal from friend circles, or sudden mood alterations without assuming moral failure or reacting aggressively.',
    guideline: 'Approach from a position of care and concern rather than interrogation or anger.',
  },
  {
    stepNumber: 2,
    title: 'Choose a Calm, Private Moment',
    description:
      'Talk to your friend one-on-one in a neutral, relaxed setting where they will not feel exposed or cornered in front of a peer group.',
    guideline: 'Use "I" statements: "I care about you and I noticed you seem stressed lately," rather than "You have a problem."',
  },
  {
    stepNumber: 3,
    title: 'Offer Information, Not Ultimata',
    description:
      'Share the verified helpline numbers (14446 or Tele-MANAS 14416) or offer to accompany them to the campus counseling desk. Keep the decision in their hands.',
    guideline: 'Support their agency. Forcing an outcome often triggers defensive withdrawal.',
  },
  {
    stepNumber: 4,
    title: 'Know When to Escalate Safely',
    description:
      'If you believe a friend is experiencing acute physical distress, severe overdose symptoms, or active crisis, immediately contact emergency medical services or college authorities.',
    guideline: 'Student safety always supersedes social confidentiality during medical emergencies.',
  },
];
