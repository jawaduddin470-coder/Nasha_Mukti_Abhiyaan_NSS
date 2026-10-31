import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { Container } from '../components/common/Container';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';
import { QuizWelcome } from '../components/quiz/QuizWelcome';
import { QuizRegistration } from '../components/quiz/QuizRegistration';
import { QuizPlayer } from '../components/quiz/QuizPlayer';
import { QuizResults } from '../components/quiz/QuizResults';
import { Quiz, QuizPortalItem, ParticipantRegistration, QuizResult } from '../types/quiz';
import { quizService, FALLBACK_PORTAL_QUIZZES } from '../services/quizService';
import { LoadingState } from '../components/common/LoadingState';
import {
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock,
  HelpCircle,
  Award,
  Trophy,
  ShieldCheck,
  ChevronRight,
  Flag,
} from 'lucide-react';
import { Button } from '../components/common/Button';

type QuizStep = 'portal' | 'welcome' | 'register' | 'quiz' | 'results';

export const QuizPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { quizId: routeQuizId } = useParams<{ quizId?: string }>();

  const [portalQuizzes, setPortalQuizzes] = useState<QuizPortalItem[]>(FALLBACK_PORTAL_QUIZZES);
  const [step, setStep] = useState<QuizStep>('portal');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [participant, setParticipant] = useState<ParticipantRegistration | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 1. Initial Load: Fetch portal items and check URL deep-links
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch live portal configurations
        const portalData = await quizService.getPortalQuizzes();
        if (mounted) {
          setPortalQuizzes(portalData);
        }

        // Check if a specific quiz is requested via query param or route
        const requestedId = routeQuizId || searchParams.get('id') || searchParams.get('quiz');
        if (requestedId) {
          await loadSpecificQuiz(requestedId);
        } else {
          setStep('portal');
        }
      } catch (err) {
        if (mounted) {
          setError('Unable to load quiz portal. Please try again shortly.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [routeQuizId, searchParams]);

  // Load specific quiz questions and settings
  const loadSpecificQuiz = async (quizIdentifier: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await quizService.getPublicQuiz(quizIdentifier);
      setQuiz(data);
      setStep('welcome');
    } catch (err) {
      setError('Unable to load the requested challenge. Please try again shortly.');
      setStep('portal');
    } finally {
      setIsLoading(false);
    }
  };

  // User selects a quiz card from the portal
  const handleSelectQuiz = async (portalItem: QuizPortalItem) => {
    if (portalItem.status === 'disabled') {
      alert(`The ${portalItem.title} is currently disabled.`);
      return;
    }
    if (portalItem.status === 'upcoming') {
      alert(`The ${portalItem.title} is scheduled to launch soon. Stay tuned!`);
      return;
    }

    setSearchParams({ id: portalItem.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await loadSpecificQuiz(portalItem.id);
  };

  // Return to portal selection
  const handleBackToPortal = () => {
    setSearchParams({});
    setQuiz(null);
    setParticipant(null);
    setResult(null);
    setStep('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartRegistration = () => {
    setStep('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistered = (data: ParticipantRegistration) => {
    setParticipant(data);
    setStep('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitQuiz = async (userAnswers: Record<string, string[]>, timeTakenSeconds?: number) => {
    if (!quiz || !participant) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const computedResult = await quizService.submitQuizAttempt(
        quiz,
        participant,
        userAnswers,
        timeTakenSeconds
      );
      setResult(computedResult);
      setStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError('An error occurred during score calculation. Please review your answers and retry submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setStep('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-[85vh] py-10 sm:py-16 overflow-hidden bg-[#EAF6FC]/50 dark:bg-[#0B1524]">
      {/* Coherent Atmospheric Background with flowing ribbons and authentic watermark */}
      <AtmosphericBackground
        variant="page-header"
        showWatermark
        watermarkPosition="top-right"
        showRibbons
      />

      <Container size="wide" className="relative z-10">
        {isLoading && (
          <div className="py-24 flex justify-center">
            <LoadingState variant="spinner" label="Initializing NSS MJCET Quiz Portal & Challenges..." />
          </div>
        )}

        {error && !isLoading && (
          <div className="max-w-md mx-auto text-center py-16 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#183153] dark:text-white">
              Challenge Unavailable
            </h2>
            <p className="text-sm text-[#334C73] dark:text-slate-300">{error}</p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToPortal}
              >
                Back to Portal
              </Button>
              <Button
                variant="teal"
                size="sm"
                onClick={() => window.location.reload()}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================================
            PORTAL VIEW: Two Prominent Dynamic Challenge Cards
            ========================================================================= */}
        {!isLoading && !error && step === 'portal' && (
          <div className="space-y-12 animate-fadeIn max-w-6xl mx-auto">
            {/* Main Portal Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5FB] dark:bg-[#152744] border border-[#CFE3F0] dark:border-[#243A5E] text-xs font-semibold text-[#159E9A] dark:text-[#5EEAD4] shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NSS MJCET Institutional Portal &bull; Dual Knowledge Challenges</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#183153] dark:text-white tracking-tight leading-tight">
                Learn. Participate. Make a Difference.
              </h1>

              <p className="text-sm sm:text-base text-[#334C73] dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Explore our interactive awareness challenges and test your knowledge through two specially curated initiatives by NSS MJCET.
              </p>
            </div>

            {/* Two Prominent Challenge Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {portalQuizzes.map((pq) => {
                const isUnity = pq.theme === 'unity' || pq.id.includes('unity');

                return (
                  <div
                    key={pq.id}
                    onClick={() => handleSelectQuiz(pq)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelectQuiz(pq);
                      }
                    }}
                    className={`group relative rounded-3xl p-8 sm:p-9 border transition-all duration-300 flex flex-col justify-between text-left cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${
                      isUnity
                        ? 'bg-gradient-to-br from-amber-50/70 via-white to-emerald-50/50 dark:from-[#182330] dark:via-[#132033] dark:to-[#162725] border-amber-200/80 dark:border-amber-900/50 hover:border-amber-400 dark:hover:border-amber-500'
                        : 'bg-gradient-to-br from-[#EAF6FC] via-white to-[#F0FDFB] dark:from-[#132338] dark:via-[#101E30] dark:to-[#122A30] border-[#CFE3F0] dark:border-[#223B5C] hover:border-[#159E9A] dark:hover:border-[#159E9A]'
                    }`}
                  >
                    {/* Atmospheric decorative glow */}
                    <div
                      className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 opacity-30 group-hover:opacity-60 ${
                        isUnity ? 'bg-amber-400' : 'bg-[#159E9A]'
                      }`}
                    />

                    {/* Tricolour / Campaign Top Accent Strip */}
                    <div className="absolute top-0 inset-x-0 h-1.5 flex overflow-hidden">
                      {isUnity ? (
                        <>
                          <div className="w-1/3 bg-[#FF9933]" />
                          <div className="w-1/3 bg-white" />
                          <div className="w-1/3 bg-[#138808]" />
                        </>
                      ) : (
                        <>
                          <div className="w-1/2 bg-[#0284C7]" />
                          <div className="w-1/2 bg-[#159E9A]" />
                        </>
                      )}
                    </div>

                    <div className="relative z-10 space-y-5">
                      {/* Badge & Status Strip */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border shadow-xs ${
                            isUnity
                              ? 'bg-amber-100/90 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                              : 'bg-teal-50 text-[#0F766E] border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800'
                          }`}
                        >
                          {isUnity ? <Flag className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          <span>{pq.badge || (isUnity ? 'Rashtriya Ekta Diwas' : 'Campus Resilience & Health')}</span>
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                            pq.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : pq.status === 'upcoming'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${pq.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          {pq.status === 'active' ? 'Active Challenge' : pq.status}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2.5">
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183153] dark:text-white tracking-tight group-hover:text-[#159E9A] dark:group-hover:text-[#5EEAD4] transition-colors">
                          {pq.title}
                        </h2>
                        <p className="text-sm text-[#334C73] dark:text-slate-300 leading-relaxed font-normal line-clamp-3">
                          {pq.description}
                        </p>
                      </div>

                      {/* Live Database Metrics */}
                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" /> Questions
                          </span>
                          <span className="text-lg font-bold text-[#183153] dark:text-white mt-0.5 font-mono">
                            {pq.questionCount} MCQs
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Duration
                          </span>
                          <span className="text-lg font-bold text-[#183153] dark:text-white mt-0.5 font-mono">
                            ~{pq.estimatedMinutes} Mins
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Award className="w-3 h-3" /> Passing
                          </span>
                          <span className="text-lg font-bold text-[#183153] dark:text-white mt-0.5 font-mono">
                            {pq.passingScorePercentage}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="relative z-10 pt-7 mt-6 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Instant Certificate Eligibility
                      </div>

                      <div
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-sm transition-all duration-300 group-hover:scale-[1.02] ${
                          isUnity
                            ? 'bg-gradient-to-r from-[#EA580C] to-[#C2410C] hover:from-[#C2410C] hover:to-[#9A3412]'
                            : 'bg-gradient-to-r from-[#0284C7] to-[#159E9A] hover:from-[#0369A1] hover:to-[#0F766E]'
                        }`}
                      >
                        <span>Enter Challenge</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Champions Board Announcement & Access Strip */}
            <div className="rounded-2xl p-6 sm:p-7 border border-[#CFE3F0] dark:border-[#243A5E] bg-white/80 dark:bg-[#132238]/90 backdrop-blur-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
                    The Champions Board &amp; Official Results
                  </h3>
                  <p className="text-xs sm:text-sm text-[#334C73] dark:text-slate-300 mt-0.5">
                    View verified rankings across both individual challenges and the unified combined standings.
                  </p>
                </div>
              </div>

              <Link
                to="/leaderboard"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#CFE3F0] dark:border-[#243A5E] bg-[#EAF6FC] dark:bg-[#1A3153] hover:bg-[#DDF3F0] dark:hover:bg-[#203D67] text-xs sm:text-sm font-bold text-[#183153] dark:text-white transition-all shadow-xs"
              >
                <span>View The Champions Board</span>
                <ChevronRight className="w-4 h-4 text-[#159E9A]" />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            ACTIVE QUIZ WORKFLOW (Welcome -> Register -> Quiz -> Results)
            ========================================================================= */}
        {!isLoading && !error && quiz && step !== 'portal' && (
          <div className="space-y-6">
            {step === 'welcome' && (
              <QuizWelcome
                quiz={quiz}
                onStart={handleStartRegistration}
                onBackToPortal={handleBackToPortal}
              />
            )}

            {step === 'register' && (
              <QuizRegistration
                settings={quiz.settings}
                onBack={() => setStep('welcome')}
                onRegistered={handleRegistered}
              />
            )}

            {step === 'quiz' && participant && (
              <div className="space-y-4">
                {submitError && (
                  <div className="max-w-3xl mx-auto p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 text-xs sm:text-sm text-red-700 dark:text-red-300 flex items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubmitError(null)}
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Dismiss
                    </Button>
                  </div>
                )}
                <QuizPlayer
                  quiz={quiz}
                  participant={participant}
                  onSubmit={handleSubmitQuiz}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}

            {step === 'results' && result && (
              <QuizResults
                result={result}
                allowRetake={quiz.settings.allowRetake}
                onRetake={handleRetake}
                onBackToPortal={handleBackToPortal}
              />
            )}
          </div>
        )}
      </Container>
    </div>
  );
};
