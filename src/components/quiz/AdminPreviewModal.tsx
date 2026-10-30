import React, { useState, useEffect } from 'react';
import {
  X,
  Settings2,
  Database,
  Lock,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Quiz, AdminQuizStats } from '../../types/quiz';
import { quizService } from '../../services/quizService';
import { getQuizCategoryMeta } from '../../data/quizData';
import { useTheme } from '../../context/ThemeContext';

interface AdminPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
}

export const AdminPreviewModal: React.FC<AdminPreviewModalProps> = ({
  isOpen,
  onClose,
  quiz,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'settings' | 'questions' | 'analytics'>('settings');
  const [stats, setStats] = useState<AdminQuizStats | null>(null);

  useEffect(() => {
    if (isOpen) {
      quizService.getAdminStats().then((data) => setStats(data));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-preview-title"
    >
      <div
        className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative w-full max-w-2xl rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all z-10 max-h-[90vh] flex flex-col justify-between ${
          isDark
            ? 'bg-[#14243D] border-[#243A5E] text-white'
            : 'bg-[#EAF5FB] border-[#CFE3F0] text-[#183153]'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-ivory-200 dark:border-darkSurface-border">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-saffron-50 dark:bg-saffron-950/60 border border-saffron-200 dark:border-saffron-800 flex items-center justify-center text-saffron-600 dark:text-saffron-400">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="admin-preview-title" className="font-serif text-xl font-bold">
                    Admin Quiz Management
                  </h3>
                  <Badge variant="saffron" size="sm">
                    Phase 5 Schema
                  </Badge>
                </div>
                <p className="text-xs text-charcoal-500 dark:text-charcoal-400">
                  Ready for MongoDB collection schema &amp; Firebase Auth role verification.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-4 border-b border-ivory-200 dark:border-darkSurface-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`pb-2.5 px-3 border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-saffron-600 text-saffron-600 dark:text-saffron-400'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800 dark:hover:text-charcoal-200'
              }`}
            >
              Quiz Configuration
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`pb-2.5 px-3 border-b-2 transition-colors ${
                activeTab === 'questions'
                  ? 'border-saffron-600 text-saffron-600 dark:text-saffron-400'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800 dark:hover:text-charcoal-200'
              }`}
            >
              Question Management ({quiz.questions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`pb-2.5 px-3 border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-saffron-600 text-saffron-600 dark:text-saffron-400'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800 dark:hover:text-charcoal-200'
              }`}
            >
              Aggregate Participation
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-4 space-y-4 max-h-[48vh] overflow-y-auto text-xs">
            {activeTab === 'settings' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border bg-ivory-50/70 dark:bg-darkSurface-elevated border-ivory-200 dark:border-darkSurface-border grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-charcoal-400">Passing Score:</span>
                    <p className="font-bold font-mono text-sm">{quiz.settings.passingScorePercentage}%</p>
                  </div>
                  <div>
                    <span className="text-charcoal-400">Allow Retakes:</span>
                    <p className="font-bold">{quiz.settings.allowRetake ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  <div>
                    <span className="text-charcoal-400">Time Limit:</span>
                    <p className="font-bold">{quiz.settings.timeLimitMinutes} Minutes</p>
                  </div>
                  <div>
                    <span className="text-charcoal-400">Publication Status:</span>
                    <Badge variant="green" size="sm" className="mt-0.5">
                      {quiz.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border bg-ivory-50/70 dark:bg-darkSurface-elevated border-ivory-200 dark:border-darkSurface-border space-y-2">
                  <span className="font-bold text-charcoal-800 dark:text-charcoal-200 block">
                    Participant Registration Schema:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-charcoal-600 dark:text-charcoal-300">
                    <p>• Require Roll No: {quiz.settings.requireRollNumber ? 'Yes' : 'No'}</p>
                    <p>• Require Phone: {quiz.settings.requirePhoneNumber ? 'Yes' : 'No'}</p>
                    <p>• Require Department: {quiz.settings.requireDepartment ? 'Yes' : 'No'}</p>
                    <p>• Require Year: {quiz.settings.requireYearOfStudy ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 flex items-start gap-2.5">
                  <Database className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Phase 5 Integration Note:</strong> MongoDB collection `quizzes` stores definition, rules, and question sets. Answers and scoring will be verified strictly on the server-side API before persisting results.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-2.5">
                {quiz.questions.map((q, idx) => {
                  const cat = getQuizCategoryMeta(q.category);
                  return (
                    <div
                      key={q.id}
                      className="p-3 rounded-xl border border-ivory-200 dark:border-darkSurface-border bg-ivory-50/50 dark:bg-darkSurface-elevated/50 flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold">#{idx + 1}</span>
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-semibold"
                            style={{
                              backgroundColor: `${cat.accentColor}18`,
                              color: cat.accentColor,
                            }}
                          >
                            {cat.shortTag}
                          </span>
                          <span className="text-charcoal-400">({q.points} pts)</span>
                        </div>
                        <p className="font-medium text-charcoal-900 dark:text-white line-clamp-1">
                          {q.text}
                        </p>
                      </div>

                      <span className="text-[10px] font-mono uppercase px-2 py-1 bg-[#DCEBF5] dark:bg-[#1B2F4E] rounded border border-[#CFE3F0] dark:border-[#243A5E] shrink-0">
                        {q.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'analytics' && stats && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl border bg-ivory-50/70 dark:bg-darkSurface-elevated border-ivory-200 dark:border-darkSurface-border">
                    <p className="text-charcoal-400">Total Attempts</p>
                    <p className="text-lg font-bold font-mono">{stats.totalParticipants}</p>
                  </div>
                  <div className="p-3 rounded-xl border bg-ivory-50/70 dark:bg-darkSurface-elevated border-ivory-200 dark:border-darkSurface-border">
                    <p className="text-charcoal-400">Avg Score</p>
                    <p className="text-lg font-bold font-mono text-saffron-600">{stats.averageScore}%</p>
                  </div>
                  <div className="p-3 rounded-xl border bg-ivory-50/70 dark:bg-darkSurface-elevated border-ivory-200 dark:border-darkSurface-border">
                    <p className="text-charcoal-400">Pass Rate</p>
                    <p className="text-lg font-bold font-mono text-nssGreen-600">{stats.passingRatePercentage}%</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border bg-ivory-50/70 dark:bg-darkSurface-elevated border-ivory-200 dark:border-darkSurface-border space-y-2">
                  <p className="font-bold text-charcoal-800 dark:text-charcoal-200">
                    Category Breakdown (Avg Accuracy):
                  </p>
                  <div className="space-y-1.5">
                    {Object.entries(stats.categoryBreakdown).map(([catKey, val]) => (
                      <div key={catKey} className="flex items-center justify-between text-xs">
                        <span className="text-charcoal-600 dark:text-charcoal-400">
                          {getQuizCategoryMeta(catKey).label}
                        </span>
                        <span className="font-mono font-bold">{val.averagePercentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-ivory-200 dark:border-darkSurface-border flex items-center justify-between">
          <span className="text-[11px] text-charcoal-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-saffron-600" />
            Backend endpoints will be protected by Firebase Super Admin claims
          </span>

          <Button type="button" variant="primary" size="sm" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
