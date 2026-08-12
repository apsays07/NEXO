"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import {
  Lock,
  User,
  Eye,
  EyeSlash,
  ShieldCheck,
  ArrowRight,
  WarningCircle,
} from "@phosphor-icons/react";

export function LoginForm() {
  const { login, authError, setAuthError } = useNexo();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const res = login(userId, password);
      setIsSubmitting(false);

      if (res?.success && res?.role === "ADMIN") {
        if (typeof window !== "undefined") {
          window.location.href = "http://localhost:3001";
        }
      }
    }, 300);
  };

  const fillDemo = (id: string, pass: string) => {
    setUserId(id);
    setPassword(pass);
    if (setAuthError) setAuthError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] p-4 sm:p-6 text-[#111318] font-sans antialiased">
      {/* Main Wide Card matching NEXO UI */}
      <div className="w-full max-w-md sm:max-w-lg bg-white border border-[#E2E8F0] rounded-2xl p-7 sm:p-9 shadow-xs">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-lg shadow-2xs mb-3">
            N
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#111318] flex items-center gap-1.5">
            NEXO
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-semibold tracking-wide">
              OS
            </span>
          </h1>
          <p className="text-xs text-[#5F6673] mt-1 font-normal">
            Private Group IPO Workspace
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="mb-5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-2 text-xs text-[#991B1B]">
            <WarningCircle size={16} className="text-[#DC2626] shrink-0 mt-0.5" />
            <span className="leading-snug">{authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User ID Field */}
          <div>
            <label className="block text-xs font-semibold text-[#111318] mb-1.5">
              User ID / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B8491]">
                <User size={16} />
              </div>
              <input
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder="Enter admin or member ID"
                required
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 rounded-xl text-sm text-[#111318] placeholder-[#94A3B8] transition-colors outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#111318]">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B8491]">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError(null);
                }}
                placeholder="Enter password"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 rounded-xl text-sm text-[#111318] placeholder-[#94A3B8] transition-colors outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7B8491] hover:text-[#111318] transition-colors cursor-pointer"
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
                className="w-3.5 h-3.5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
              />
              <span className="text-xs text-[#5F6673]">Keep me signed in</span>
            </label>
            <span className="text-[11px] text-[#7B8491] flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#12B76A]" /> Encrypted
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
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

        {/* Minimalist Quick Test Accounts */}
        <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
          <div className="text-[11px] font-medium text-[#7B8491] text-center mb-2.5">
            Quick Test Credentials
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo("admin", "admin123")}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-left transition-colors cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Ankit"
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#111318] group-hover:text-[#2563EB] truncate">
                  Ankit (Admin)
                </div>
                <div className="text-[10px] text-[#7B8491] font-mono truncate">
                  admin / admin123
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => fillDemo("ashay", "user123")}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-left transition-colors cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Ashay"
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-[#111318] group-hover:text-[#2563EB] truncate">
                  Ashay (Member)
                </div>
                <div className="text-[10px] text-[#7B8491] font-mono truncate">
                  ashay / user123
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
