import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Printer,
  BookOpen,
  PhoneCall,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { QuizResult } from '../../types/quiz';
import { getQuizCategoryMeta } from '../../data/quizData';
import { useTheme } from '../../context/ThemeContext';
import { quizService, PostQuizAwarenessMessage } from '../../services/quizService';

interface QuizResultsProps {
  result: QuizResult;
  allowRetake?: boolean;
  onRetake?: () => void;
  onBackToPortal?: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  allowRetake = true,
  onRetake,
  onBackToPortal,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [awarenessMessages, setAwarenessMessages] = useState<PostQuizAwarenessMessage[]>([]);

  useEffect(() => {
    quizService.getPostQuizAwarenessMessages().then((msgs) => {
      setAwarenessMessages(msgs);
    });
  }, []);

  const toggleExpand = (qId: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner Card */}
      <Card
        className={`border text-center overflow-hidden relative ${
          result.passed
            ? isDark
              ? 'bg-gradient-to-b from-[#0F291E] via-[#14243D] to-[#14243D] border-emerald-800'
              : 'bg-gradient-to-b from-[#ECFDF5] via-white to-[#EAF6FC] border-[#A7F3D0]'
            : isDark
            ? 'bg-gradient-to-b from-[#172B48] via-[#14243D] to-[#14243D] border-[#243A5E]'
            : 'bg-gradient-to-b from-[#EAF6FC] via-white to-white border-[#D7E7F0]'
        }`}
      >
        <div className="flex flex-col items-center max-w-xl mx-auto space-y-4">
          <div
            className={`w-16 h-16 rounded-2xl border flex items-center justify-center shrink-0 shadow-soft-card ${
              result.passed
                ? 'bg-[#ECFDF5] dark:bg-emerald-950/60 border-[#A7F3D0] dark:border-emerald-700 text-[#239B70] dark:text-[#34D399]'
                : 'bg-[#EAF6FC] dark:bg-blue-950/60 border-[#B9DDF5] dark:border-blue-700 text-[#159E9A] dark:text-[#5EEAD4]'
            }`}
          >
            <Award className="w-8 h-8" aria-hidden="true" />
          </div>

          <div>
            <Badge
              variant={result.passed ? 'emerald' : 'teal'}
              size="md"
              className="mb-2"
            >
              {result.badgeName}
            </Badge>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#183153] dark:text-white">
              {result.passed ? 'Challenge Completed Successfully' : 'Awareness Session Completed'}
            </h1>

            <p className="text-xs sm:text-sm text-[#334C73] dark:text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
              {result.summaryMessage}
            </p>
          </div>

          {/* Score Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#CFE3F0] dark:border-[#243A5E]">
            <div className="p-3 rounded-xl bg-[#DCEBF5]/60 dark:bg-[#14243D]/70 border border-[#CFE3F0] dark:border-[#243A5E]">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Total Score</p>
              <p className="text-xl font-bold text-[#183153] dark:text-white font-mono">
                {result.score} / {result.maxScore}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#DCEBF5]/60 dark:bg-[#14243D]/70 border border-[#CFE3F0] dark:border-[#243A5E]">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Percentage</p>
              <p className="text-xl font-bold text-[#159E9A] dark:text-[#5EEAD4] font-mono">
                {result.percentage}%
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#DCEBF5]/60 dark:bg-[#14243D]/70 border border-[#CFE3F0] dark:border-[#243A5E]">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Correct Answers</p>
              <p className="text-xl font-bold text-[#239B70] dark:text-[#34D399] font-mono">
                {result.correctCount}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#DCEBF5]/60 dark:bg-[#14243D]/70 border border-[#CFE3F0] dark:border-[#243A5E]">
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Review Items</p>
              <p className="text-xl font-bold text-[#4F678A] dark:text-slate-400 font-mono">
                {result.incorrectCount}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {allowRetake && onRetake && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRetake}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Retake Challenge
              </Button>
            )}

            <Button
              type="button"
              variant="teal"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Print / Save Summary
            </Button>

            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#EAF5FB] dark:bg-[#1A3153] border border-[#CFE3F0] dark:border-[#243A5E] text-[#183153] dark:text-white hover:bg-[#DDF3F0] dark:hover:bg-[#203D67] transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>The Champions Board</span>
            </Link>

            {onBackToPortal && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onBackToPortal}
              >
                &larr; All Challenges
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Question-by-Question Educational Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#D7E7F0] dark:border-[#243A5E]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#183153] dark:text-white">
              Curriculum Review &amp; Explanations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review scientific explanations and evidence-based guidance for every question.
            </p>
          </div>

          <Badge variant="neutral" size="sm">
            {result.questionBreakdown.length} Items Evaluated
          </Badge>
        </div>

        <div className="space-y-3">
          {result.questionBreakdown.map((item, idx) => {
            const isExpanded = expandedQuestions[item.questionId] ?? true; // expanded by default for educational review
            const catMeta = getQuizCategoryMeta(item.category);

            return (
              <div
                key={item.questionId}
                className={`p-5 rounded-2xl border transition-all ${
                  item.isCorrect
                    ? isDark
                      ? 'bg-[#14243D] border-emerald-900/50'
                      : 'bg-[#DDF0E6]/90 border-[#A7F3D0]'
                    : isDark
                    ? 'bg-[#14243D] border-[#243A5E]'
                    : 'bg-[#EAF5FB]/90 border-[#CFE3F0]'
                }`}
              >
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  onClick={() => toggleExpand(item.questionId)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        item.isCorrect
                          ? 'bg-[#ECFDF5] dark:bg-emerald-950 text-[#1C825E] dark:text-[#34D399]'
                          : 'bg-[#FFF7ED] dark:bg-amber-950 text-[#D97706] dark:text-[#FBBF24]'
                      }`}
                    >
                      {item.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                          #{idx + 1}
                        </span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${catMeta.accentColor}18`,
                            color: catMeta.accentColor,
                          }}
                        >
                          {catMeta.shortTag}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
                          +{item.earnedPoints} / {item.points} pts
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-sm sm:text-base text-[#183153] dark:text-white leading-snug">
                        {item.questionText}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={isExpanded ? 'Collapse explanation' : 'Expand explanation'}
                    className="p-1 rounded text-charcoal-400 hover:text-charcoal-700 dark:hover:text-charcoal-200"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-ivory-200 dark:border-darkSurface-border space-y-3.5 text-xs animate-fadeIn">
                    {/* Option Choices */}
                    <div className="space-y-1.5 pl-9">
                      {item.options.map((opt) => {
                        const isChosen = item.selectedOptionIds.includes(opt.id);
                        const isRight = item.correctOptionIds.includes(opt.id);

                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                              isRight
                                ? 'bg-[#ECFDF5] dark:bg-emerald-950/40 border-[#A7F3D0] dark:border-emerald-800 text-[#166534] dark:text-[#86EFAC] font-medium'
                                : isChosen && !isRight
                                ? 'bg-[#FEF2F2] dark:bg-red-950/40 border-[#FECACA] dark:border-red-800 text-[#991B1B] dark:text-[#FCA5A5] font-medium'
                                : isDark
                                ? 'bg-[#14243D]/60 border-[#243A5E] text-slate-400'
                                : 'bg-[#F8FBFD] border-[#D7E7F0] text-slate-600'
                            }`}
                          >
                            <span className="shrink-0 font-bold">
                              {isRight ? '✓ (Correct)' : isChosen ? '✗ (Your Choice)' : '•'}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Scientific Rationale Callout */}
                    <div className="ml-9 p-3.5 rounded-xl bg-[#F0F7FB] dark:bg-[#14243D] border border-[#D7E7F0] dark:border-[#243A5E] space-y-1">
                      <p className="text-[11px] uppercase font-bold tracking-wider text-[#0F8380] dark:text-[#5EEAD4] flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3" />
                        Clinical &amp; Evidence-Based Rationale:
                      </p>
                      <p className="text-[#183153] dark:text-slate-300 leading-relaxed font-normal text-xs sm:text-sm">
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic End-of-Quiz Awareness Message */}
      {awarenessMessages.length > 0 && (
        <Card
          className={`border p-6 rounded-2xl relative overflow-hidden shadow-sm ${
            isDark
              ? 'bg-gradient-to-r from-[#14243D] via-[#112036] to-[#0E1B2E] border-[#243A5E]'
              : 'bg-gradient-to-r from-[#F0FDFB] via-white to-[#F0F7FB] border-[#99F6E4]'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#159E9A]/10 text-[#0F8380] dark:text-[#5EEAD4]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{awarenessMessages[0].category}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
                {awarenessMessages[0].title}
              </h3>
              <p className="text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed">
                {awarenessMessages[0].body}
              </p>
            </div>
            {awarenessMessages[0].callToAction && (
              <Link
                to={awarenessMessages[0].resourceLink || '/support'}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-[#159E9A] hover:bg-[#0F8380] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                {awarenessMessages[0].callToAction}
              </Link>
            )}
          </div>
        </Card>
      )}

      {/* Campaign Next Steps / Take Action */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border space-y-5 ${
          isDark
            ? 'bg-gradient-to-b from-darkSurface-card to-darkSurface-base border-darkSurface-border'
            : 'bg-gradient-to-b from-white to-ivory-100 border-ivory-300'
        }`}
      >
        <div className="space-y-1">
          <Badge variant="teal" size="sm">
            Continue the Movement
          </Badge>
          <h3 className="font-serif text-2xl font-bold text-[#183153] dark:text-white">
            Carry Awareness Forward on Campus
          </h3>
          <p className="text-xs sm:text-sm text-[#334C73] dark:text-slate-300 leading-relaxed max-w-xl">
            Awareness is most powerful when shared. Explore the complete curriculum, attend university rallies, or access confidential 24/7 tele-consultation helplines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <Link
            to="/awareness"
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:-translate-y-0.5 group ${
              isDark
                ? 'bg-[#1B2F4E] border-[#243A5E] hover:border-[#159E9A]'
                : 'bg-[#EAF5FB] border-[#CFE3F0] hover:border-[#159E9A] shadow-2xs'
            }`}
          >
            <div>
              <BookOpen className="w-5 h-5 text-[#159E9A] mb-2" />
              <h4 className="font-serif font-bold text-sm text-[#183153] dark:text-white">
                Awareness Journey
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Explore the 5-stage curriculum &amp; dilemma simulator.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Learn More &rarr;
            </span>
          </Link>

          <Link
            to="/activities"
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:-translate-y-0.5 group ${
              isDark
                ? 'bg-[#1B2F4E] border-[#243A5E] hover:border-[#239B70]'
                : 'bg-[#EAF5FB] border-[#CFE3F0] hover:border-[#239B70] shadow-2xs'
            }`}
          >
            <div>
              <Calendar className="w-5 h-5 text-[#239B70] mb-2" />
              <h4 className="font-serif font-bold text-sm text-[#183153] dark:text-white">
                Campus Action Activities
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Join anti-drug street plays &amp; awareness marches.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#239B70] dark:text-[#34D399] mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              View Calendar &rarr;
            </span>
          </Link>

          <Link
            to="/support"
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:-translate-y-0.5 group ${
              isDark
                ? 'bg-[#1B2F4E] border-[#243A5E] hover:border-[#4F8FE8]'
                : 'bg-[#EAF5FB] border-[#CFE3F0] hover:border-[#4F8FE8] shadow-2xs'
            }`}
          >
            <div>
              <PhoneCall className="w-5 h-5 text-[#4F8FE8] mb-2" />
              <h4 className="font-serif font-bold text-sm text-[#183153] dark:text-white">
                Verified Helplines
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                24/7 Govt. of India NMBA (14446) &amp; Tele-MANAS (14416).
              </p>
            </div>
            <span className="text-xs font-semibold text-[#4F8FE8] dark:text-[#95C2FA] mt-3 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Get Guidance &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
