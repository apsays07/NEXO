"use client";

import React from "react";
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

declare const confetti: any;


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
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      // Primary center splash
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
      });
      // Side sprays for a celebratory feel
      const end = Date.now() + 1000;
      const interval = setInterval(() => {
        if (Date.now() > end) return clearInterval(interval);
        confetti({
          particleCount: 25,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
        });
        confetti({
          particleCount: 25,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"],
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const appRefId = `NEXO-APP-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(appRefId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewApplications = () => {
    onClose();
    setActiveTab("applications");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in font-sans">
      <div className="w-full max-w-[480px] bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all transform animate-modal-pop-in">
        {/* Top Header Background Banner */}
        <div className="relative pt-8 pb-6 px-6 bg-gradient-to-b from-emerald-50/90 via-white to-white text-center border-b border-slate-100 flex flex-col items-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Animated Success Badge with Pulse Ring & Bounce */}
          <div className="relative mb-3.5">
            <div className="absolute -inset-2 rounded-full bg-emerald-500/20 animate-pulse-glow" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-check-bounce">
              <CheckCircle size={38} weight="fill" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkle size={12} weight="fill" className="text-emerald-600" />
            Application Filed
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Congratulations! 🎉
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-[340px]">
            Your IPO application has been successfully recorded in the group ledger.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Application Details Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-base shadow-2xs">
                  {ipoLogo}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                    {ipoName}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Group IPO Entry
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                Active
              </span>
            </div>

            <hr className="border-slate-200/60" />

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">
                  Primary Applicant
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {applicantName}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-medium block">
                  PAN Cards / Lots
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {panCount} {panCount === 1 ? "PAN Card" : "PAN Cards"}
                </span>
              </div>
            </div>

            {/* Reference ID Bar */}
            <div className="pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span className="text-[11px] text-slate-500 font-mono">
                    Ref ID: <strong className="text-slate-800">{appRefId}</strong>
                  </span>
                </div>
                <button
                  onClick={handleCopyRef}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md"
                  title="Copy Reference ID"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer text-center"
          >
            Done
          </button>
          <button
            onClick={handleViewApplications}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            View Applications <ArrowRight size={14} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
