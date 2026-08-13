"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  CheckCircle,
  X,
  ArrowRight,
  ShieldCheck,
  Sparkle,
  Copy,
  Check,
} from "@phosphor-icons/react";
import { useNexo } from "@/context/NexoContext";

interface ApplicationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipoName: string;
  ipoLogo?: string;
  applicantName: string;
  panCount: number;
}

export function ApplicationSuccessModal({
  isOpen,
  onClose,
  ipoName,
  ipoLogo = "⚡",
  applicantName,
  panCount,
}: ApplicationSuccessModalProps) {
  const { setActiveTab } = useNexo();
  const [copied, setCopied] = useState(false);

  // Generate reference ID when modal opens
  const appRefId = useMemo(() => {
    return `NEXO-APP-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      try {
        const confettiFn = (window as any).confetti;
        if (typeof confettiFn === "function") {
          confettiFn({
            particleCount: 80,
            spread: 65,
            origin: { y: 0.6 },
            colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
          });
        }
      } catch (err) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyRef = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(appRefId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewApplications = () => {
    onClose();
    setActiveTab("applications");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-overlay backdrop-blur-md p-4 animate-fade-in font-sans">
      <div className="w-full max-w-[460px] bg-surface border border-line rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all transform animate-modal-pop-in">
        {/* Top Header Banner */}
        <div className="relative pt-8 pb-6 px-6 bg-gradient-to-b from-emerald-500/10 via-surface to-surface text-center border-b border-line flex flex-col items-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full text-ink-tertiary hover:text-ink hover:bg-surface-alt flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Animated Success Icon */}
          <div className="relative mb-3.5">
            <div className="absolute -inset-2 rounded-full bg-emerald-500/20 animate-pulse" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle size={38} weight="fill" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkle size={12} weight="fill" className="text-emerald-400" />
            Application Filed Successfully
          </div>

          <h3 className="text-xl font-extrabold text-ink tracking-tight">
            Congratulations! 🎉
          </h3>
          <p className="text-xs text-ink-secondary font-medium mt-1 max-w-[340px]">
            Your IPO application has been successfully recorded in the group ledger.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Application Details Summary Box */}
          <div className="p-4 rounded-2xl bg-surface-alt/70 border border-line space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-soft border border-accent/20 text-accent flex items-center justify-center font-bold text-base shadow-2xs">
                  {ipoLogo}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ink tracking-tight">
                    {ipoName}
                  </h4>
                  <p className="text-[11px] text-ink-tertiary font-medium">
                    Group IPO Entry
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 rounded-full">
                Active
              </span>
            </div>

            <hr className="border-line/60" />

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-ink-tertiary font-medium block">
                  Primary Applicant
                </span>
                <span className="text-xs font-bold text-ink truncate block">
                  {applicantName}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-ink-tertiary font-medium block">
                  PAN Cards / Lots
                </span>
                <span className="text-xs font-bold text-ink">
                  {panCount} {panCount === 1 ? "PAN Card" : "PAN Cards"}
                </span>
              </div>
            </div>

            {/* Reference ID Bar */}
            <div className="pt-1">
              <div className="p-2.5 rounded-xl bg-surface border border-line flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span className="text-[11px] text-ink-secondary font-mono">
                    Ref ID: <strong className="text-ink">{appRefId}</strong>
                  </span>
                </div>
                <button
                  onClick={handleCopyRef}
                  className="text-ink-tertiary hover:text-ink transition-colors p-1 rounded-md cursor-pointer"
                  title="Copy Reference ID"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-line text-xs font-semibold text-ink-secondary hover:bg-surface-alt hover:text-ink transition-all cursor-pointer text-center"
          >
            Done
          </button>
          <button
            onClick={handleViewApplications}
            className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs shadow-md shadow-accent/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            View Applications <ArrowRight size={14} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
