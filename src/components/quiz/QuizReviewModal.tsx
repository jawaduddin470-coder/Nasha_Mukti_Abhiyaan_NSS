import React from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Quiz } from '../../types/quiz';
import { useTheme } from '../../context/ThemeContext';

interface QuizReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
  userAnswers: Record<string, string[]>;
  onSelectQuestion: (index: number) => void;
  onSubmitQuiz: () => void;
  isSubmitting?: boolean;
}

export const QuizReviewModal: React.FC<QuizReviewModalProps> = ({
  isOpen,
  onClose,
  quiz,
  userAnswers,
  onSelectQuestion,
  onSubmitQuiz,
  isSubmitting = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const totalQuestions = quiz.questions.length;
  const answeredCount = quiz.questions.filter((q) => {
    const ans = userAnswers[q.id];
    return ans && ans.length > 0;
  }).length;

  const unansweredCount = totalQuestions - answeredCount;
  const isAllAnswered = unansweredCount === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full max-w-xl rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all z-10 max-h-[90vh] flex flex-col justify-between ${
          isDark
            ? 'bg-[#14243D] border-[#243A5E] text-white'
            : 'bg-[#EAF5FB] border-[#CFE3F0] text-[#183153]'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-ivory-200 dark:border-darkSurface-border">
            <div>
              <h3
                id="review-modal-title"
                className="font-serif text-xl sm:text-2xl font-bold"
              >
                Submission Review
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-500 dark:text-charcoal-400 mt-0.5">
                Review your responses before finalizing evaluation.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200 hover:bg-ivory-100 dark:hover:bg-darkSurface-elevated transition-colors"
              aria-label="Close review dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Alert Banner */}
          <div className="mt-4">
            {isAllAnswered ? (
              <div className="p-3.5 rounded-xl bg-nssGreen-50 dark:bg-nssGreen-950/40 border border-nssGreen-200 dark:border-nssGreen-800 text-xs text-nssGreen-800 dark:text-nssGreen-200 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-nssGreen-600 dark:text-nssGreen-400 shrink-0" />
                <span className="font-medium">
                  All {totalQuestions} questions have been answered. You are ready to complete your submission!
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="font-medium">
                  {unansweredCount} {unansweredCount === 1 ? 'question remains' : 'questions remain'} unanswered. Click any item below to jump directly to it.
                </span>
              </div>
            )}
          </div>

          {/* Question List Grid */}
          <div className="mt-5 space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
            {quiz.questions.map((q, idx) => {
              const ans = userAnswers[q.id];
              const isAnswered = ans && ans.length > 0;

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    onSelectQuestion(idx);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all hover:border-saffron-500/60 ${
                    isAnswered
                      ? isDark
                        ? 'bg-darkSurface-elevated/70 border-darkSurface-border'
                        : 'bg-ivory-50/80 border-ivory-200'
                      : isDark
                      ? 'bg-amber-950/20 border-amber-900/50'
                      : 'bg-amber-50/70 border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="font-mono text-xs font-bold text-charcoal-400 dark:text-charcoal-500 shrink-0">
                      #{idx + 1}
                    </span>
                    <p className="text-xs truncate font-medium text-charcoal-800 dark:text-charcoal-200">
                      {q.text}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isAnswered ? (
                      <Badge variant="green" size="sm">
                        Answered ({ans.length})
                      </Badge>
                    ) : (
                      <Badge variant="gold" size="sm">
                        Unanswered
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-ivory-200 dark:border-darkSurface-border flex items-center justify-between gap-3">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Back to Question
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onSubmitQuiz}
            disabled={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
          >
            {isSubmitting ? 'Evaluating Submission...' : 'Submit Answers Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};
