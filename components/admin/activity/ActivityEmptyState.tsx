"use client";
import React from "react";
import { ClockCountdown, ArrowClockwise, Warning } from "@phosphor-icons/react";

export function ActivityEmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="py-16 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#1D2026] flex items-center justify-center mx-auto">
        <ClockCountdown size={24} className="text-slate-400 dark:text-[#626A75]" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-700 dark:text-[#F5F7FA]">No activity yet</h3>
        <p className="text-xs text-slate-500 dark:text-[#858D99] mt-0.5 max-w-xs mx-auto">
          Important actions across your NEXO workspace will appear here.
        </p>
      </div>
    </div>
  );
}

export function ActivityErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="py-16 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-[#32191B] flex items-center justify-center mx-auto">
        <Warning size={24} className="text-rose-500 dark:text-[#FF6B6B]" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-700 dark:text-[#F5F7FA]">Unable to load activity</h3>
        <p className="text-xs text-slate-500 dark:text-[#858D99] mt-0.5">Something went wrong fetching audit logs.</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-[#252931] text-slate-700 dark:text-[#AEB5C0] hover:bg-slate-50 dark:hover:bg-[#1D2026] transition-colors cursor-pointer"
        >
          <ArrowClockwise size={14} />
          Try again
        </button>
      )}
    </div>
  );
}
