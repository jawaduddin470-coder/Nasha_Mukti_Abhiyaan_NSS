import { Quiz, QuizCategory } from '../types/quiz';

export const QUIZ_CATEGORY_METADATA: Record<
  QuizCategory,
  { label: string; shortTag: string; description: string; accentColor: string }
> = {
  substance_risks: {
    label: 'Understanding Substance Risks',
    shortTag: 'Science & Risks',
    description: 'Clinical facts on chemical habituation, neurobiology, and tolerance development.',
    accentColor: '#EA580C', // Saffron
  },
  myths_and_facts: {
    label: 'Addiction Myths vs Facts',
    shortTag: 'Clinical Realities',
    description: 'Dismantling widespread social misconceptions with evidence-based medicine.',
    accentColor: '#0284C7', // Sky Blue
  },
  substance_facts: {
    label: 'Substance Facts & Realities',
    shortTag: 'Clinical Realities',
    description: 'Evidence-based clinical perspectives on addiction, chemical tolerance, and health.',
    accentColor: '#0284C7', // Sky Blue
  },
  health_impacts: {
    label: 'Biological & Health Impacts',
    shortTag: 'Health Science',
    description: 'Clinical impacts on neuro-chemistry, cardiovascular systems, and somatic organs.',
    accentColor: '#EA580C', // Saffron
  },
  legal_social: {
    label: 'Legal & Institutional Policies',
    shortTag: 'Legal & Campus Rules',
    description: 'Institutional codes of conduct, NDPS laws, and student rights.',
    accentColor: '#4F46E5', // Indigo
  },
  rehabilitation: {
    label: 'Recovery & Rehabilitation',
    shortTag: 'Clinical Care',
    description: 'Evidence-based de-addiction therapies, psychiatric support, and sustained wellness.',
    accentColor: '#0F766E', // Teal
  },
  peer_pressure: {
    label: 'Peer Pressure & Agency',
    shortTag: 'Personal Agency',
    description: 'Navigating collegiate social environments with dignity and firm boundaries.',
    accentColor: '#15803D', // NSS Green
  },
  healthy_coping: {
    label: 'Healthy Coping Strategies',
    shortTag: 'Wellness Alternatives',
    description: 'Sustainable, non-chemical alternatives for exam pressure and emotional stress.',
    accentColor: '#D97706', // Amber
  },
  seeking_help: {
    label: 'Supporting a Peer & Seeking Help',
    shortTag: 'Care Pathways',
    description: 'De-escalation protocols, active listening, and safe intervention strategies.',
    accentColor: '#4F46E5', // Indigo
  },
  campaign_goals: {
    label: 'Nasha Mukti Abhiyaan Mission',
    shortTag: 'Institutional Mission',
    description: 'National initiatives, verified toll-free helplines, and collegiate solidarity.',
    accentColor: '#0F766E', // Teal
  },
};

export function getQuizCategoryMeta(category?: string): {
  label: string;
  shortTag: string;
  description: string;
  accentColor: string;
} {
  if (category && QUIZ_CATEGORY_METADATA[category as QuizCategory]) {
    return QUIZ_CATEGORY_METADATA[category as QuizCategory];
  }
  const normalized = category?.toLowerCase().trim().replace(/[- ]/g, '_');
  if (normalized && QUIZ_CATEGORY_METADATA[normalized as QuizCategory]) {
    return QUIZ_CATEGORY_METADATA[normalized as QuizCategory];
  }
  return {
    label: category ? category.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'General Awareness',
    shortTag: category ? category.replace(/[-_]/g, ' ').toUpperCase() : 'AWARENESS',
    description: 'Evidence-based collegiate substance awareness and prevention education.',
    accentColor: '#159E9A',
  };
}

export const SAMPLE_AWARENESS_QUIZ: Quiz = {
  id: 'nmba-awareness-challenge-v1',
  title: 'Campus Awareness & Resilience Challenge',
  slug: 'campus-awareness-challenge',
  description:
    'An interactive, evidence-based challenge exploring chemical dependency science, myth-busting, respectful bystander support, and verified care helplines across Osmania University and Telangana.',
  estimatedMinutes: 6,
  status: 'published',
  version: 1,
  createdAt: '2026-10-28T00:00:00Z',
  updatedAt: '2026-10-28T00:00:00Z',
  settings: {
    passingScorePercentage: 70,
    allowRetake: true,
    randomizeQuestions: false,
    randomizeOptions: false,
    showExplanationsAtEnd: true,
    timeLimitMinutes: 10,
    requireRollNumber: true,
    requirePhoneNumber: true,
    requireDepartment: true,
    requireYearOfStudy: true,
    allowAgeRange: false,
  },
  questions: [
    {
      id: 'q1',
      order: 1,
      category: 'myths_and_facts',
      type: 'single',
      points: 10,
      text: 'Which of the following statements reflects the clinical consensus of modern neurobiology regarding substance dependence?',
      options: [
        {
          id: 'q1_o1',
          text: 'Dependence is primarily a moral defect or lack of personal discipline that can be resolved solely by willpower.',
        },
        {
          id: 'q1_o2',
          text: 'Dependence is a chronic, manageable medical condition altering dopamine receptors and prefrontal neural circuits.',
        },
        {
          id: 'q1_o3',
          text: 'Only individuals who consume substances continuously for several years can develop physiological tolerance.',
        },
        {
          id: 'q1_o4',
          text: 'Occasional high-dosage consumption poses zero risk to collegiate academic performance or emotional stability.',
        },
      ],
      correctAnswerIds: ['q1_o2'],
      explanation:
        'The World Health Organization (WHO) and clinical neuroscience classify substance dependence as a chronic, treatable neurobiological disorder affecting dopamine pathways and executive decision-making circuits—not a moral defect.',
    },
    {
      id: 'q2',
      order: 2,
      category: 'substance_risks',
      type: 'boolean',
      points: 10,
      text: 'True or False: Using unprescribed pharmaceutical stimulants or "study drugs" during exam crunch week carries minimal risk if discontinued immediately after the exams conclude.',
      options: [
        { id: 'q2_true', text: 'True' },
        { id: 'q2_false', text: 'False' },
      ],
      correctAnswerIds: ['q2_false'],
      explanation:
        'False. Unprescribed stimulant consumption without medical supervision can trigger acute cardiovascular strain, severe rebound anxiety, sleep disruption, and rapid receptor tolerance, impairing rather than aiding sustained academic cognitive performance.',
    },
    {
      id: 'q3',
      order: 3,
      category: 'peer_pressure',
      type: 'single',
      points: 10,
      text: 'At an off-campus hostel gathering, a senior offers you a synthetic substance, stating: "Everyone in the batch takes this to loosen up; don\'t be boring." What is the most constructive response demonstrating personal agency?',
      options: [
        {
          id: 'q3_o1',
          text: 'Accept a small amount to avoid awkward confrontation, planning to secretly discard it later.',
        },
        {
          id: 'q3_o2',
          text: 'Firmly state: "I don\'t use that, but I\'m here for the music," and redirect the conversation without moralizing.',
        },
        {
          id: 'q3_o3',
          text: 'Aggressively lecture the senior in front of the group about campus disciplinary bylaws.',
        },
        {
          id: 'q3_o4',
          text: 'Pretend to feel faint and run out of the building in panic.',
        },
      ],
      correctAnswerIds: ['q3_o2'],
      explanation:
        'Evidence-based refusal communication demonstrates that a firm, concise, non-apologetic refusal combined with a social bridge (e.g. "Not for me, but I\'m here for the project") neutralizes peer coercion effectively without escalating interpersonal tension.',
    },
    {
      id: 'q4',
      order: 4,
      category: 'healthy_coping',
      type: 'single',
      points: 10,
      text: 'When faced with prolonged engineering coursework deadlines and severe mental fatigue, which non-pharmacological strategy offers the most sustainable restoration of cognitive clarity and baseline dopamine?',
      options: [
        {
          id: 'q4_o1',
          text: 'Continuous consumption of high-caffeine energy beverages throughout 36-hour sleepless periods.',
        },
        {
          id: 'q4_o2',
          text: 'Structured 90-minute study blocks paired with brief brisk walks, hydration, and 7–8 hours of restorative sleep.',
        },
        {
          id: 'q4_o3',
          text: 'Total social withdrawal and skipping meals to maximize solitary screen time.',
        },
        {
          id: 'q4_o4',
          text: 'Self-medicating with over-the-counter sedatives to force immediate daytime naps.',
        },
      ],
      correctAnswerIds: ['q4_o2'],
      explanation:
        'Cognitive science confirms that alternating deep work intervals with physical aerobic movement and maintaining consistent circadian sleep resets prefrontal adenosine levels and stabilizes neural dopamine synthesis without crash cycles.',
    },
    {
      id: 'q5',
      order: 5,
      category: 'seeking_help',
      type: 'single',
      points: 10,
      text: 'You notice your lab partner has become increasingly withdrawn, missing morning lectures and showing acute hand tremors. How should you initiate a supportive conversation?',
      options: [
        {
          id: 'q5_o1',
          text: 'Directly accuse them of chemical misuse in the department hallway to force a public confession.',
        },
        {
          id: 'q5_o2',
          text: 'Privately approach them with open empathy: "I\'ve noticed you seem carrying heavy stress lately; I care and I\'m here if you want to talk."',
        },
        {
          id: 'q5_o3',
          text: 'Quietly report their symptoms to the university examination disciplinary board without speaking to them.',
        },
        {
          id: 'q5_o4',
          text: 'Ignore the signs completely, assuming adult students must handle personal crises in total isolation.',
        },
      ],
      correctAnswerIds: ['q5_o2'],
      explanation:
        'Effective peer intervention begins with confidential, observable, non-judgmental expressions of care. Framing the dialogue around wellness and stress prevents defensiveness and opens the door for professional health consultation.',
    },
    {
      id: 'q6',
      order: 6,
      category: 'campaign_goals',
      type: 'single',
      points: 10,
      text: 'What is the official Government of India 24/7 toll-free helpline number dedicated specifically to confidential drug de-addiction consultation and rehabilitation guidance under the Nasha Mukt Bharat Abhiyaan?',
      options: [
        { id: 'q6_o1', text: '100' },
        { id: 'q6_o2', text: '14446' },
        { id: 'q6_o3', text: '1098' },
        { id: 'q6_o4', text: '1900' },
      ],
      correctAnswerIds: ['q6_o2'],
      explanation:
        '14446 is the official 24/7 National Toll-Free Drug De-Addiction Helpline operated under the Ministry of Social Justice and Empowerment, providing confidential multi-lingual counseling, family guidance, and rehabilitation referral.',
    },
    {
      id: 'q7',
      order: 7,
      category: 'seeking_help',
      type: 'multiple',
      points: 10,
      text: 'Select ALL constructive actions an active bystander should take if a peer appears severely disoriented, unresponsive, or experiencing an acute substance crisis at a campus event: (Select all that apply)',
      options: [
        {
          id: 'q7_o1',
          text: 'Immediately summon campus emergency medical response or transport them to the nearest hospital casualty ward.',
        },
        {
          id: 'q7_o2',
          text: 'Place them in the recovery position (on their side) to keep their airway clear and prevent aspiration.',
        },
        {
          id: 'q7_o3',
          text: 'Force them to consume large quantities of hot coffee or slap their face repeatedly to "sober them up".',
        },
        {
          id: 'q7_o4',
          text: 'Stay beside them continuously, monitoring breathing until trained healthcare professionals take over.',
        },
      ],
      correctAnswerIds: ['q7_o1', 'q7_o2', 'q7_o4'],
      explanation:
        'Critical medical protocol mandates placing an unresponsive person in the recovery position, securing emergency medical care immediately, and monitoring respiration continuously. Forcing food, liquids, or hot coffee can induce lethal airway choking.',
    },
    {
      id: 'q8',
      order: 8,
      category: 'campaign_goals',
      type: 'single',
      points: 10,
      text: 'What is the foundational philosophy of the NSS MJCET Nasha Mukti Abhiyaan campaign regarding youth substance awareness?',
      options: [
        {
          id: 'q8_o1',
          text: 'Shaming and penalizing struggling students to deter others from chemical experimentation.',
        },
        {
          id: 'q8_o2',
          text: 'Fostering collective solidarity, evidence-based education, destigmatized support, and active student mentorship.',
        },
        {
          id: 'q8_o3',
          text: 'Restricting awareness workshops exclusively to graduating senior students who request them.',
        },
        {
          id: 'q8_o4',
          text: 'Focusing solely on digital banners without facilitating peer dialogue or campus community drives.',
        },
      ],
      correctAnswerIds: ['q8_o2'],
      explanation:
        'NSS MJCET champions an inclusive, empathetic community culture: "Every choice shapes a future." The campaign centers scientific literacy, dignified non-judgmental guidance, peer circles, and accessible professional care.',
    },
  ],
};
