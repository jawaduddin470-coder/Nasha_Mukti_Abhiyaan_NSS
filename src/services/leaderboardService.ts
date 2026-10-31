import { apiClient } from './apiClient';
import {
  LeaderboardPublicResponse,
  LeaderboardSummaryItem,
  LeaderboardAdminResponse,
  LeaderboardSettingsUpdate,
  AttemptOverrideRequest,
} from '../types/leaderboard';

/**
 * Quiz Leaderboard Service
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Communicates with FastAPI backend for official quiz leaderboard and rankings.
 */
class LeaderboardService {
  /**
   * Retrieves summary statuses for all public campaign quizzes.
   */
  async getPublicLeaderboards(): Promise<LeaderboardSummaryItem[]> {
    try {
      const data = await apiClient.get<LeaderboardSummaryItem[]>('/quiz/leaderboards');
      if (Array.isArray(data)) {
        return data;
      }
    } catch (err) {
      console.warn('Failed to load leaderboards summary from API:', err);
    }

    // Default fallback list
    return [
      {
        quizId: 'nmba-awareness-challenge-v1',
        quizTitle: 'Nasha Mukti Awareness Quiz',
        quizSlug: 'nasha-mukti-awareness',
        isPublished: false,
        status: 'coming_soon',
        totalParticipants: 0,
      },
      {
        quizId: 'national-unity-day-quiz-v1',
        quizTitle: 'National Unity Day Quiz',
        quizSlug: 'national-unity-day',
        isPublished: false,
        status: 'coming_soon',
        totalParticipants: 0,
      },
      {
        quizId: 'unified-nss-mjcet-leaderboard',
        quizTitle: 'Unified NSS MJCET Leaderboard',
        quizSlug: 'unified',
        isPublished: false,
        status: 'coming_soon',
        totalParticipants: 0,
      },
    ];
  }

  /**
   * Retrieves public leaderboard for a specific quiz or the unified leaderboard.
   * If unpublished, backend returns empty entries list and announcement text.
   */
  async getPublicLeaderboard(quizId: string): Promise<LeaderboardPublicResponse> {
    try {
      const data = await apiClient.get<LeaderboardPublicResponse>(`/quiz/leaderboard/${encodeURIComponent(quizId)}`);
      if (data && data.quizId) {
        return data;
      }
    } catch (err) {
      console.warn(`Failed to fetch public leaderboard for '${quizId}':`, err);
    }

    // Fallback safe coming soon state
    const isUnified = quizId.toLowerCase().includes('unified');
    const isUnity = quizId.toLowerCase().includes('unity');
    const title = isUnified
      ? 'Unified NSS MJCET Leaderboard'
      : isUnity
      ? 'National Unity Day Quiz'
      : 'Nasha Mukti Awareness Quiz';
    const slug = isUnified ? 'unified' : isUnity ? 'national-unity-day' : 'nasha-mukti-awareness';

    return {
      quizId,
      quizTitle: title,
      quizSlug: slug,
      isPublished: false,
      status: 'coming_soon',
      message: 'RESULTS TO BE ANNOUNCED SOON',
      supportingText:
        'Our participants have taken on the challenge. Official results and rankings will be revealed soon by NSS MJCET. Stay tuned!',
      showPublicNames: true,
      highlightTopThree: true,
      eligibilityRule: 'any',
      totalParticipants: 0,
      entries: [],
    };
  }

  /**
   * Admin: Retrieves full calculated rankings with all participant details.
   */
  async getAdminLeaderboard(quizId: string): Promise<LeaderboardAdminResponse> {
    return apiClient.get<LeaderboardAdminResponse>(`/admin/quiz/leaderboard/${encodeURIComponent(quizId)}`);
  }

  /**
   * Admin: Publishes the official leaderboard live. (Super Admin only)
   */
  async publishLeaderboard(quizId: string): Promise<{ success: boolean; message: string; publishedAt?: string }> {
    return apiClient.post<{ success: boolean; message: string; publishedAt?: string }>(
      `/admin/quiz/leaderboard/${encodeURIComponent(quizId)}/publish`,
      {}
    );
  }

  /**
   * Admin: Retracts published leaderboard back to Coming Soon. (Super Admin only)
   */
  async unpublishLeaderboard(quizId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.post<{ success: boolean; message: string }>(
      `/admin/quiz/leaderboard/${encodeURIComponent(quizId)}/unpublish`,
      {}
    );
  }

  /**
   * Admin: Updates display settings (announcement date, public names toggle, notes).
   */
  async updateSettings(
    quizId: string,
    settings: LeaderboardSettingsUpdate
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.put<{ success: boolean; message: string }>(
      `/admin/quiz/leaderboard/${encodeURIComponent(quizId)}/settings`,
      settings
    );
  }

  /**
   * Admin: Corrects an attempt's recorded score or time. (Super Admin only)
   */
  async overrideAttempt(
    attemptId: string,
    override: AttemptOverrideRequest
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.put<{ success: boolean; message: string }>(
      `/admin/quiz/attempts/${encodeURIComponent(attemptId)}/override`,
      override
    );
  }
}

export const leaderboardService = new LeaderboardService();
