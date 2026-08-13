"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, LockKey, ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { TextField, PasswordField, AuthError } from "@/components/auth/AuthFields";

/* ─────────────────────────────────────────────────────────────────
   Validates that a redirect target is a safe internal admin path
───────────────────────────────────────────────────────────────── */
function safeAdminNext(raw: string | null): string {
  if (!raw) return "/admin";
  try {
    const url = new URL(raw, "http://localhost");
    if (url.origin !== "http://localhost") return "/admin";
    if (!url.pathname.startsWith("/admin")) return "/admin";
    return url.pathname + url.search;
  } catch {
    return "/admin";
  }
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [identifier,   setIdentifier]   = useState("");
  const [password,     setPassword]     = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg,     setErrorMsg]     = useState<string | null>(null);
  const [blockedMember, setBlockedMember] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated) {
          const role = d.user?.role || "";
          if (role === "ADMIN" || role === "SUPER_ADMIN") {
            // Already admin — send to console
            router.replace("/admin");
          } else {
            // Authenticated but not admin
            setBlockedMember(true);
          }
        }
      })
      .catch(() => {});
  }, [router]);

  const nextPath = safeAdminNext(
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("next")
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim() || !password) {
      setErrorMsg("Both credentials are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          usernameOrEmail: identifier.trim(),
          password,
          context: "ADMIN", // Server enforces ADMIN role independently
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Invalid credentials.");
        setIsSubmitting(false);
        return;
      }

      window.location.href = nextPath;
    } catch {
      setErrorMsg("Unable to connect. Please try again.");
      setIsSubmitting(false);
    }
  };

  // ── Blocked member screen ────────────────────────────────────
  if (blockedMember) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#070809] text-white font-sans antialiased p-6">
        <div className="w-full max-w-sm text-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5 text-rose-400" />
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">
              NEXO · Admin Console
            </div>
            <h1 className="text-xl font-semibold text-white">Administrative access required.</h1>
            <p className="text-sm text-white/40 leading-relaxed">
              This area is restricted to authorized NEXO administrators.<br />
              Your account does not have administrative privileges.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            ← Back to NEXO
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#070809] text-white font-sans antialiased relative overflow-hidden">

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial brand glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-[#2F6BFF]/5 blur-[130px] rounded-full pointer-events-none" />

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[360px] mx-4">

        {/* Back to member login */}
        <a
          href="/login"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/25 hover:text-white/55 transition-colors mb-9 group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          Back to member login
        </a>

        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#2F6BFF]/12 border border-[#2F6BFF]/20 flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5 text-[#6B93FF]" />
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/25 mb-2">
              NEXO · Admin Console
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight text-white leading-tight">
              Admin sign in
            </h1>
            <p className="text-sm text-white/38 font-normal mt-1 leading-relaxed">
              Secure access to the NEXO administrative workspace.
            </p>
          </div>
        </div>

        {/* Error — override colors for dark bg */}
        {errorMsg && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20
                       text-rose-400 text-xs font-medium flex items-center gap-2.5"
          >
            <span aria-hidden>⚠</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Override TextField colors for dark bg */}
          <div className="space-y-1.5">
            <label htmlFor="admin-id" className="block text-[11px] font-semibold text-white/40 tracking-wide uppercase">
              Username
            </label>
            <input
              id="admin-id"
              type="text"
              required
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="ankitgod"
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.09]
                         text-white placeholder:text-white/18 text-sm
                         focus:outline-none focus:border-[#6B93FF]/50 focus:ring-2 focus:ring-[#6B93FF]/10
                         transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-pass" className="block text-[11px] font-semibold text-white/40 tracking-wide uppercase">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-pass"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.09]
                           text-white placeholder:text-white/18 text-sm
                           focus:outline-none focus:border-[#6B93FF]/50 focus:ring-2 focus:ring-[#6B93FF]/10
                           transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 mt-2 rounded-xl bg-[#2F6BFF] text-white font-semibold text-sm
                       hover:bg-[#2F6BFF]/90 active:scale-[0.99] transition-all
                       flex items-center justify-center gap-2
                       shadow-lg shadow-[#2F6BFF]/15
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              <>
                Sign In to Admin Console
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security indicator */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-1.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-white/22">
            <LockKey className="w-3.5 h-3.5" />
            Restricted administrative access
          </div>
          <p className="text-[11px] text-white/18">
            Authorized NEXO administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}
