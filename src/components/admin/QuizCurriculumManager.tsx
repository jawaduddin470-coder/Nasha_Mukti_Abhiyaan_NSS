import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Save,
  Sparkles,
  RefreshCw,
  Sliders,
  Layers,
} from 'lucide-react';
import { quizService } from '../../services/quizService';
import { QuizPortalItem } from '../../types/quiz';

interface QuizQuestion {
  id: string;
  quizId?: string;
  text: string;
  category: string;
  type: 'single' | 'multiple' | 'boolean';
  options: { id: string; text: string }[];
  correctAnswerIds: string[];
  explanation: string;
  points: number;
  displayOrder: number;
  publicationStatus: 'published' | 'draft';
}

const QUIZZES: { id: string; title: string; badge: string; color: string }[] = [
  {
    id: 'nmba-awareness-challenge-v1',
    title: 'Nasha Mukti Awareness Challenge',
    badge: 'Substance Prevention & Wellness',
    color: 'from-teal-600 to-cyan-600',
  },
  {
    id: 'national-unity-day-quiz-v1',
    title: 'National Unity Day Challenge',
    badge: 'Rashtriya Ekta Diwas (31 Oct)',
    color: 'from-amber-600 to-orange-600',
  },
];

export const QuizCurriculumManager: React.FC<{ isSuperAdmin?: boolean }> = ({ isSuperAdmin = false }) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>('nmba-awareness-challenge-v1');
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'settings'>('questions');

  // Quiz Config State
  const [quizzes, setQuizzes] = useState<QuizPortalItem[]>([]);
  const [configTitle, setConfigTitle] = useState('');
  const [configDesc, setConfigDesc] = useState('');
  const [configBadge, setConfigBadge] = useState('');
  const [configMinutes, setConfigMinutes] = useState(15);
  const [configPassScore, setConfigPassScore] = useState(70);
  const [configStatus, setConfigStatus] = useState<'active' | 'upcoming' | 'disabled'>('active');

  // Questions State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Question Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [qType, setQType] = useState<'single' | 'multiple' | 'boolean'>('single');
  const [options, setOptions] = useState<{ id: string; text: string }[]>([
    { id: 'opt-1', text: '' },
    { id: 'opt-2', text: '' },
    { id: 'opt-3', text: '' },
    { id: 'opt-4', text: '' },
  ]);
  const [correctAnswerIds, setCorrectAnswerIds] = useState<string[]>(['opt-1']);

  // Fetch quizzes metadata & questions
  const loadData = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [allQuizzes, allQuestions] = await Promise.all([
        quizService.getAdminQuizzes(),
        quizService.getAdminQuestions(selectedQuizId),
      ]);

      setQuizzes(allQuizzes);
      const matched = allQuizzes.find((q) => q.id === selectedQuizId);
      if (matched) {
        setConfigTitle(matched.title);
        setConfigDesc(matched.description);
        setConfigBadge(matched.badge);
        setConfigMinutes(matched.estimatedMinutes || 15);
        setConfigPassScore(matched.passingScorePercentage || 70);
        setConfigStatus(matched.status || 'active');
      }

      setQuestions(allQuestions as QuizQuestion[]);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err?.message || 'Failed to load quiz curriculum.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedQuizId]);

  // Handle Save Quiz Settings
  const handleSaveQuizConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      setMessage({ type: 'error', text: 'Restricted: Super Administrator clearance required.' });
      return;
    }

    setActionLoading(true);
    setMessage(null);
    try {
      await quizService.updateAdminQuiz(selectedQuizId, {
        title: configTitle,
        description: configDesc,
        badge: configBadge,
        estimatedMinutes: configMinutes,
        passingScorePercentage: configPassScore,
        status: configStatus,
      });
      setMessage({ type: 'success', text: 'Quiz metadata and parameters saved successfully!' });
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save quiz configuration.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Open New Question Modal
  const openNewModal = () => {
    setEditingQuestion(null);
    setQType('single');
    setOptions([
      { id: 'opt-1', text: '' },
      { id: 'opt-2', text: '' },
      { id: 'opt-3', text: '' },
      { id: 'opt-4', text: '' },
    ]);
    setCorrectAnswerIds(['opt-1']);
    setIsModalOpen(true);
  };

  // Open Edit Question Modal
  const openEditModal = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setQType(q.type || 'single');
    setOptions(q.options || []);
    setCorrectAnswerIds(q.correctAnswerIds || []);
    setIsModalOpen(true);
  };

  // Handle Option Text Change
  const handleOptionTextChange = (id: string, text: string) => {
    setOptions(options.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  // Handle Type Change
  const handleTypeChange = (newType: 'single' | 'multiple' | 'boolean') => {
    setQType(newType);
    if (newType === 'boolean') {
      setOptions([
        { id: 'opt-true', text: 'True' },
        { id: 'opt-false', text: 'False' },
      ]);
      setCorrectAnswerIds(['opt-true']);
    } else if (options.length < 2) {
      setOptions([
        { id: 'opt-1', text: '' },
        { id: 'opt-2', text: '' },
      ]);
    }
  };

  // Toggle Correct Option
  const handleToggleCorrect = (id: string) => {
    if (qType === 'single' || qType === 'boolean') {
      setCorrectAnswerIds([id]);
    } else {
      if (correctAnswerIds.includes(id)) {
        if (correctAnswerIds.length === 1) {
          alert('At least one correct answer is required.');
          return;
        }
        setCorrectAnswerIds(correctAnswerIds.filter((cid) => cid !== id));
      } else {
        setCorrectAnswerIds([...correctAnswerIds, id]);
      }
    }
  };

  // Save Question (Create or Edit)
  const handleSaveQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const text = (formData.get('text') as string).trim();
    const category = (formData.get('category') as string).trim();
    const explanation = (formData.get('explanation') as string).trim();
    const points = parseInt(formData.get('points') as string, 10) || 10;
    const displayOrder = parseInt(formData.get('displayOrder') as string, 10) || (questions.length + 1);
    const publicationStatus = (formData.get('publicationStatus') as 'published' | 'draft') || 'published';

    for (const opt of options) {
      if (!opt.text.trim()) {
        alert('All options must contain valid text.');
        return;
      }
    }

    if (correctAnswerIds.length === 0) {
      alert('Please mark at least one option as correct.');
      return;
    }

    const payload = {
      quizId: selectedQuizId,
      text,
      category,
      type: qType,
      options,
      correctAnswerIds,
      explanation,
      points,
      displayOrder,
      publicationStatus,
    };

    setActionLoading(true);
    try {
      if (editingQuestion) {
        await quizService.updateAdminQuestion(editingQuestion.id, payload);
        setMessage({ type: 'success', text: 'Question updated successfully.' });
      } else {
        await quizService.createAdminQuestion(payload);
        setMessage({ type: 'success', text: 'New question created in curriculum.' });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save question.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this question from the official curriculum?')) {
      return;
    }

    setActionLoading(true);
    try {
      await quizService.deleteAdminQuestion(id);
      setMessage({ type: 'success', text: 'Question deleted successfully.' });
      await loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to delete question.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          TOP BANNER & HEADER
          ========================================================================= */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#183153] to-[#0A192F] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-400/20 text-teal-300 border border-teal-400/30">
              Curriculum Administration
            </span>
            <span className="text-xs text-slate-300">NSS MJCET Dual-Challenge Portal</span>
          </div>
          <h1 className="text-2xl font-bold font-serif">Quiz Curriculum &amp; Question Bank</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Configure quiz parameters, edit questions, adjust scoring standards, and manage question order across both academic awareness challenges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openNewModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#159E9A] to-teal-500 hover:from-[#0E8581] hover:to-teal-600 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Question</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between animate-fadeIn ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage(null)} className="font-bold underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* =========================================================================
          QUIZ SELECTOR SWITCHER
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUIZZES.map((quiz) => {
          const isSelected = selectedQuizId === quiz.id;
          const config = quizzes.find((q) => q.id === quiz.id);

          return (
            <button
              key={quiz.id}
              type="button"
              onClick={() => setSelectedQuizId(quiz.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-[#183153] to-[#22446E] text-white border-[#183153] shadow-lg ring-2 ring-[#159E9A]'
                  : 'bg-white dark:bg-[#183153] text-[#183153] dark:text-white border-[#CFE3F0] dark:border-[#22416D] hover:border-[#159E9A]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">{quiz.badge}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    config?.status === 'active'
                      ? 'bg-emerald-400/20 text-emerald-300'
                      : config?.status === 'upcoming'
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-slate-400/20 text-slate-300'
                  }`}
                >
                  {config?.status || 'Active'}
                </span>
              </div>
              <h3 className="text-base font-bold font-serif mt-2">{quiz.title}</h3>
              <div className="flex items-center gap-4 text-xs opacity-75 mt-2 font-mono">
                <span>{config?.questionCount ?? questions.length} Questions</span>
                <span>•</span>
                <span>{config?.totalPoints ?? (questions.length * 10)} Total Marks</span>
                <span>•</span>
                <span>{config?.estimatedMinutes ?? 15} Mins</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub Tabs: Questions Bank vs Quiz Settings */}
      <div className="flex items-center gap-2 border-b border-[#CFE3F0] dark:border-[#22416D] pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'questions'
              ? 'bg-[#159E9A] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-[#EAF6FC] dark:hover:bg-[#1A3459]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Curriculum Question Bank ({questions.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'settings'
              ? 'bg-[#159E9A] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:bg-[#EAF6FC] dark:hover:bg-[#1A3459]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Quiz Parameters &amp; Badges</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white dark:bg-[#183153] rounded-2xl border border-[#CFE3F0] dark:border-[#22416D]">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#159E9A] mb-2" />
          <p className="text-xs text-slate-500">Loading curriculum records...</p>
        </div>
      ) : activeSubTab === 'settings' ? (
        /* =========================================================================
           QUIZ PARAMETERS CONFIGURATION TAB
           ========================================================================= */
        <div className="p-6 rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] shadow-sm space-y-6">
          <div className="border-b border-[#CFE3F0] dark:border-[#22416D] pb-3">
            <h2 className="text-sm font-bold text-[#183153] dark:text-white">
              Official Quiz Parameters &amp; Distinction
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Updates to these parameters take immediate effect across public cards and evaluation engines.
            </p>
          </div>

          <form onSubmit={handleSaveQuizConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                  Challenge Title
                </label>
                <input
                  type="text"
                  value={configTitle}
                  onChange={(e) => setConfigTitle(e.target.value)}
                  disabled={!isSuperAdmin}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                  Badge Distinction Name
                </label>
                <input
                  type="text"
                  value={configBadge}
                  onChange={(e) => setConfigBadge(e.target.value)}
                  disabled={!isSuperAdmin}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                Public Mission Statement / Description
              </label>
              <textarea
                value={configDesc}
                onChange={(e) => setConfigDesc(e.target.value)}
                disabled={!isSuperAdmin}
                rows={2}
                required
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                  Estimated Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={configMinutes}
                  onChange={(e) => setConfigMinutes(parseInt(e.target.value, 10) || 15)}
                  disabled={!isSuperAdmin}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                  Passing Score Required (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={configPassScore}
                  onChange={(e) => setConfigPassScore(parseInt(e.target.value, 10) || 70)}
                  disabled={!isSuperAdmin}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                  Portal Status
                </label>
                <select
                  value={configStatus}
                  onChange={(e) => setConfigStatus(e.target.value as any)}
                  disabled={!isSuperAdmin}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                >
                  <option value="active">Active (Accepting Responses)</option>
                  <option value="upcoming">Upcoming (Coming Soon Card)</option>
                  <option value="disabled">Disabled (Offline)</option>
                </select>
              </div>
            </div>

            {isSuperAdmin && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#159E9A] hover:bg-[#0E8581] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Quiz Parameters</span>
                </button>
              </div>
            )}
          </form>
        </div>
      ) : (
        /* =========================================================================
           QUESTIONS BANK TAB
           ========================================================================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {questions.length} questions configured for this challenge</span>
            <span>Sorted by official display sequence</span>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] shadow-xs hover:border-[#159E9A] transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-[#EAF5FB] dark:bg-[#12233C] text-[#159E9A] text-xs font-bold font-mono flex items-center justify-center">
                      {q.displayOrder || idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {q.type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-teal-50 dark:bg-teal-950/40 text-[#159E9A] border border-teal-200 dark:border-teal-800">
                      {q.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {q.points} Points
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(q)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium border border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#EAF6FC] dark:hover:bg-[#1A3459] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3 text-[#159E9A]" />
                      <span>Edit</span>
                    </button>
                    {isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm font-semibold text-[#183153] dark:text-white leading-relaxed">
                  {q.text}
                </p>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt) => {
                    const isCorrect = q.correctAnswerIds?.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        className={`px-3 py-2 rounded-xl text-xs flex items-center gap-2 border ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : 'bg-[#F8FAFC] dark:bg-[#12233C] border-[#CFE3F0] dark:border-[#22416D] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{opt.text}</span>
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-[#F0F7FB] dark:bg-[#112239] p-2.5 rounded-xl border border-[#CFE3F0]/60 dark:border-[#22416D]/60 flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#159E9A] shrink-0 mt-0.5" />
                    <span><strong>Educational Context:</strong> {q.explanation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          QUESTION ADD / EDIT MODAL
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#CFE3F0] dark:border-[#22416D] pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#159E9A]" />
                <h3 className="text-base font-bold font-serif text-[#183153] dark:text-white">
                  {editingQuestion ? 'Edit Curriculum Question' : 'Create New Curriculum Question'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                  Question Text
                </label>
                <textarea
                  name="text"
                  defaultValue={editingQuestion?.text || ''}
                  rows={2}
                  required
                  placeholder="Enter the complete question prompt..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={editingQuestion?.category || 'general_awareness'}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                    Question Type
                  </label>
                  <select
                    value={qType}
                    onChange={(e) => handleTypeChange(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                  >
                    <option value="single">Single Choice (One Correct)</option>
                    <option value="multiple">Multiple Choice (Multiple Correct)</option>
                    <option value="boolean">True / False</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                    Points Awarded
                  </label>
                  <input
                    type="number"
                    name="points"
                    defaultValue={editingQuestion?.points ?? 10}
                    min="1"
                    max="100"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                  />
                </div>
              </div>

              {/* Options Management */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                    Answer Options (Click circular icon to designate correct answer)
                  </label>
                  {qType !== 'boolean' && options.length < 6 && (
                    <button
                      type="button"
                      onClick={() => {
                        const nextId = `opt-${Date.now() % 100000}`;
                        setOptions([...options, { id: nextId, text: '' }]);
                      }}
                      className="text-[11px] font-bold text-[#159E9A] hover:underline cursor-pointer"
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {options.map((opt, i) => {
                    const isCorrect = correctAnswerIds.includes(opt.id);
                    return (
                      <div key={opt.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleCorrect(opt.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                            isCorrect
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-600'
                          }`}
                          title={isCorrect ? 'Correct option' : 'Mark as correct'}
                        >
                          {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-mono">{i + 1}</span>}
                        </button>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                          placeholder={`Option ${i + 1} text...`}
                          required
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                        />
                        {qType !== 'boolean' && options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              setOptions(options.filter((o) => o.id !== opt.id));
                              setCorrectAnswerIds(correctAnswerIds.filter((cid) => cid !== opt.id));
                            }}
                            className="p-1.5 text-red-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                  Educational Explanation (Shown to participants upon submission)
                </label>
                <textarea
                  name="explanation"
                  defaultValue={editingQuestion?.explanation || ''}
                  rows={2}
                  placeholder="Provide educational background and reason for the correct choice..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                    Display Sequence Order
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    defaultValue={editingQuestion?.displayOrder ?? (questions.length + 1)}
                    min="1"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#183153] dark:text-slate-200">
                    Publication Status
                  </label>
                  <select
                    name="publicationStatus"
                    defaultValue={editingQuestion?.publicationStatus || 'published'}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#F0F7FB] dark:bg-[#112239] border border-[#CFE3F0] dark:border-[#243A5E] focus:outline-none focus:ring-2 focus:ring-[#159E9A]"
                  >
                    <option value="published">Published (Live in Quiz)</option>
                    <option value="draft">Draft (Hidden from Public)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#CFE3F0] dark:border-[#22416D]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-[#159E9A] hover:bg-[#0E8581] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingQuestion ? 'Update Question' : 'Save Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
