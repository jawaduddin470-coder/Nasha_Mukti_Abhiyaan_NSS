import React, { useState } from 'react';
import {
  User,
  Building2,
  Hash,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import {
  ParticipantRegistration,
  QuizRegistrationErrors,
  QuizSettings,
} from '../../types/quiz';
import { quizService } from '../../services/quizService';
import { useTheme } from '../../context/ThemeContext';

interface QuizRegistrationProps {
  settings: QuizSettings;
  onBack: () => void;
  onRegistered: (data: ParticipantRegistration) => void;
}

const DEPARTMENTS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Data Science (AI&DS)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Basic Sciences & Humanities',
  'Postgraduate / Other Institution',
];

const YEARS_OF_STUDY = [
  '1st Year B.E. / B.Tech',
  '2nd Year B.E. / B.Tech',
  '3rd Year B.E. / B.Tech',
  '4th Year B.E. / B.Tech',
  'Postgraduate (M.Tech / M.E. / Ph.D)',
  'Faculty / Institutional Staff',
];

export const QuizRegistration: React.FC<QuizRegistrationProps> = ({
  settings,
  onBack,
  onRegistered,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState<ParticipantRegistration>({
    fullName: '',
    institutionName: 'Muffakham Jah College of Engineering and Technology (MJCET)',
    rollNumber: '',
    email: '',
    phone: '',
    department: 'Computer Science & Engineering (CSE)',
    yearOfStudy: '3rd Year B.E. / B.Tech',
    consentDataProcessing: false,
    consentFutureCommunications: false,
  });

  const [errors, setErrors] = useState<QuizRegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showReviewState, setShowReviewState] = useState<boolean>(false);

  const handleInputChange = (
    field: keyof ParticipantRegistration,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof QuizRegistrationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = quizService.validateRegistration(
      formData,
      settings.requireRollNumber,
      settings.requirePhoneNumber
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setShowReviewState(true);
  };

  const handleConfirmAndStart = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onRegistered(formData);
    }, 250);
  };

  const inputControlClass = `w-full h-11 rounded-xl text-sm transition-all outline-none border focus:ring-2 focus:ring-[#159E9A]/30 ${
    isDark
      ? 'bg-[#14243D] border-[#243A5E] text-white placeholder-slate-500 focus:border-[#159E9A]'
      : 'bg-[#EAF5FB] border-[#CFE3F0] text-[#183153] placeholder-slate-400 focus:border-[#159E9A]'
  }`;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn w-full px-2 sm:px-0">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#183153] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Overview</span>
        </button>

        <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500">
          Step 1 of 3: Participant Profile
        </span>
      </div>

      <Card className="border border-[#CFE3F0] dark:border-[#243A5E] p-6 sm:p-8 shadow-soft-card">
        {!showReviewState ? (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="border-b border-[#CFE3F0] dark:border-[#243A5E] pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#183153] dark:text-white">
                Participant Registration
              </h2>
              <p className="text-xs sm:text-sm text-[#334C73] dark:text-slate-300 mt-1 leading-relaxed">
                Please provide accurate collegiate details so your participation can be recorded and verified by the NSS MJCET awareness team.
              </p>
            </div>

            {/* General form error banner */}
            {Object.keys(errors).length > 0 && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 animate-fadeIn"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Please correct the highlighted fields before starting:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 opacity-90">
                    {Object.values(errors).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Row 1: Full Name & Email Address (Desktop 2-col, Mobile 1-col) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-bold text-[#183153] dark:text-slate-200 mb-1.5"
                  >
                    Full Name <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="e.g. Mohammed Farhan"
                      className={`${inputControlClass} pl-10 pr-4 ${
                        errors.fullName ? 'border-red-500 ring-1 ring-red-500' : ''
                      }`}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    />
                  </div>
                  {errors.fullName && (
                    <p id="fullName-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-[#183153] dark:text-slate-200 mb-1.5"
                  >
                    Email Address <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="student@mjcollege.ac.in"
                      className={`${inputControlClass} pl-10 pr-4 ${
                        errors.email ? 'border-red-500 ring-1 ring-red-500' : ''
                      }`}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: College or Institution Name (Full Width) */}
              <div>
                <label
                  htmlFor="institutionName"
                  className="block text-xs font-bold text-[#183153] dark:text-slate-200 mb-1.5"
                >
                  College or Institution Name <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <input
                    id="institutionName"
                    type="text"
                    required
                    value={formData.institutionName}
                    onChange={(e) => handleInputChange('institutionName', e.target.value)}
                    placeholder="e.g. Muffakham Jah College of Engineering & Technology"
                    className={`${inputControlClass} pl-10 pr-4 ${
                      errors.institutionName ? 'border-red-500 ring-1 ring-red-500' : ''
                    }`}
                    aria-invalid={!!errors.institutionName}
                    aria-describedby={errors.institutionName ? 'institutionName-error' : undefined}
                  />
                </div>
                {errors.institutionName && (
                  <p id="institutionName-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.institutionName}
                  </p>
                )}
              </div>

              {/* Row 3: Roll Number & Mobile Number (Desktop 2-col, Mobile 1-col) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label
                    htmlFor="rollNumber"
                    className="block text-xs font-bold text-[#183153] dark:text-slate-200 mb-1.5"
                  >
                    Roll Number / Student ID {settings.requireRollNumber && <span className="text-red-500" aria-hidden="true">*</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Hash className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <input
                      id="rollNumber"
                      type="text"
                      required={settings.requireRollNumber}
                      value={formData.rollNumber}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                      placeholder="e.g. 1604-22-733-042"
                      className={`${inputControlClass} pl-10 pr-4 font-mono ${
                        errors.rollNumber ? 'border-red-500 ring-1 ring-red-500' : ''
                      }`}
                      aria-invalid={!!errors.rollNumber}
                      aria-describedby={errors.rollNumber ? 'rollNumber-error' : undefined}
                    />
                  </div>
                  {errors.rollNumber && (
                    <p id="rollNumber-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.rollNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold text-[#183153] dark:text-slate-200 mb-1.5"
                  >
                    Mobile Number {settings.requirePhoneNumber && <span className="text-red-500" aria-hidden="true">*</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      required={settings.requirePhoneNumber}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="e.g. 9876543210"
                      className={`${inputControlClass} pl-10 pr-4 font-mono ${
                        errors.phone ? 'border-red-500 ring-1 ring-red-500' : ''
                      }`}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                  </div>
                  {errors.phone && (
                    <p id="phone-error" className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Department / Branch & Year of Study (Properly Paired Academic Details) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label
                    htmlFor="department"
                    className="block text-xs font-bold text-[#183153] dark:text-slate-200 mb-1.5"
                  >
                    Department / Branch <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <BookOpen className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <select
                      id="department"
                      required
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className={`${inputControlClass} appearance-none pl-10 pr-10 cursor-pointer truncate`}
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="yearOfStudy"
                    className="block text-xs font-bold text-[#183153] dark:text-slate-200 mb-1.5"
                  >
                    Year of Study <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <select
                      id="yearOfStudy"
                      required
                      value={formData.yearOfStudy}
                      onChange={(e) => handleInputChange('yearOfStudy', e.target.value)}
                      className={`${inputControlClass} appearance-none pl-10 pr-10 cursor-pointer truncate`}
                    >
                      {YEARS_OF_STUDY.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Notice Box */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 transition-colors ${
                isDark
                  ? 'bg-[#112036]/90 border-[#243A5E]'
                  : 'bg-[#F0F7FA]/90 border-[#CFE3F0]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#159E9A] shrink-0" aria-hidden="true" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#183153] dark:text-white">
                  Participant Privacy &amp; Data Notice
                </h4>
              </div>

              <p className="text-xs text-[#334C73] dark:text-slate-300 leading-relaxed">
                The National Service Scheme (NSS MJCET) collects participant names, roll numbers, and contact details exclusively for event attendance verification and issuing certificates of participation. Your personal data is never shared with third parties, publicly displayed on leaderboards, or used for unsolicited marketing.
              </p>

              <div className="space-y-3 pt-3 border-t border-[#CFE3F0] dark:border-[#243A5E]">
                <label className="flex items-start gap-2.5 text-xs text-[#183153] dark:text-slate-200 cursor-pointer select-none">
                  <input
                    id="consentDataProcessing"
                    type="checkbox"
                    checked={formData.consentDataProcessing}
                    onChange={(e) =>
                      handleInputChange('consentDataProcessing', e.target.checked)
                    }
                    className="mt-0.5 rounded border-[#CFE3F0] text-[#159E9A] focus:ring-[#159E9A] h-4 w-4 shrink-0"
                  />
                  <span>
                    I confirm my details are accurate and consent to their processing for NSS MJCET campaign administration. <span className="text-red-500" aria-hidden="true">*</span>
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-[#334C73] dark:text-slate-300 cursor-pointer select-none">
                  <input
                    id="consentFutureCommunications"
                    type="checkbox"
                    checked={formData.consentFutureCommunications}
                    onChange={(e) =>
                      handleInputChange(
                        'consentFutureCommunications',
                        e.target.checked
                      )
                    }
                    className="mt-0.5 rounded border-[#CFE3F0] text-[#159E9A] focus:ring-[#159E9A] h-4 w-4 shrink-0"
                  />
                  <span>
                    (Optional) Keep me informed about future NSS MJCET youth welfare workshops and anti-drug campus drives.
                  </span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <Button type="button" variant="outline" size="md" onClick={onBack}>
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              >
                Review &amp; Start Quiz
              </Button>
            </div>
          </form>
        ) : (
          /* Review Confirmation State */
          <div className="space-y-6 animate-fadeIn">
            <div className="border-b border-[#CFE3F0] dark:border-[#243A5E] pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#183153] dark:text-white">
                Verify Your Registration
              </h2>
              <p className="text-xs sm:text-sm text-[#334C73] dark:text-slate-300 mt-1">
                Please confirm that your credentials are correct before entering the challenge session.
              </p>
            </div>

            <div
              className={`p-5 rounded-2xl border divide-y ${
                isDark
                  ? 'bg-[#14243D] border-[#243A5E] divide-[#243A5E] text-white'
                  : 'bg-[#F4FAFD] border-[#CFE3F0] divide-[#CFE3F0] text-[#183153]'
              }`}
            >
              <div className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400">Full Name</span>
                <span className="font-bold">{formData.fullName}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400">Institution</span>
                <span className="font-medium text-right max-w-xs">{formData.institutionName}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400">Roll Number</span>
                <span className="font-mono font-bold text-[#159E9A] dark:text-[#5EEAD4]">
                  {formData.rollNumber || 'Not provided'}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400">Email</span>
                <span className="font-mono">{formData.email}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400">Mobile</span>
                <span className="font-mono">{formData.phone || 'Not provided'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400">Department</span>
                <span className="font-medium text-right max-w-xs">{formData.department}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 dark:text-slate-400">Year of Study</span>
                <span className="font-medium">{formData.yearOfStudy}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F0FDF4] dark:bg-emerald-950/40 border border-[#BBF7D0] dark:border-emerald-800 text-xs text-[#166534] dark:text-[#86EFAC] flex items-center gap-2.5">
              <Check className="w-4 h-4 shrink-0 text-[#239B70] dark:text-[#34D399]" aria-hidden="true" />
              <span>Data processing consent recorded. Responses are evaluated confidentially.</span>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setShowReviewState(false)}
                disabled={isSubmitting}
              >
                Edit Information
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleConfirmAndStart}
                disabled={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
              >
                {isSubmitting ? 'Launching Quiz Session...' : 'Confirm & Launch Quiz'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
