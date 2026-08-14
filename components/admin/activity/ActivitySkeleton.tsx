"use client";
import React from "react";

export function ActivityTimelineSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-1 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl">
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#1D2026] shrink-0" />
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="h-3 rounded-full bg-slate-200 dark:bg-[#1D2026] w-2/3" />
            <div className="h-2.5 rounded-full bg-slate-100 dark:bg-[#14161A] w-1/2" />
          </div>
          <div className="h-2.5 w-12 rounded-full bg-slate-100 dark:bg-[#14161A] shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function ActivityTableSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-0 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 dark:border-[#1B1E23]">
          <div className="h-2.5 w-14 rounded-full bg-slate-200 dark:bg-[#1D2026]" />
          <div className="h-2.5 w-24 rounded-full bg-slate-200 dark:bg-[#1D2026]" />
          <div className="h-2.5 w-40 rounded-full bg-slate-100 dark:bg-[#14161A]" />
          <div className="h-2.5 w-20 rounded-full bg-slate-100 dark:bg-[#14161A]" />
          <div className="h-2.5 w-24 rounded-full bg-slate-100 dark:bg-[#14161A]" />
          <div className="h-5 w-16 rounded-full bg-slate-100 dark:bg-[#14161A] ml-auto" />
        </div>
      ))}
    </div>
  );
}
