/**
 * Awareness & Prevention Educational Data Types
 */

export type AwarenessCategory = 'substance_education' | 'mental_wellbeing' | 'peer_influence' | 'recovery_support';

export interface AwarenessPillar {
  id: string;
  title: string;
  shortTag: string;
  tagline: string;
  summary: string;
  detailedPoints: string[];
  keyTakeaway: string;
  category: AwarenessCategory;
}

export interface MythVsFact {
  id: string;
  myth: string;
  fact: string;
  clinicalContext: string;
}

export interface WarningSignGroup {
  category: 'Behavioral & Academic' | 'Physical & Emotional' | 'Social & Interpersonal';
  signs: string[];
  recommendedResponse: string;
}

export interface ScenarioOption {
  id: string;
  label: string;
  isConstructive: boolean;
  responseTitle: string;
  analysis: string;
  practicalScript?: string;
  healthyAlternative: string;
}

export interface InteractiveScenario {
  id: string;
  title: string;
  tag: string;
  situation: string;
  options: ScenarioOption[];
}

export interface SupportPathwayStep {
  stepNumber: string;
  title: string;
  description: string;
  keyTip: string;
  iconName: 'user' | 'phone' | 'shield' | 'heart' | 'users';
}
