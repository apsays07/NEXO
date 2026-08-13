"use client";

import React from "react";

interface MaskedPANProps {
  panMasked?: string;
  panFull?: string;
  className?: string;
}

export function MaskedPAN({ panMasked = "", panFull = "", className = "" }: MaskedPANProps) {
  let displayPan = panFull || panMasked || "ABCDE2741D";

  // If there are any X masks in displayPan, replace with clean full PAN format
  if (displayPan.includes("X")) {
    const raw = displayPan.replace(/[^A-Z0-9]/gi, "");
    const lastDigits = raw.slice(-4) || "2741";
    displayPan = `ABCDE${lastDigits.padStart(4, "0")}D`;
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-alt border border-line-strong text-xs font-mono text-ink font-bold tracking-wider ${className}`}
    >
      <span>{displayPan}</span>
    </div>
  );
}
