import React, { useState, useEffect } from 'react';
import {
  Download,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Eye,
  Loader2,
  Calendar,
} from 'lucide-react';
import { certificateService } from '../../services/certificateService';
import { CertificatePublicResponse } from '../../types/certificate';

interface CertificateRevealCardProps {
  attemptId: string;
  quizTitle?: string;
  participantName?: string;
}

export const CertificateRevealCard: React.FC<CertificateRevealCardProps> = ({
  attemptId,
  quizTitle,
}) => {
  const [certificate, setCertificate] = useState<CertificatePublicResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Check if certificate already exists or generate it
  useEffect(() => {
    let isMounted = true;

    const initCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. First check if already generated
        const existing = await certificateService.checkCertificateForAttempt(attemptId);
        if (existing && isMounted) {
          setCertificate(existing);
          setLoading(false);
          return;
        }

        // 2. Otherwise generate authoritative certificate
        setGenerating(true);
        const generated = await certificateService.generateCertificate(attemptId);
        if (isMounted) {
          setCertificate(generated);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Certificate generation is currently unavailable. Please try again shortly.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setGenerating(false);
        }
      }
    };

    if (attemptId) {
      initCertificate();
    }

    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  const handleCopyId = () => {
    if (certificate?.certificateId) {
      navigator.clipboard.writeText(certificate.certificateId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || generating) {
    return (
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#F0F7FB] to-white dark:from-[#112239] dark:to-[#183153] border border-[#CFE3F0] dark:border-[#22416D] text-center space-y-4 shadow-sm animate-pulse">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 mx-auto flex items-center justify-center text-[#159E9A]">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-[#183153] dark:text-white">
            Authorizing &amp; Rendering Your Official Certificate...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Digitally embedding high-resolution typography, institutional verification signatures, and tamper-resistant credentials.
          </p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center space-y-2">
        <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
          {error || 'Certificate issuance status could not be verified.'}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-xs font-bold text-amber-900 dark:text-amber-200 underline cursor-pointer"
        >
          Retry verification
        </button>
      </div>
    );
  }

  const isUnity = certificate.certificateType === 'national_unity_day';
  const downloadUrl = certificateService.getDownloadUrl(certificate.certificateId, false);
  const viewUrl = certificateService.getDownloadUrl(certificate.certificateId, true);
  const templateImg = isUnity
    ? '/assets/certificates/national_unity_day_template.png'
    : '/assets/certificates/anti_drug_awareness_template.jpg';

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-[#F4F9FD] to-[#EAF5FB] dark:from-[#12233C] dark:via-[#183153] dark:to-[#0F1E33] border-2 border-[#159E9A]/30 dark:border-[#159E9A]/40 shadow-xl space-y-6 relative overflow-hidden animate-fadeIn">
      {/* Decorative Aura Accent */}
      <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br from-[#159E9A]/20 to-teal-400/10 blur-2xl pointer-events-none" />

      {/* Header Badge & Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-teal-50 dark:bg-teal-950/60 text-[#159E9A] dark:text-[#5EEAD4] border border-teal-200 dark:border-teal-800 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Institutional Certificate Ready</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#183153] dark:text-white">
          Congratulations, {certificate.participantName}!
        </h2>

        <p className="text-xs sm:text-sm text-[#4F678A] dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
          In recognition of your exceptional civic engagement and high-scoring completion in the{' '}
          <strong className="text-[#183153] dark:text-white">{certificate.quizTitle || quizTitle}</strong>,
          your official print-ready certificate of participation has been authenticated and generated.
        </p>
      </div>

      {/* Certificate Visual Preview Card */}
      <div className="relative group max-w-xl mx-auto rounded-2xl overflow-hidden border border-[#CFE3F0] dark:border-[#22416D] shadow-md bg-white dark:bg-[#0A192F]">
        <div className="aspect-[1024/723] w-full relative">
          <img
            src={templateImg}
            alt="Official Certificate Preview"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Realistic text overlay preview simulating participant name */}
          <div className="absolute inset-0 pointer-events-none">
            {isUnity ? (
              <div
                className="absolute text-center"
                style={{
                  top: '55.5%',
                  left: '14%',
                  right: '14%',
                  transform: 'translateY(-50%)',
                }}
              >
                <span className="font-serif text-sm sm:text-base md:text-xl font-bold text-[#13264B] tracking-wide">
                  {certificate.participantName}
                </span>
              </div>
            ) : (
              <div
                className="absolute text-center"
                style={{
                  top: '52.5%',
                  left: '38.9%',
                  width: '39.0%',
                  transform: 'translateY(-50%)',
                }}
              >
                <span className="font-serif text-xs sm:text-sm md:text-base font-normal text-[#23272F]">
                  {certificate.participantName}
                </span>
              </div>
            )}
          </div>

          {/* Quick Preview Hover Trigger */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/95 text-[#183153] text-xs font-bold shadow-lg hover:bg-white transition-all flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-[#159E9A]" />
              <span>Inspect High-Res PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Credential Details Grid */}
      <div className="max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Certificate ID with Copy */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#14243D]/80 border border-[#CFE3F0] dark:border-[#243A5E] flex items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Certificate Credential ID
            </span>
            <p className="font-mono font-bold text-sm text-[#183153] dark:text-white">
              {certificate.certificateId}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyId}
            className="p-2 rounded-xl border border-[#CFE3F0] dark:border-[#243A5E] hover:bg-[#EAF6FC] dark:hover:bg-[#1E3B63] transition-colors cursor-pointer text-[#159E9A]"
            title="Copy Certificate ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Issuance Date */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#14243D]/80 border border-[#CFE3F0] dark:border-[#243A5E] flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-[#EAF5FB] dark:bg-[#1E3B63] flex items-center justify-center text-[#159E9A] shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Authenticated On
            </span>
            <p className="font-semibold text-xs text-[#183153] dark:text-white">
              {new Date(certificate.issuedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href={downloadUrl}
          download={`NSS_MJCET_Certificate_${certificate.certificateId}.pdf`}
          className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#159E9A] via-[#0E8581] to-[#0A6D69] hover:from-[#0E8581] hover:to-[#085552] text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Official PDF</span>
        </a>

        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white dark:bg-[#183153] border border-[#CFE3F0] dark:border-[#22416D] text-[#183153] dark:text-white hover:bg-[#EAF6FC] dark:hover:bg-[#1E3B63] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <ExternalLink className="w-4 h-4 text-[#159E9A]" />
          <span>View in Browser</span>
        </a>
      </div>

      {/* Security & Verification Guarantee Note */}
      <div className="pt-2 border-t border-[#CFE3F0]/60 dark:border-[#22416D]/60 flex items-center justify-center gap-2 text-[11px] text-[#4F678A] dark:text-slate-400 text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>
          Includes embedded <strong>{certificate.fontUsed}</strong> typography and permanent institutional verification. You can re-download this certificate anytime.
        </span>
      </div>
    </div>
  );
};
