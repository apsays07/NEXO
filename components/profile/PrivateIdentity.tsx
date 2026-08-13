"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeSlash, ShieldCheck, CheckCircle } from "@phosphor-icons/react";

interface PrivateIdentityProps {
  panMasked?: string;
  panFull?: string;
}

export function PrivateIdentity({
  panMasked = "XXXXX2741D",
  panFull = "ABCDE2741D",
}: PrivateIdentityProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="p-5 sm:p-6 bg-surface border border-accent/20 rounded-2xl space-y-4 font-sans relative overflow-hidden">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center font-bold">
            <Lock size={18} />
          </div>
          <div>
            <h3 className="text-h4 font-semibold text-ink flex items-center gap-2">
              Private Identity
            </h3>
            <p className="text-caption text-ink-tertiary font-medium">
              Encrypted tax identity used exclusively for IPO allotment filings
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-positive-soft border border-positive/30 text-positive text-caption font-semibold">
          <CheckCircle size={13} weight="fill" />
          <span>Verified Identity</span>
        </span>
      </div>

      <div className="p-4 rounded-xl bg-surface-alt/80 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider block">
            Permanent Account Number (PAN)
          </span>
          <p className="text-h3 font-mono font-semibold text-ink tracking-wider">
            {isRevealed ? panFull : panMasked}
          </p>
        </div>

        <button
          onClick={() => setIsRevealed(!isRevealed)}
          className="px-3.5 py-1.5 rounded-xl border border-line hover:bg-surface text-ink-secondary hover:text-ink font-semibold text-caption transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
        >
          {isRevealed ? (
            <>
              <EyeSlash size={14} /> Hide PAN
            </>
          ) : (
            <>
              <Eye size={14} /> Show PAN
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 text-caption text-ink-tertiary font-medium pt-1">
        <ShieldCheck size={14} className="text-positive shrink-0" />
        <span>Full PAN is restricted to authorized group application submission contexts.</span>
      </div>
    </div>
  );
}
