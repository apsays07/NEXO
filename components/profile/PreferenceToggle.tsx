"use client";

import React from "react";

interface PreferenceToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-line-subtle last:border-0 font-sans">
      <div>
        <p className="text-small font-semibold text-ink">{label}</p>
        {description && (
          <p className="text-caption text-ink-tertiary font-medium">{description}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer relative shrink-0 ${
          checked ? "bg-accent" : "bg-line-strong"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow-2xs transition-transform transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
