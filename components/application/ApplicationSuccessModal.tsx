"use client";

import React, { useMemo, useState } from "react";
import {
  CheckCircle,
  X,
  ArrowRight,
  ShieldCheck,
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

  const appRefId = useMemo(() => {
    return `NEXO-APP-${Math.floor(100000 + Math.random() * 900000)}`;
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in font-sans">
      <div className="w-full max-w-[400px] bg-surface border border-line rounded-3xl p-6 shadow-2xl flex flex-col gap-5 transition-all transform animate-modal-pop-in relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full text-ink-tertiary hover:text-ink hover:bg-surface-alt flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Minimalist Top Success Icon */}
        <div className="flex flex-col items-center text-center pt-2 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle size={32} weight="fill" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-ink tracking-tight">
              Application Filed
            </h3>
            <p className="text-xs text-ink-secondary font-medium mt-0.5">
              {ipoName}
            </p>
          </div>
        </div>

        {/* Sleek Minimalist Detail Box */}
        <div className="p-3.5 rounded-2xl bg-surface-alt/70 border border-line/70 space-y-2.5 text-xs font-sans">
          <div className="flex items-center justify-between">
            <span className="text-ink-tertiary font-medium">Applicant</span>
            <span className="font-bold text-ink truncate max-w-[180px]">{applicantName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-ink-tertiary font-medium">Allocation</span>
            <span className="font-bold text-ink">{panCount} {panCount === 1 ? "PAN Card" : "PAN Cards"}</span>
          </div>

          <div className="pt-2 border-t border-line/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-ink-secondary font-mono text-[11px]">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{appRefId}</span>
            </div>
            <button
              onClick={handleCopyRef}
              className="text-ink-tertiary hover:text-ink transition-colors p-1 rounded-md cursor-pointer flex items-center gap-1 text-[11px]"
              title="Copy Ref ID"
            >
              {copied ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1"><Check size={12} /> Copied</span>
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
        </div>

        {/* Premium Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-line text-xs font-semibold text-ink-secondary hover:bg-surface-alt hover:text-ink transition-all cursor-pointer text-center"
          >
            Done
          </button>
          <button
            onClick={handleViewApplications}
            className="flex-1 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold text-xs shadow-md shadow-accent/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span>View Ledger</span>
            <ArrowRight size={14} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
