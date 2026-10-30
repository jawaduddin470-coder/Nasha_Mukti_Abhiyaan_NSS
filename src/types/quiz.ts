/**
 * Awareness Quiz Types & Data Models
 * Prepared for Phase 4B Frontend & Phase 5 MongoDB/Firebase Backend Integration
 */

export type QuizCategory =
  | 'substance_risks'
  | 'myths_and_facts'
  | 'substance_facts'
  | 'health_impacts'
  | 'legal_social'
  | 'rehabilitation'
  | 'peer_pressure'
  | 'healthy_coping'
  | 'seeking_help'
  | 'campaign_goals';

export type QuestionType = 'single' | 'multiple' | 'boolean';

export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface QuizOption {
  id: string;
  text: string;
  explanation?: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  category: QuizCategory;
  type: QuestionType;
  options: QuizOption[];
  correctAnswerIds: string[];
  points: number;
  explanation: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  order: number;
}

export interface QuizSettings {
  passingScorePercentage: number; // e.g. 70
  allowRetake: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  showExplanationsAtEnd: boolean;
  timeLimitMinutes?: number;
  // Configurable registration fields
  requireRollNumber: boolean;
  requirePhoneNumber: boolean;
  requireDepartment: boolean;
  requireYearOfStudy: boolean;
  allowAgeRange: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  estimatedMinutes: number;
  status: PublicationStatus;
  settings: QuizSettings;
  questions: QuizQuestion[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface ParticipantRegistration {
  fullName: string;
  institutionName: string;
  rollNumber: string;
  email: string;
  phone: string;
  department?: string;
  yearOfStudy?: string;
  ageRange?: string;
  consentDataProcessing: boolean;
  consentFutureCommunications?: boolean;
}

export interface QuizRegistrationErrors {
  fullName?: string;
  institutionName?: string;
  rollNumber?: string;
  email?: string;
  phone?: string;
  department?: string;
  yearOfStudy?: string;
  consentDataProcessing?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIds: string[];
}

export interface QuestionResultDetail {
  questionId: string;
  questionText: string;
  category: QuizCategory;
  type: QuestionType;
  points: number;
  earnedPoints: number;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  isCorrect: boolean;
  options: QuizOption[];
  explanation: string;
}

export interface QuizResult {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  participantName: string;
  participantInstitution: string;
  submittedAt: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  badgeName: string;
  badgeDescription: string;
  summaryMessage: string;
  questionBreakdown: QuestionResultDetail[];
}

export interface AdminQuizStats {
  totalParticipants: number;
  averageScore: number;
  passingRatePercentage: number;
  topCategoryStrength: string;
  mostChallengingTopic: string;
  categoryBreakdown: Partial<Record<QuizCategory, { totalAttempts: number; averagePercentage: number }>>;
}
