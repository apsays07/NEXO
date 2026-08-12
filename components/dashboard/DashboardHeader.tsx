"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { CalendarBlank, ShieldCheck } from "@phosphor-icons/react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader() {
  const { members } = useNexo();
  const currentUser = members[0] || { name: "Ankit", role: "ADMIN" };

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6 border-b border-[#E2E8F0] font-sans">
      {/* Left: Greeting */}
      <div className="space-y-2">
        {/* Status pill row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1 rounded-full">
            <ShieldCheck size={12} weight="fill" /> Group Verified
          </span>
          <span className="text-[11px] text-[#7B8491] font-medium">
            {currentUser.name} · {currentUser.role === "ADMIN" ? "Admin" : "Member"}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[28px] sm:text-[32px] leading-[1.2] font-bold text-[#111318] tracking-tight">
          {getGreeting()},{" "}
          <span className="text-[#2563EB]">{currentUser.name}</span>.
        </h1>

        {/* Subtitle */}
        <p className="text-[14px] text-[#5F6673] font-normal leading-relaxed">
          Your private IPO investment workspace &amp; decision center.
        </p>
      </div>

      {/* Right: Date + Quick Stat */}
      <div className="flex flex-col sm:items-end gap-2 self-start sm:self-auto">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#111318] bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-xl shadow-2xs">
          <CalendarBlank size={14} className="text-[#2563EB]" />
          <span className="num-tabular">{formattedDate}</span>
        </div>

      </div>
    </div>
  );
}
