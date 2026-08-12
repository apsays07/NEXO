"use client";

import React from "react";
import { CalendarBlank, ShieldCheck } from "@phosphor-icons/react";

export function DashboardHeader() {
  const formattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E4E7EC]">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold text-[#2F6BFF] bg-[#EEF4FF] border border-[#D0E1FF] px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck size={12} /> Syndicate Active
          </span>
          <span className="text-xs text-[#98A2B3]">•</span>
          <span className="text-xs text-[#667085] font-medium">Ashay (Admin)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
          Good afternoon, Ashay.
        </h1>
        <p className="text-xs sm:text-sm text-[#667085] font-medium mt-0.5">
          Your private investment workspace & decision center.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-[#111827] bg-white border border-[#E4E7EC] px-3 py-1.5 rounded-lg shadow-2xs self-start sm:self-auto">
        <CalendarBlank size={15} className="text-[#2F6BFF]" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
