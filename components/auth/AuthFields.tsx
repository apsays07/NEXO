"use client";

import React, { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";

/* ── Generic text / email input ── */
interface TextFieldProps {
  id: string;
  label: string;
  type?: "text" | "email";
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

export function TextField({
  id, label, type = "text", value, onChange,
  placeholder, autoComplete, required,
}: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-ink-secondary tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-3.5 rounded-xl bg-surface border border-line text-ink
                   placeholder:text-ink-secondary/35 text-sm
                   focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15
                   transition-colors"
      />
    </div>
  );
}

/* ── Password input with visibility toggle ── */
interface PasswordFieldProps {
  id: string;
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function PasswordField({
  id, label = "Password", value, onChange, placeholder = "Enter password",
  autoComplete = "current-password", onKeyDown,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-ink-secondary tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full h-11 pl-3.5 pr-11 rounded-xl bg-surface border border-line text-ink
                     placeholder:text-ink-secondary/35 text-sm
                     focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15
                     transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-ink-secondary
                     hover:text-ink transition-colors rounded focus:outline-none"
        >
          {show ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

/* ── Inline error alert ── */
interface AuthErrorProps {
  message: string | null;
}

export function AuthError({ message }: AuthErrorProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20
                 text-rose-500 dark:text-rose-400 text-xs font-medium
                 flex items-center gap-2.5 animate-in fade-in duration-150"
    >
      <span aria-hidden>⚠</span>
      <span>{message}</span>
    </div>
  );
}

/* ── Primary submit button ── */
interface SubmitButtonProps {
  label: string;
  loadingLabel?: string;
  isLoading: boolean;
  variant?: "user" | "admin";
}

export function SubmitButton({
  label, loadingLabel = "Signing in...", isLoading, variant = "user",
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full h-11 mt-1 rounded-xl bg-accent text-white font-semibold text-sm
                 hover:bg-accent/90 active:scale-[0.99] transition-all
                 flex items-center justify-center gap-2
                 shadow-sm shadow-accent/20
                 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
