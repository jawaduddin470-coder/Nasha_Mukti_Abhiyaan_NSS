import React, { useState, useEffect } from 'react';
import { Container } from '../components/common/Container';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';
import { QuizWelcome } from '../components/quiz/QuizWelcome';
import { QuizRegistration } from '../components/quiz/QuizRegistration';
import { QuizPlayer } from '../components/quiz/QuizPlayer';
import { QuizResults } from '../components/quiz/QuizResults';
import { Quiz, ParticipantRegistration, QuizResult } from '../types/quiz';
import { quizService } from '../services/quizService';
import { LoadingState } from '../components/common/LoadingState';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../components/common/Button';

type QuizStep = 'welcome' | 'register' | 'quiz' | 'results';

export const QuizPage: React.FC = () => {
  const [step, setStep] = useState<QuizStep>('welcome');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [participant, setParticipant] = useState<ParticipantRegistration | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await quizService.getPublicQuiz();
        setQuiz(data);
      } catch (err) {
        setError('Unable to load awareness challenge. Please try again shortly.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, []);

  const handleStartRegistration = () => {
    setStep('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegistered = (data: ParticipantRegistration) => {
    setParticipant(data);
    setStep('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitQuiz = async (userAnswers: Record<string, string[]>) => {
    if (!quiz || !participant) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      const computedResult = await quizService.submitQuizAttempt(
        quiz,
        participant,
        userAnswers
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
          <div className="py-20 flex justify-center">
            <LoadingState variant="spinner" label="Initializing Awareness Challenge &amp; Curriculum..." />
          </div>
        )}

        {error && !isLoading && (
          <div className="max-w-md mx-auto text-center py-16 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#183153] dark:text-white">
              Quiz Unavailable
            </h2>
            <p className="text-sm text-[#334C73] dark:text-slate-300">
              {error}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Retry Connection
            </Button>
          </div>
        )}

        {!isLoading && !error && quiz && (
          <>
            {step === 'welcome' && (
              <QuizWelcome
                quiz={quiz}
                onStart={handleStartRegistration}
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
              />
            )}
          </>
        )}
      </Container>
    </div>
  );
};
