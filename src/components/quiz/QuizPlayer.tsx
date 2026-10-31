import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ListOrdered,
  Check,
  User,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { Quiz, ParticipantRegistration } from '../../types/quiz';
import { getQuizCategoryMeta } from '../../data/quizData';
import { QuizReviewModal } from './QuizReviewModal';
import { useTheme } from '../../context/ThemeContext';

interface QuizPlayerProps {
  quiz: Quiz;
  participant: ParticipantRegistration;
  onSubmit: (userAnswers: Record<string, string[]>, timeTakenSeconds?: number) => void;
  isSubmitting?: boolean;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({
  quiz,
  participant,
  onSubmit,
  isSubmitting = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalQuestions = quiz?.questions?.length || 0;
  const safeIndex = totalQuestions > 0 ? Math.max(0, Math.min(currentIndex, totalQuestions - 1)) : 0;
  const currentQuestion = totalQuestions > 0 ? quiz.questions[safeIndex] : null;
  const meta = getQuizCategoryMeta(currentQuestion?.category);

  const currentSelectedIds = (currentQuestion && userAnswers[currentQuestion.id]) || [];
  const isAnswered = currentSelectedIds.length > 0;

  const answeredCount = quiz?.questions ? quiz.questions.filter((q) => {
    const a = userAnswers[q.id];
    return a && a.length > 0;
  }).length : 0;

  const progressPercentage = totalQuestions > 0
    ? Math.round(((safeIndex + 1) / totalQuestions) * 100)
    : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    if (currentQuestion.type === 'multiple') {
      const existing = currentSelectedIds;
      const next = existing.includes(optionId)
        ? existing.filter((id) => id !== optionId)
        : [...existing, optionId];
      setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: next }));
    } else {
      setUserAnswers((prev) => ({ ...prev, [currentQuestion.id]: [optionId] }));
    }
  };

  const handleNext = () => {
    if (safeIndex < totalQuestions - 1) {
      setCurrentIndex(safeIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsReviewOpen(true);
    }
  };

  const handlePrevious = () => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!currentQuestion || totalQuestions === 0) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center rounded-2xl border border-[#CFE3F0] dark:border-[#243A5E] bg-[#EAF5FB] dark:bg-[#14243D]">
        <p className="text-base font-medium text-[#183153] dark:text-white">
          No questions are available at this moment.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Please check back or contact the campaign coordinator.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header Strip: Question Counter, Timer, Review Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border bg-[#EAF5FB]/90 dark:bg-[#14243D] border-[#CFE3F0] dark:border-[#243A5E] shadow-2xs">
        <div className="flex items-center gap-2">
          <Badge variant="teal" size="sm">
            Question {safeIndex + 1} of {totalQuestions}
          </Badge>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${meta.accentColor}18`,
              color: meta.accentColor,
            }}
          >
            {meta.shortTag}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <User className="w-3 h-3" />
            {participant.fullName.split(' ')[0]}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[#334C73] dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-[#159E9A]" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsReviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#CFE3F0] dark:border-[#243A5E] text-[#183153] dark:text-slate-300 hover:text-[#159E9A] dark:hover:text-white hover:border-[#159E9A] transition-colors"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Review Grid ({answeredCount}/{totalQuestions})</span>
          </button>
        </div>
      </div>

      {/* Smooth Progress Bar */}
      <div
        className="w-full bg-[#EAF6FC] dark:bg-[#1B2F4E] h-2 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quiz completion progress"
      >
        <div
          className="bg-gradient-to-r from-[#159E9A] to-[#4F8FE8] h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Interactive Question Pill Jumper */}
      <nav
        aria-label="Question Jump Navigation"
        className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 text-xs"
      >
        {quiz.questions.map((q, idx) => {
          const isCurr = idx === safeIndex;
          const ans = userAnswers[q.id];
          const hasAns = ans && ans.length > 0;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-current={isCurr ? 'step' : undefined}
              className={`flex-1 min-w-[34px] py-1.5 rounded-lg font-mono font-bold text-center border transition-all text-[11px] sm:text-xs ${
                isCurr
                  ? 'bg-[#159E9A] text-white border-[#159E9A] shadow-xs ring-2 ring-[#159E9A]/30'
                  : hasAns
                  ? 'bg-[#ECFDF5] dark:bg-emerald-950/40 text-[#1C825E] dark:text-[#34D399] border-[#A7F3D0] dark:border-emerald-800'
                  : isDark
                  ? 'bg-[#14243D] text-slate-400 border-[#243A5E] hover:border-slate-500'
                  : 'bg-[#EAF5FB] text-slate-600 border-[#CFE3F0] hover:border-[#159E9A]'
              }`}
              title={`Jump to Question ${idx + 1}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </nav>

      {/* Main Question Card */}
      <Card className="border p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 pb-2 mb-2 border-b border-[#D7E7F0] dark:border-[#243A5E]">
            <span>Points: {currentQuestion.points}</span>
            <span>
              {currentQuestion.type === 'multiple'
                ? 'Multiple Choice (Select all that apply)'
                : currentQuestion.type === 'boolean'
                ? 'True / False'
                : 'Single Best Choice'}
            </span>
          </div>

          <h2 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-[#183153] dark:text-white leading-snug">
            {currentQuestion.text}
          </h2>
        </div>

        {/* Options List */}
        <div
          className="space-y-3"
          role={currentQuestion.type === 'multiple' ? 'group' : 'radiogroup'}
          aria-label="Answer options"
        >
          {currentQuestion.options.map((option) => {
            const isSelected = currentSelectedIds.includes(option.id);

            return (
              <div
                key={option.id}
                role={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'}
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleSelectOption(option.id)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleSelectOption(option.id);
                  }
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex items-start gap-3.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A] ${
                  isSelected
                    ? 'bg-[#F0FDFB] dark:bg-teal-950/40 border-[#159E9A] ring-1 ring-[#159E9A] text-[#183153] dark:text-white shadow-2xs'
                    : isDark
                    ? 'bg-[#1B2F4E]/70 border-[#243A5E] text-slate-200 hover:bg-[#1B2F4E] hover:border-[#159E9A]'
                    : 'bg-[#EAF5FB] border-[#CFE3F0] text-[#1F3F6B] hover:bg-[#DDF3F0] hover:border-[#159E9A]'
                }`}
              >
                {/* Indicator icon */}
                <div
                  className={`w-5 h-5 rounded-${
                    currentQuestion.type === 'multiple' ? 'md' : 'full'
                  } border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'bg-[#159E9A] border-[#159E9A] text-white'
                      : 'border-[#D7E7F0] dark:border-[#243A5E] text-transparent'
                  }`}
                  aria-hidden="true"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                <div className="flex-1 text-sm leading-relaxed font-normal">
                  {option.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Unanswered Hint Alert */}
        {!isAnswered && (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">
            Select {currentQuestion.type === 'multiple' ? 'one or more options' : 'an option'} to record your response.
          </p>
        )}

        {/* Action Controls Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#D7E7F0] dark:border-[#243A5E]">
          <Button
            variant="outline"
            size="md"
            onClick={handlePrevious}
            disabled={safeIndex === 0}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {safeIndex < totalQuestions - 1 ? (
              <Button
                variant="teal"
                size="md"
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="green"
                size="md"
                onClick={() => setIsReviewOpen(true)}
                rightIcon={<Check className="w-4 h-4" />}
              >
                Review &amp; Submit
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Grid Review Modal */}
      <QuizReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        quiz={quiz}
        userAnswers={userAnswers}
        onSelectQuestion={(idx) => {
          setCurrentIndex(idx);
          setIsReviewOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSubmitQuiz={() => onSubmit(userAnswers, secondsElapsed)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
