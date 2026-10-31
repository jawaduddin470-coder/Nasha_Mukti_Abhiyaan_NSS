/**
 * Quiz Leaderboard & Champions Board Data Types
 * NSS MJCET Nasha Mukti Abhiyaan
 */

export interface LeaderboardEntryPublic {
  rank: number;
  attemptId: string;
  participantName: string;
  participantInstitution: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeTakenSeconds?: number | null;
  timeFormatted: string;
  badgeName: string;
  submittedAt: string;
}

export interface LeaderboardPublicResponse {
  quizId: string;
  quizTitle: string;
  quizSlug: string;
  isPublished: boolean;
  status: 'coming_soon' | 'published';
  message: string;
  supportingText: string;
  announcementDate?: string | null;
  customNote?: string | null;
  showPublicNames: boolean;
  highlightTopThree: boolean;
  totalParticipants: number;
  publishedAt?: string | null;
  entries: LeaderboardEntryPublic[];
}

export interface LeaderboardSummaryItem {
  quizId: string;
  quizTitle: string;
  quizSlug: string;
  isPublished: boolean;
  status: 'coming_soon' | 'published';
  totalParticipants: number;
  announcementDate?: string | null;
}

export interface LeaderboardEntryAdmin {
  rank: number;
  attemptId: string;
  participantName: string;
  participantEmail: string;
  participantInstitution: string;
  rollNumber?: string;
  phone?: string;
  department?: string;
  yearOfStudy?: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeTakenSeconds?: number | null;
  timeFormatted: string;
  badgeName: string;
  submittedAt: string;
}

export interface LeaderboardAdminResponse {
  quizId: string;
  quizTitle: string;
  quizSlug: string;
  isPublished: boolean;
  status: 'draft' | 'published';
  publishedAt?: string | null;
  publishedBy?: string | null;
  announcementDate?: string | null;
  showPublicNames: boolean;
  highlightTopThree: boolean;
  customNote?: string | null;
  totalParticipants: number;
  entries: LeaderboardEntryAdmin[];
  stats: {
    totalParticipants?: number;
    highestScore?: number;
    averageScore?: number;
    passedCount?: number;
    passingRate?: number;
  };
}

export interface LeaderboardSettingsUpdate {
  announcementDate?: string;
  showPublicNames?: boolean;
  highlightTopThree?: boolean;
  customNote?: string;
}

export interface AttemptOverrideRequest {
  score?: number;
  timeTakenSeconds?: number;
  participantName?: string;
  notes?: string;
}
