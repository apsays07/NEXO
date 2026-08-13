"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Lock,
  User,
  Eye,
  EyeSlash,
  ShieldCheck,
  ArrowRight,
  WarningCircle,
  Key,
  Sun,
  Moon,
} from "@phosphor-icons/react";

export function LoginForm() {
  const { members, login, authError, setAuthError } = useNexo();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(usernameInput, password);
      setIsSubmitting(false);

      if (res?.success && res?.role === "ADMIN") {
        if (typeof window !== "undefined") {
          window.location.href = "http://localhost:3001";
        }
      }
    }, 300);
  };

  const fillDemo = (u: string, p: string) => {
    setUsernameInput(u);
    setPassword(p);
    if (setAuthError) setAuthError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 text-ink font-sans antialiased overflow-hidden transition-colors duration-200">
      {/* Dynamic Theme Background Image & Glass Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url('${isDark ? "/login_bg_dark.jpg" : "/login_bg_light.jpg"}')`,
        }}
      >
        <div
          className={`absolute inset-0 backdrop-blur-sm transition-colors duration-500 ${
            isDark ? "bg-[#060911]/80" : "bg-white/75"
          }`}
        />
      </div>

      {/* Theme Toggle Button on Login Page */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-surface/90 border border-line text-ink hover:text-accent shadow-md backdrop-blur-md transition-all cursor-pointer"
        title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      >
        {isDark ? <Sun size={20} className="text-caution" /> : <Moon size={20} className="text-accent" />}
      </button>

      {/* Main Glassmorphic Login Card matching NEXO UI */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg bg-surface/90 dark:bg-surface/85 backdrop-blur-xl border border-line shadow-2xl rounded-2xl p-7 sm:p-9 transition-all duration-300">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="text-2xl font-black tracking-tight text-ink flex items-center gap-1.5">
            NEXO
            <span className="w-3 h-3 rounded-full bg-accent inline-block shadow-2xs shadow-accent/40" />
          </h1>
          <p className="text-xs text-ink-tertiary mt-1 font-normal">
            Private Group IPO Workspace
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-5 p-3 rounded-xl bg-negative-soft border border-negative/30 flex items-start gap-2 text-xs text-negative">
            <WarningCircle size={16} className="text-negative shrink-0 mt-0.5" />
            <span className="leading-snug">{authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1.5 flex items-center justify-between">
              <span>Username / User ID</span>
              <span className="text-[11px] text-ink-tertiary font-normal">Issued by Admin</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-tertiary">
                <User size={16} />
              </div>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder="Enter admin-assigned username"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-surface-alt border border-line hover:border-line-strong focus:bg-surface focus:border-accent focus:ring-2 focus:ring-accent/10 rounded-xl text-sm text-ink placeholder-ink-muted transition-colors outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-ink">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-tertiary">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder="Enter password assigned by Admin"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-surface-alt border border-line hover:border-line-strong focus:bg-surface focus:border-accent focus:ring-2 focus:ring-accent/10 rounded-xl text-sm text-ink placeholder-ink-muted transition-colors outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink-tertiary hover:text-ink transition-colors cursor-pointer"
              >
                {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me & security tag */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-line text-accent focus:ring-accent"
              />
              <span className="text-xs text-ink-tertiary">Keep me signed in</span>
            </label>
            <span className="text-[11px] text-ink-muted flex items-center gap-1">
              <ShieldCheck size={13} className="text-positive" /> Encrypted Credentials
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-accent hover:bg-accent/90 text-white font-semibold text-sm rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Dynamic Admin-Assigned Member Credentials Quick Test List */}
        <div className="mt-6 pt-5 border-t border-line">
          <div className="text-[11px] font-medium text-ink-tertiary text-center mb-2.5 flex items-center justify-center gap-1">
            <Key size={13} className="text-accent" />
            Admin-Issued Member Credentials
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(members && members.length > 0 ? members.slice(0, 4) : []).map((m) => {
              const uName = m.username || m.name.toLowerCase();
              const uPass = m.password || (m.role === "ADMIN" ? "admin123" : "user123");

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => fillDemo(uName, uPass)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-alt hover:bg-surface-hover border border-line text-left transition-colors cursor-pointer group"
                >
                  <img
                    src={m.avatar || "/oggy.png"}
                    alt={m.name}
                    className="w-6 h-6 rounded-full object-contain bg-surface p-0.5 border border-line shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-ink group-hover:text-accent truncate flex items-center gap-1">
                      {m.name}
                      {m.role === "ADMIN" && (
                        <span className="text-[9px] text-caution font-bold">ADM</span>
                      )}
                    </div>
                    <div className="text-[10px] text-ink-tertiary font-mono truncate">
                      {uName} / {uPass}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
