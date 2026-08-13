"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKey } from "@phosphor-icons/react";
import { TextField, PasswordField, AuthError, SubmitButton } from "@/components/auth/AuthFields";

function safeNextPath(raw: string | null): string {
  if (!raw) return "/";
  try {
    const url = new URL(raw, "http://localhost");
    if (url.origin !== "http://localhost") return "/";
    if (url.pathname.startsWith("/admin")) return "/";
    return url.pathname + url.search;
  } catch {
    return "/";
  }
}

function UserLoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const nextPath     = safeNextPath(searchParams.get("next"));

  const [identifier,   setIdentifier]   = useState("");
  const [password,     setPassword]     = useState("");
  const [isCapsOn,     setIsCapsOn]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg,     setErrorMsg]     = useState<string | null>(null);

  // Redirect already-authenticated users
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.authenticated) router.replace(nextPath); })
      .catch(() => {});
  }, [router, nextPath]);

  const handleCapsKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setIsCapsOn(e.getModifierState("CapsLock"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!identifier.trim()) { setErrorMsg("Please enter your username."); return; }
    if (!password)           { setErrorMsg("Password is required."); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          usernameOrEmail: identifier.trim(),
          password,
          context: "USER",
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Invalid username or password.");
        setIsSubmitting(false);
        return;
      }

      window.location.href = nextPath;
    } catch {
      setErrorMsg("Unable to connect. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex bg-page text-ink font-sans antialiased">
      {/* ── Left Brand Panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[42%] flex-col justify-between p-14 border-r border-line relative overflow-hidden select-none">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-accent/7 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/4 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <span className="text-2xl font-black tracking-tight text-ink">NEXO</span>
        </div>

        <div className="relative z-10 space-y-5 max-w-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Private Investment Workspace
          </div>
          <h2 className="text-[27px] font-semibold tracking-tight text-ink leading-snug">
            Your group&apos;s IPO syndicate, managed with precision.
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal">
            Applications, allotments, portfolio and member activity — all in one private, secure workspace.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-3 text-xs font-medium text-ink-secondary">
            {["IPO Tracking", "Group Applications", "Live Allotments", "Portfolio View"].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-accent/60" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-ink-secondary/50">
          © {new Date().getFullYear()} NEXO Private Workspace
        </div>
      </div>

      {/* ── Right Form Container ── */}
      <div className="w-full lg:w-[58%] flex flex-col justify-between p-6 sm:p-12 min-h-[100dvh]">
        <div className="flex lg:hidden items-center justify-between max-w-[440px] mx-auto w-full mb-8 pt-2">
          <span className="text-xl font-black tracking-tight text-ink">NEXO</span>
          <span className="text-[11px] font-semibold text-ink-secondary/70 uppercase tracking-widest">Private</span>
        </div>

        <div className="w-full max-w-[420px] mx-auto my-auto">
          <div className="mb-8 space-y-1.5">
            <h1 className="text-[26px] font-semibold tracking-tight text-ink">Sign in to NEXO</h1>
            <p className="text-sm text-ink-secondary font-normal">Access your private investment workspace.</p>
          </div>

          <AuthError message={errorMsg} />

          <form onSubmit={handleSubmit} className="space-y-4 mt-5" noValidate>
            <TextField
              id="nexo-identifier"
              label="Username"
              type="text"
              value={identifier}
              onChange={setIdentifier}
              placeholder="Enter username (e.g. user or admin)"
              autoComplete="username"
            />

            <div>
              <PasswordField
                id="nexo-password"
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                onKeyDown={handleCapsKey}
              />
              {isCapsOn && (
                <p className="mt-1.5 text-[11px] text-amber-500 font-medium flex items-center gap-1">
                  ⚠ Caps Lock is on
                </p>
              )}
            </div>

            <SubmitButton
              label="Sign In"
              loadingLabel="Signing in..."
              isLoading={isSubmitting}
              variant="user"
            />
          </form>

          <div className="mt-8 pt-6 border-t border-line flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-1.5 text-[11px] text-ink-secondary/60">
              <LockKey className="w-3.5 h-3.5 text-accent" />
              Protected private workspace
            </div>
            <p className="text-[11px] text-ink-secondary/45 max-w-xs">
              Access restricted to authorized members provisioned by Admin.
            </p>
          </div>
        </div>

        <div className="max-w-[440px] mx-auto w-full text-center text-[11px] text-ink-secondary/40 pt-4">
          NEXO Workspace · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-page flex items-center justify-center text-xs text-ink-secondary">
        Loading...
      </div>
    }>
      <UserLoginForm />
    </Suspense>
  );
}
