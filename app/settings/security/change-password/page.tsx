"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Eye, EyeSlash, Check, X } from "@phosphor-icons/react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"LOADING" | "AUTHORIZED" | "REDIRECTING">("LOADING");

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Password validation real-time states
  const isMinLength = newPassword.length >= 6;
  const isMatch = newPassword && newPassword === confirmPassword;

  const isFormValid = isMinLength && isMatch;

  useEffect(() => {
    document.title = "NEXO - Set New Password";
    
    // Check auth status
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.replace("/login");
        } else {
          setStatus("AUTHORIZED");
        }
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isFormValid) {
      setErrorMsg("Please satisfy all password security requirements.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg("✓ Password updated successfully! All other active sessions have been signed out.");
        setStatus("REDIRECTING");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setErrorMsg(data.error || "Failed to update your password. Please verify your temporary password.");
      }
    } catch {
      setErrorMsg("An unexpected connection error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "LOADING" || status === "REDIRECTING") {
    return (
      <div className="min-h-screen w-full bg-[#090A0C] flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center animate-pulse">
            <ShieldCheck size={28} weight="bold" />
          </div>
          <p className="text-xs font-semibold text-slate-400 tracking-wide">
            {status === "REDIRECTING" ? "Applying changes and redirecting..." : "Verifying secure context..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-[#090A0C] text-slate-900 dark:text-[#F5F7FA] font-sans antialiased relative overflow-hidden select-none transition-colors">
      {/* Background Gradient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 dark:bg-[#6B93FF]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] backdrop-blur-xl rounded-2xl p-7 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-[#17233D] border border-blue-200 dark:border-[#6B93FF]/30 text-blue-600 dark:text-[#6B93FF] flex items-center justify-center shadow-inner">
              <Lock size={22} weight="bold" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-[#858D99] uppercase font-mono mb-1">
                Security Policy Enforcement
              </p>
              <h1 className="text-xl font-black text-slate-900 dark:text-[#F5F7FA] tracking-tight">
                Create a new password
              </h1>
              <p className="text-xs text-slate-500 dark:text-[#858D99] leading-relaxed">
                NEXO requires a password update to secure your newly provisioned or reset account.
              </p>
            </div>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-[#32191B] border border-rose-200 dark:border-[#FF6B6B]/30 text-rose-700 dark:text-[#FF6B6B] text-xs font-semibold flex items-center gap-2">
              <span className="shrink-0 text-sm">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-[#102C22] border border-emerald-200 dark:border-[#32C98B]/20 text-emerald-700 dark:text-[#32C98B] text-xs font-semibold flex items-center gap-2">
              <span className="shrink-0 text-sm">✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Temporary / Current Password */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#858D99] mb-1.5 block">
                CURRENT TEMPORARY PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter temporary password"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-600 dark:focus:border-[#6B93FF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-2.5 text-slate-400 dark:text-[#858D99] hover:text-slate-600 dark:hover:text-[#F5F7FA] transition-colors"
                >
                  {showPasswords ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#858D99] mb-1.5 block">
                NEW SECURE PASSWORD
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-600 dark:focus:border-[#6B93FF] transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-[#858D99] mb-1.5 block">
                CONFIRM NEW PASSWORD
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] text-xs text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-600 dark:focus:border-[#6B93FF] transition-all"
              />
            </div>

            {/* Requirements Validation Checklist */}
            <div className="p-3 bg-slate-50 dark:bg-[#14161A] rounded-xl border border-slate-200 dark:border-[#252931] space-y-1.5">
              <p className="text-[9px] font-extrabold text-slate-400 dark:text-[#858D99] uppercase tracking-wider mb-1">
                Password Strength Requirements
              </p>
              
              <div className="flex items-center gap-2 text-[11px] font-medium">
                {isMinLength ? (
                  <Check className="text-emerald-500 shrink-0" size={12} weight="bold" />
                ) : (
                  <X className="text-slate-400 dark:text-[#626A75] shrink-0" size={12} weight="bold" />
                )}
                <span className={isMinLength ? "text-emerald-500 dark:text-emerald-400" : "text-slate-500 dark:text-[#858D99]"}>
                  At least 6 characters
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-medium border-t border-slate-200 dark:border-[#252931] pt-1.5 mt-1">
                {isMatch ? (
                  <Check className="text-emerald-500 shrink-0" size={12} weight="bold" />
                ) : (
                  <X className="text-slate-400 dark:text-[#626A75] shrink-0" size={12} weight="bold" />
                )}
                <span className={isMatch ? "text-emerald-500 dark:text-emerald-400" : "text-slate-500 dark:text-[#858D99]"}>
                  Passwords match
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-[#6B93FF] dark:hover:bg-[#527DFF] disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Updating Password..." : "Update Password & Sign In"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
