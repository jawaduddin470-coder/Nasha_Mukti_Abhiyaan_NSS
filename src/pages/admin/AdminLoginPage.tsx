/**
 * Hidden Administrative Login Page
 * NSS MJCET Nasha Mukti Abhiyaan
 *
 * Dedicated, unadvertised portal for authorized Super Admins and Editors.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLoginPageProps {
  loginType: 'superadmin' | 'admin';
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ loginType }) => {
  const navigate = useNavigate();
  const { signInWithGoogle, adminUser, isLoading, error, clearError } = useAdminAuth();
  const [submitting, setSubmitting] = useState(false);

  const isSuperAdminPortal = loginType === 'superadmin';

  // If already authenticated and authorized, proceed directly to dashboard
  React.useEffect(() => {
    if (adminUser) {
      navigate('/admin', { replace: true });
    }
  }, [adminUser, navigate]);

  const handleGoogleSignIn = async () => {
    clearError();
    setSubmitting(true);
    try {
      await signInWithGoogle(isSuperAdminPortal ? 'SUPER_ADMIN' : 'EDITOR');
      navigate('/admin', { replace: true });
    } catch (err) {
      // Error state is caught by context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF6FC] text-[#183153] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Calm sky blue & teal ambient background gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(21,158,154,0.12),rgba(185,221,245,0.08),rgba(234,246,252,0))]" />

      <div className="w-full max-w-md relative z-10">
        {/* Institutional crest badge */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#EAF5FB] border border-[#CFE3F0] shadow-sm flex items-center justify-center p-2 mb-4">
            <img src="/NSS-LOGO.png" alt="NSS Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#183153] text-center font-serif">
            NSS MJCET Portal
          </h1>
          <p className="text-xs text-[#4F678A] tracking-wider uppercase mt-1 font-semibold">
            {isSuperAdminPortal ? 'Super Administrator Gateway' : 'Editorial Administration'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-br from-[#EAF5FB]/95 via-[#F4FAFD]/90 to-[#E8F3FA]/95 backdrop-blur-xl rounded-2xl p-8 border border-[#CFE3F0] shadow-xl shadow-[#183153]/5 space-y-6">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#F0FDFB] text-[#0F8380] border border-[#99F6E4]">
              {isSuperAdminPortal ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Restricted Super Admin Access</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Administrative Access</span>
                </>
              )}
            </div>
            <h2 className="text-lg font-semibold text-[#183153] pt-1">
              Verify Administrative Identity
            </h2>
            <p className="text-xs text-[#4F678A] max-w-xs mx-auto leading-relaxed">
              Sign in with your approved Google account. Unregistered accounts are strictly rejected.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading || submitting}
              className="w-full py-3.5 px-4 rounded-xl border border-[#CFE3F0] bg-[#EAF5FB] hover:bg-[#DDF3F0] text-[#183153] font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159E9A]"
            >
              {submitting || isLoading ? (
                <div className="w-5 h-5 border-2 border-[#159E9A] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-center text-[11px] text-[#64748B] border-t border-[#D7E7F0] flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-[#159E9A]" />
            <span>Encrypted Session • Verified Domain Enforcement</span>
          </div>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-[#64748B] mt-6">
          NSS MJCET Nasha Mukti Abhiyaan Management System
        </p>
      </div>
    </div>
  );
};
