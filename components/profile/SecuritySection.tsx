"use client";

import React, { useState } from "react";
import { ShieldCheck, Key, LockKey, Laptop, ArrowRight } from "@phosphor-icons/react";

interface SecuritySectionProps {
  lastPasswordChange?: string;
  twoFactorEnabled?: boolean;
  activeSessionsCount?: number;
}

export function SecuritySection({
  lastPasswordChange = "Never",
  twoFactorEnabled = false,
  activeSessionsCount = 1,
}: SecuritySectionProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="p-5 sm:p-6 bg-surface border border-line rounded-2xl space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-alt border border-line-strong text-ink flex items-center justify-center font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h3 className="text-h4 font-semibold text-ink">Security</h3>
            <p className="text-caption text-ink-tertiary font-medium">
              Account authentication and session governance
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowFeedback(true);
            setTimeout(() => setShowFeedback(false), 3000);
          }}
          className="text-caption font-semibold text-accent hover:underline cursor-pointer flex items-center gap-1"
        >
          Manage Security <ArrowRight size={12} />
        </button>
      </div>

      {showFeedback && (
        <div className="p-3 rounded-xl bg-accent-soft border border-accent/20 text-accent text-caption font-semibold">
          Security settings are active and synced with current session token.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-small">
        <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-line-subtle space-y-1">
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <Key size={14} /> Password
          </span>
          <p className="font-semibold text-ink">Last changed</p>
          <p className="text-caption text-ink-tertiary font-medium">{lastPasswordChange}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-line-subtle space-y-1">
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <LockKey size={14} /> Two-Factor Auth
          </span>
          <p className="font-semibold text-ink">
            {twoFactorEnabled ? "Enabled" : "Not Enabled"}
          </p>
          <p className="text-caption text-ink-tertiary font-medium">
            {twoFactorEnabled ? "TOTP active" : "Optional extra protection"}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-line-subtle space-y-1">
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <Laptop size={14} /> Active Sessions
          </span>
          <p className="font-semibold text-ink">
            {activeSessionsCount} active session
          </p>
          <p className="text-caption text-ink-tertiary font-medium">This device</p>
        </div>
      </div>
    </div>
  );
}
