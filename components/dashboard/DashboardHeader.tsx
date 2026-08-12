"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { CalendarBlank, ShieldCheck } from "@phosphor-icons/react";

export function DashboardHeader() {
  const { members } = useNexo();
  const currentUser = members[0] || { name: "Ankit", role: "ADMIN" };

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0] font-sans">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[12px] font-medium text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck size={13} /> Syndicate Active
          </span>
          <span className="text-xs text-[#7B8491]">•</span>
          <span className="text-xs text-[#5F6673] font-medium">
            {currentUser.name} ({currentUser.role === "ADMIN" ? "Admin" : "Member"})
          </span>
        </div>
        <h1 className="nexo-h1 text-[#111318]">
          Good afternoon, {currentUser.name}.
        </h1>
        <p className="text-sm text-[#5F6673] font-normal mt-1">
          Your private investment workspace & decision center.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-[#111318] bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-xl shadow-2xs self-start sm:self-auto">
        <CalendarBlank size={15} className="text-[#2563EB]" />
        <span className="num-tabular">{formattedDate}</span>
      </div>
    </div>
  );
}
