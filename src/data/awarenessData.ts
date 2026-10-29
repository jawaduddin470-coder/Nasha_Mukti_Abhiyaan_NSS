import {
  AwarenessPillar,
  MythVsFact,
  WarningSignGroup,
  InteractiveScenario,
  SupportPathwayStep,
} from '../types/awareness';

export const AWARENESS_PILLARS: AwarenessPillar[] = [
  {
    id: 'pillar-neurobiology',
    title: 'The Science of Dependency',
    shortTag: 'Neurobiology',
    tagline: 'Understanding substance impact on the brain is the first step toward lasting freedom.',
    summary:
      'Substance dependence is a complex, treatable health condition that alters neural pathways governing reward, impulse control, and memory. It is neither a lack of character nor a personal failing.',
    detailedPoints: [
      'Dopamine hijacking: Substances artificially flood neural receptors, blunting natural satisfaction from everyday achievements and connections.',
      'Tolerance escalation: Over time, the brain demands higher doses simply to maintain neurochemical equilibrium.',
      'Treatability: Neuroplasticity allows the brain to heal, rebuild neural pathways, and regain emotional balance with structured support.',
    ],
    keyTakeaway: 'Dependence is a medical condition requiring understanding, not stigma.',
    category: 'substance_education',
  },
  {
    id: 'pillar-peer-dynamics',
    title: 'Navigating Peer Dynamics',
    shortTag: 'Campus Culture',
    tagline: 'True strength lies in personal agency and supporting friends to make conscious choices.',
    summary:
      'College life introduces intense academic demands, newfound independence, and social environments where substances are sometimes normalized as stress relievers or social lubricants.',
    detailedPoints: [
      'Deconstructing normalcy: Research consistently proves that the majority of college students choose healthy, substance-free lifestyles.',
      'Reframing boundary-setting: Saying "No" is a demonstration of clarity, self-respect, and maturity that earns genuine respect.',
      'Active bystander intervention: Looking out for a peer who feels overwhelmed can prevent irreversible harm.',
    ],
    keyTakeaway: 'You define your college journey; peer pressure loses power when confidence leads.',
    category: 'peer_influence',
  },
  {
    id: 'pillar-stress-management',
    title: 'Engineering Resilience Without Substances',
    shortTag: 'Coping Mechanisms',
    tagline: 'High-performance engineering requires sustainable mental stamina and constructive outlets.',
    summary:
      'Academic pressure, exam anxiety, and career uncertainty are real challenges. Using temporary chemical escapes only compounds anxiety and diminishes cognitive performance.',
    detailedPoints: [
      'Sustainable stamina: Physical fitness, regular sleep hygiene, and mindfulness restore executive brain function far better than stimulants or depressants.',
      'Creative outlets: Hackathons, community service through NSS, technical clubs, and sports provide natural, lasting dopamine surges.',
      'Early decompression: Talking openly with mentors or counselors before stress turns chronic prevents self-medication.',
    ],
    keyTakeaway: 'Build constructive coping mechanisms today for lifelong professional stamina.',
    category: 'mental_wellbeing',
  },
  {
    id: 'pillar-pathway-recovery',
    title: 'The Pathway to Recovery & Care',
    shortTag: 'Rehabilitation',
    tagline: 'Every journey to recovery starts with a single honest conversation.',
    summary:
      'Recovery is not an isolated event; it is a collaborative, dignified journey supported by medical guidance, empathetic counseling, and trusted community networks.',
    detailedPoints: [
      'Confidential support: Reaching out does not jeopardize your academic standing or personal reputation.',
      'Holistic healing: Modern recovery protocols address the underlying emotional distress, not just the physical symptoms.',
      'Community solidarity: The NSS MJCET peer network stands ready to connect students with verified medical resources without judgment.',
    ],
    keyTakeaway: 'You are never alone. Professional, compassionate help is always within reach.',
    category: 'recovery_support',
  },
];

export const MYTHS_VS_FACTS: MythVsFact[] = [
  {
    id: 'myth-1',
    myth: '"Substances are just a harmless way to unwind during stressful exam weeks."',
    fact: 'Substances disrupt REM sleep architecture and impair working memory, directly sabotaging academic and problem-solving performance.',
    clinicalContext:
      'Neurochemical studies show that reliance on substances during acute stress decreases neural adaptability and triggers rebound anxiety.',
  },
  {
    id: 'myth-2',
    myth: '"People who develop dependence simply lack discipline or willpower."',
    fact: 'Substance use disorder is recognized globally by the WHO as a medical condition involving genetic, physiological, and environmental factors.',
    clinicalContext:
      'Continued substance exposure physically modifies receptor sensitivity in the prefrontal cortex, transforming conscious choice into compulsive urges that require medical intervention.',
  },
  {
    id: 'myth-3',
    myth: '"I can try it once or twice recreationally without any real risk of habituation."',
    fact: 'Certain substances induce severe neuroadaptation rapidly; even occasional experimentation can trigger hidden genetic predispositions.',
    clinicalContext:
      'Adolescent and young adult brains continue developing until age 25, making youth uniquely susceptible to lasting chemical habituation.',
  },
  {
    id: 'myth-4',
    myth: '"Approaching a counselor or helpline will lead to disciplinary punishment on campus."',
    fact: 'Institutional support and national helplines maintain strict professional confidentiality and are dedicated entirely to well-being.',
    clinicalContext:
      'National helplines (such as 14446 and Tele-MANAS) are completely anonymous, confidential, and focused strictly on medical guidance.',
  },
];

export const WARNING_SIGNS: WarningSignGroup[] = [
  {
    category: 'Behavioral & Academic',
    signs: [
      'Sudden drop in class attendance or chronic neglect of laboratory assignments',
      'Unexplained withdrawal from previously enjoyed student clubs or sports activities',
      'Extreme secrecy regarding whereabouts, schedule changes, or new social groups',
      'Frequent requests for financial loans without plausible explanations',
    ],
    recommendedResponse:
      'Initiate a private, calm check-in without accusations. Express concern for their overall wellbeing rather than focusing solely on grades.',
  },
  {
    category: 'Physical & Emotional',
    signs: [
      'Noticeable shifts in sleep schedules, extreme lethargy, or sudden periods of hyperactivity',
      'Unusual mood fluctuations, heightened irritability, or uncharacteristic defensiveness',
      'Deterioration in personal grooming, hygiene, or general physical vitality',
      'Bloodshot eyes, sudden weight loss, or persistent tremors',
    ],
    recommendedResponse:
      'Provide a non-judgmental listening ear. Recommend consulting a campus medical officer or a confidential wellness counselor.',
  },
  {
    category: 'Social & Interpersonal',
    signs: [
      'Drifting away from longstanding friends toward an insular, substance-oriented circle',
      'Defensive hostility when asked simple questions about wellness or leisure activities',
      'Diminished empathy and heightened interpersonal friction with peers and family',
    ],
    recommendedResponse:
      'Do not isolate the individual. Involve trusted student mentors or contact a professional helpline collaboratively.',
  },
];

/**
 * Stage C: Interactive Decision Scenarios
 */
export const INTERACTIVE_SCENARIOS: InteractiveScenario[] = [
  {
    id: 'scenario-exam-crunch',
    title: 'The Late-Night Project Crunch',
    tag: 'Academic Stress',
    situation:
      'It is 2:00 AM before a major semester project submission. A senior or teammate offers an unprescribed pharmaceutical stimulant or synthetic vape, claiming "it is the only way our batch stays awake and clears the viva."',
    options: [
      {
        id: 'opt-accept',
        label: 'Accept to stay awake for the deadline',
        isConstructive: false,
        responseTitle: 'The Illusion of Short-Term Gain',
        analysis:
          'Unprescribed stimulants trigger sharp sympathetic nervous system overdrive, followed by severe acute cognitive crash. REM deprivation blunts working memory during the actual viva, and introduces chemical tolerance pathways.',
        healthyAlternative:
          'A 20-minute strategic power nap plus hydration restores prefrontal executive focus far more effectively than neurochemical stimulants.',
      },
      {
        id: 'opt-assertive',
        label: 'Assertively decline and set clear boundaries',
        isConstructive: true,
        responseTitle: 'Clarity and Sovereign Control',
        analysis:
          'Setting calm personal boundaries commands immediate authentic respect. It removes social ambiguity and often encourages hesitant peers in the room to follow suit.',
        practicalScript:
          '"No thanks, I work best on green tea and clean focus. Let’s split the remaining modules and power through together."',
        healthyAlternative:
          'Pomodoro intervals (25m deep work + 5m physical stretching) to keep neural circuits sharp without chemical interference.',
      },
      {
        id: 'opt-collaborative',
        label: 'Suggest a healthy collective sprint review',
        isConstructive: true,
        responseTitle: 'Peer Leadership in Action',
        analysis:
          'Redirecting the entire group’s energy toward realistic scope management defuses artificial panic. You transform a high-pressure crisis into team solidarity.',
        practicalScript:
          '"Let’s pause for 10 minutes, grab cold water, prioritize the core test cases, and submit a rock-solid stable build."',
        healthyAlternative:
          'Collaborative sprint triage: eliminating non-essential code embellishments to safeguard sleep hygiene.',
      },
    ],
  },
  {
    id: 'scenario-social-pressure',
    title: 'The Off-Campus Gathering',
    tag: 'Social Coercion',
    situation:
      'At a private weekend gathering celebrating the end of midterms, alcohol or illicit substances are being passed around. A prominent peer hands you a glass and says: "Come on, don’t kill the mood—everyone is letting loose tonight."',
    options: [
      {
        id: 'opt-compromise',
        label: 'Take it to avoid awkward social friction',
        isConstructive: false,
        responseTitle: 'The Cost of Conforming',
        analysis:
          'Giving in to avoid temporary discomfort compromises your personal sovereignty and establishes an expectation that future boundaries can also be overridden.',
        healthyAlternative:
          'Holding your own glass with a non-alcoholic beverage eliminates 90% of pushy social offers without saying a word.',
      },
      {
        id: 'opt-exit-script',
        label: 'Deliver a relaxed, definitive response',
        isConstructive: true,
        responseTitle: 'Effortless Self-Assurance',
        analysis:
          'Calm, matter-of-fact confidence completely dissolves peer pressure. Genuine friends quickly move on to conversation topics that actually matter.',
        practicalScript:
          '"I’m good with my tonic water tonight—driving early tomorrow morning. Cheers though!"',
        healthyAlternative:
          'Taking ownership of designated driver or event coordinator roles provides high social esteem with zero pressure.',
      },
      {
        id: 'opt-change-environment',
        label: 'Step outside or shift toward a constructive conversation circle',
        isConstructive: true,
        responseTitle: 'Active Environmental Management',
        analysis:
          'Recognizing an unsupportive environment and relocating to peers engaged in music, gaming, or authentic conversation protects your peace effortlessly.',
        practicalScript:
          '"I’m heading out to the terrace for fresh air—who wants to catch the music track?"',
        healthyAlternative:
          'Channeling celebratory energy into campus sports tournaments, LAN gaming, or midnight food runs.',
      },
    ],
  },
  {
    id: 'scenario-burnout-anxiety',
    title: 'Navigating Chronic Burnout',
    tag: 'Mental Wellbeing',
    situation:
      'Persistent academic anxiety, sleeplessness, and fear of campus placement failures have left you emotionally exhausted for weeks. You feel an urge to find a quick chemical escape to numb the constant internal static.',
    options: [
      {
        id: 'opt-isolate',
        label: 'Isolate yourself and self-medicate quietly',
        isConstructive: false,
        responseTitle: 'The Trap of Chemical Numbing',
        analysis:
          'Self-medication treats emotional distress as a problem to be smothered rather than addressed. It accelerates tolerance and converts temporary fatigue into deep clinical dependency.',
        healthyAlternative:
          'Dialing a toll-free counselor (14446 or Tele-MANAS 14416) allows you to untangle academic stress confidentially without shame.',
      },
      {
        id: 'opt-counselor',
        label: 'Access free, confidential psychological guidance',
        isConstructive: true,
        responseTitle: 'True Courage in Action',
        analysis:
          'Speaking with an accredited psychologist breaks the mental feedback loop. It carries zero academic penalty, zero disciplinary record, and equips you with lifelong cognitive tools.',
        practicalScript:
          '"I’ve been carrying heavy fatigue lately. I’d like to book 30 minutes with the wellness officer or speak with Tele-MANAS."',
        healthyAlternative:
          'Structured cognitive behavioral techniques, sleep therapy, and academic pacing consultations.',
      },
      {
        id: 'opt-mentor',
        label: 'Confide in an NSS coordinator or trusted faculty mentor',
        isConstructive: true,
        responseTitle: 'Rebuilding Campus Support',
        analysis:
          'Mentors have guided hundreds of engineering students through placement stress and burnout. You will discover your struggles are shared and completely surmountable.',
        practicalScript:
          '"Sir/Madam, I’m experiencing heavy burnout this semester and would appreciate guidance on balancing my workload."',
        healthyAlternative:
          'Participating in NSS community outreach—giving back creates deep neurological purpose and natural mood elevation.',
      },
    ],
  },
];

/**
 * Stage D: Support Pathway Guidelines
 */
export const SELF_SUPPORT_STEPS: SupportPathwayStep[] = [
  {
    stepNumber: '01',
    title: 'Acknowledge Without Self-Blame',
    description:
      'Recognize that feeling overwhelmed or dependent is a neurological health condition, not an ethical flaw. Disarming internal shame is the foundation of genuine recovery.',
    keyTip: 'You are worthy of support regardless of how long you have struggled.',
    iconName: 'heart',
  },
  {
    stepNumber: '02',
    title: 'Use 100% Confidential Channels',
    description:
      'Connect with accredited professionals via National Helpline 14446 or Tele-MANAS 14416. Calls are free, anonymous, and operate 24/7 without campus involvement.',
    keyTip: 'No academic records, roll numbers, or personal disclosures are required.',
    iconName: 'phone',
  },
  {
    stepNumber: '03',
    title: 'Enlist One Trusted Human Anchor',
    description:
      'Confide in a trusted roommate, NSS student volunteer, or faculty counselor. Having one person know your intention to stay healthy anchors your accountability.',
    keyTip: 'Recovery thrives in compassionate connection, never in isolation.',
    iconName: 'users',
  },
];

export const PEER_SUPPORT_GUIDELINES = [
  {
    principle: 'Choose a Private, Grounded Setting',
    guidance:
      'Never bring up concerns in front of a social group or when either of you is under stress or intoxication. Speak one-on-one in a neutral, calm space.',
    dialogueStarter: '"Hey, I value our friendship and wanted to check in quietly—how have you really been feeling lately?"',
  },
  {
    principle: 'Describe Concrete Observations, Not Labels',
    guidance:
      'Avoid accusatory words like "addict" or "irresponsible." Focus on specific behavioral changes you have witnessed with warmth.',
    dialogueStarter: '"I noticed you seemed really exhausted after labs recently and missed a couple of classes. I just want to make sure you’re okay."',
  },
  {
    principle: 'Listen With Empathetic Stillness',
    guidance:
      'Do not interrupt with unsolicited lectures or moral advice. Allow them to speak without fear of judgment or panic.',
    dialogueStarter: '"You don’t have to go through this alone. I’m here to listen, whatever it is."',
  },
  {
    principle: 'Offer Collaborative Next Steps',
    guidance:
      'Empower them to take the next step. Offer to sit beside them while they dial 14446, or walk together to the campus wellness center.',
    dialogueStarter: '"Would you like me to sit with you while we call the confidential toll-free counselor together?"',
  },
];
