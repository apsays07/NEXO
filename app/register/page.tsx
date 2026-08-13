"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, EnvelopeSimple, Lock, Eye, EyeSlash, ArrowRight, CheckCircle, ShieldCheck } from "@phosphor-icons/react";
import { validatePasswordStrength } from "@/src/lib/auth/password";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pwdValidation = validatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!pwdValidation.isValid) {
      setErrorMsg("Password must be at least 12 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to create account.");
        setIsSubmitting(false);
        return;
      }

      // Successful Registration & Session Creation! Navigate to Home
      window.location.href = "/";
    } catch (err) {
      console.error("Register submit error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-page text-ink p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg relative z-10 my-8">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center font-bold text-xl shadow-inner">
              N
            </div>
            <span className="text-2xl font-black tracking-tight text-ink">NEXO</span>
          </div>
          <p className="text-sm text-ink-secondary font-medium">Create Your Private Syndicate Account</p>
        </div>

        {/* Register Glass Card */}
        <div className="bg-surface/90 backdrop-blur-xl border border-line rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-ink">Create Account</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>NEXO Identity Layer</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-secondary" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ashay Patil"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-alt/60 border border-line text-ink placeholder:text-ink-secondary/50 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
            </div>

            {/* Username & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ashay"
                  className="w-full px-4 py-3 rounded-xl bg-surface-alt/60 border border-line text-ink placeholder:text-ink-secondary/50 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-secondary" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ashay@example.com"
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-surface-alt/60 border border-line text-ink placeholder:text-ink-secondary/50 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Password (Min 12 Characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-surface-alt/60 border border-line text-ink placeholder:text-ink-secondary/50 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="mt-2 flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-ink-secondary">Strength:</span>
                    <span
                      className={`font-bold ${
                        pwdValidation.strength === "Weak"
                          ? "text-rose-400"
                          : pwdValidation.strength === "Fair"
                          ? "text-amber-400"
                          : pwdValidation.strength === "Good"
                          ? "text-blue-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {pwdValidation.strength}
                    </span>
                  </div>
                  <span className="text-ink-secondary/70">{password.length}/12 chars</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-surface-alt/60 border border-line text-ink placeholder:text-ink-secondary/50 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 mt-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Creating Member Account...</span>
              ) : (
                <>
                  <span>Create NEXO Account</span>
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 pt-6 border-t border-line text-center text-xs text-ink-secondary">
            <span>Already have an account? </span>
            <Link href="/login" className="font-semibold text-accent hover:underline ml-1">
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
