"use client";

import React, { useState } from "react";
import { Lock, LockOpen } from "@phosphor-icons/react";

interface MaskedPANProps {
  panMasked: string;
  panFull?: string;
  className?: string;
}

export function MaskedPAN({ panMasked, panFull, className = "" }: MaskedPANProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const displayPan = isRevealed && panFull ? panFull : panMasked;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-alt border border-line text-xs font-mono text-ink-secondary font-semibold transition-colors ${className}`}
    >
      <span className="tracking-widest">{displayPan}</span>

      {panFull && (
        <button
          onClick={() => setIsRevealed(!isRevealed)}
          title={isRevealed ? "Hide full PAN" : "Reveal full PAN (Authorized)"}
          className="text-ink-secondary hover:text-ink transition-colors focus:outline-none ml-1 p-0.5 rounded hover:bg-surface-hover"
        >
          {isRevealed ? (
            <LockOpen size={12} className="text-positive" />
          ) : (
            <Lock size={12} />
          )}
        </button>
      )}
    </div>
  );
}
