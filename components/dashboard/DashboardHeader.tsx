"use client";

import React from "react";
import { CalendarBlank } from "@phosphor-icons/react";

export function DashboardHeader() {
  // Format current date e.g. "Wednesday, 12 August"
  const formattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E2E8F0]">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          Good afternoon, Ashay.
        </h1>
        <p className="text-sm sm:text-base text-[#64748B] font-medium mt-1">
          Your private IPO workspace.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-xl shadow-2xs self-start sm:self-auto">
        <CalendarBlank size={16} className="text-[#2563EB]" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
