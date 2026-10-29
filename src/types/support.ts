/**
 * Verified Support & Resource Data Types
 */

export type HelplineType = 'national_tollfree' | 'tele_manas' | 'mental_health' | 'campus_guidance';

export interface HelplineResource {
  id: string;
  name: string;
  shortCode?: string;
  primaryNumber: string;
  alternateNumber?: string;
  governingBody: string;
  hours: string;
  cost: 'Toll-Free' | 'Standard Call';
  type: HelplineType;
  languages: string[];
  description: string;
  isVerified: boolean;
  officialPortalUrl?: string;
}

export interface SupportActionStep {
  stepNumber: number;
  title: string;
  description: string;
  guideline: string;
}
