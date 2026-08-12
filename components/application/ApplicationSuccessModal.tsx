"use client";

import React from "react";
import { CheckCircle, X } from "@phosphor-icons/react";

interface ApplicationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipoName?: string;
  ipoLogo?: string;
  applicantName?: string;
  panCount?: number;
  category?: string;
  amount?: number;
}

export function ApplicationSuccessModal({
  isOpen,
  onClose,
  ipoName,
  ipoLogo,
  applicantName,
  panCount = 1,
}: ApplicationSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <CheckCircle size={40} weight="fill" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">Application Submitted!</h3>
        <p className="text-sm text-slate-500 mb-6">
          Your IPO application for <span className="font-semibold text-slate-800">{ipoName || "the IPO"}</span> has been successfully logged.
        </p>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left space-y-3 mb-6">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Applicant</span>
            <span className="font-bold text-slate-900 truncate max-w-[180px]">{applicantName || "Primary Applicant"}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Applications / PANs</span>
            <span className="font-bold text-blue-600">{panCount} PAN Card{panCount > 1 ? "s" : ""}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
