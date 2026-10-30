import React from 'react';
import {
  ShieldCheck,
  Award,
  Clock,
  HelpCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { Quiz } from '../../types/quiz';
import { QUIZ_CATEGORY_METADATA, getQuizCategoryMeta } from '../../data/quizData';
import { useTheme } from '../../context/ThemeContext';

interface QuizWelcomeProps {
  quiz: Quiz;
  onStart: () => void;
}

export const QuizWelcome: React.FC<QuizWelcomeProps> = ({
  quiz,
  onStart,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categories = Object.keys(QUIZ_CATEGORY_METADATA) as Array<
    keyof typeof QUIZ_CATEGORY_METADATA
  >;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header Card */}
      <Card
        className={`relative overflow-hidden border ${
          isDark
            ? 'bg-gradient-to-b from-[#112036] via-[#14243D] to-[#172B48] border-[#243A5E]'
            : 'bg-gradient-to-b from-white via-[#F4FAFD] to-[#EAF6FC] border-[#D7E7F0]'
        }`}
      >
        {/* Subtle decorative glow */}
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#159E9A]/10 pointer-events-none blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="teal" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                NSS MJCET Initiative
              </Badge>
              <Badge variant="neutral" size="sm">
                Interactive Learning
              </Badge>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                v{quiz.version}.0 &bull; 2026 Edition
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#183153] dark:text-white leading-[1.18]">
              {quiz.title}
            </h1>

            <p className="text-sm sm:text-base text-[#334C73] dark:text-slate-300 leading-relaxed font-normal">
              {quiz.description}
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2.5">
            <Button
              variant="teal"
              size="lg"
              onClick={onStart}
              rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              className="w-full sm:w-auto shadow-teal-subtle"
            >
              Register &amp; Begin Quiz
            </Button>
          </div>
        </div>

        {/* Key Metrics Strip */}
        <div className="mt-8 pt-6 border-t border-[#D7E7F0] dark:border-[#243A5E] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0FDFB] dark:bg-teal-950/50 border border-[#99F6E4] dark:border-teal-800 flex items-center justify-center text-[#159E9A] dark:text-[#5EEAD4] shrink-0">
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Questions
              </p>
              <p className="text-sm font-bold text-[#183153] dark:text-white font-mono">
                {quiz.questions.length} Items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF6FC] dark:bg-blue-950/50 border border-[#B9DDF5] dark:border-blue-800 flex items-center justify-center text-[#4F8FE8] dark:text-[#95C2FA] shrink-0">
              <Clock className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Estimated Time
              </p>
              <p className="text-sm font-bold text-[#183153] dark:text-white font-mono">
                ~{quiz.estimatedMinutes} Minutes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] dark:bg-emerald-950/50 border border-[#A7F3D0] dark:border-emerald-800 flex items-center justify-center text-[#239B70] dark:text-[#34D399] shrink-0">
              <Award className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Pass Threshold
              </p>
              <p className="text-sm font-bold text-[#183153] dark:text-white font-mono">
                {quiz.settings.passingScorePercentage}% Score
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4FAF8] dark:bg-slate-900/50 border border-[#C7E7DE] dark:border-slate-700 flex items-center justify-center text-[#183153] dark:text-[#A8D8CB] shrink-0">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Privacy
              </p>
              <p className="text-sm font-bold text-[#183153] dark:text-white font-sans">
                Confidential
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Campaign Values & Learning Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((catKey) => {
          const meta = getQuizCategoryMeta(catKey);
          return (
            <div
              key={catKey}
              className={`p-5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 text-left ${
                isDark
                  ? 'bg-[#14243D] border-[#243A5E] hover:border-slate-500'
                  : 'bg-gradient-to-br from-[#EAF5FB]/95 to-[#F4FAFD]/95 border-[#CFE3F0] hover:border-[#159E9A] shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: meta.accentColor }}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                  {meta.shortTag}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-[#183153] dark:text-white">
                {meta.label}
              </h3>
              <p className="text-xs text-[#334C73] dark:text-slate-400 mt-1.5 leading-relaxed">
                {meta.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Educational Dignity Notice Banner */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left ${
          isDark
            ? 'bg-[#112036] border-[#243A5E]'
            : 'bg-[#F0FDFB] border-[#99F6E4]'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] dark:bg-emerald-950/50 border border-[#A7F3D0] dark:border-emerald-800 flex items-center justify-center text-[#239B70] dark:text-[#34D399] shrink-0 mt-0.5">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold text-[#183153] dark:text-white">
              Campaign Educational Philosophy
            </h4>
            <p className="text-xs text-[#334C73] dark:text-slate-300 max-w-2xl leading-relaxed">
              This awareness challenge is an educational tool designed to foster scientific literacy, empathy, and informed peer action. It is <strong>not</strong> a diagnostic test or psychological assessment. We uphold a zero-shame, strictly destigmatized learning environment.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onStart}
          className="shrink-0 self-end sm:self-center"
        >
          Take Challenge &rarr;
        </Button>
      </div>
    </div>
  );
};
