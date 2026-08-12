"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { MagnifyingGlass, Plus, Bell } from "@phosphor-icons/react";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";

export function TopBar() {
  const { activeTab, searchQuery, setSearchQuery, portfolioSummary, openAddIpoModal } = useNexo();

  const titles: Record<string, string> = {
    dashboard: "Workspace Dashboard",
    ipos: "IPO Opportunities",
    applications: "Group Applications",
    portfolio: "Syndicate Portfolio",
    members: "Group Members & Access",
  };

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-[#FFFFFF]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
          {titles[activeTab] || "Dashboard"}
        </h2>
        <span className="text-xs text-[#64748B] hidden md:inline font-medium">
          / Private Group Vault
        </span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Global Search Bar */}
        <div className="relative w-64 hidden sm:block">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
          />
          <input
            type="text"
            placeholder="Search IPOs, members, PAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F1F5F9] border border-[#E2E8F0] focus:border-[#2563EB] focus:bg-[#FFFFFF] rounded-xl pl-9 pr-8 py-1.5 text-xs text-[#0F172A] placeholder-[#64748B] focus:outline-none transition-all shadow-xs"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-[#FFFFFF] text-[#64748B] px-1.5 py-0.5 rounded border border-[#E2E8F0] font-mono shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Syndicate Capital Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs">
          <span className="text-[#047857] font-medium">Available:</span>
          <span className="font-extrabold text-[#059669] num-tabular">
            {formatINR(portfolioSummary.availableCapital)}
          </span>
        </div>

        {/* Activity Bell */}
        <button
          title="Group Notifications"
          className="p-2 rounded-xl bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors relative"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB]" />
        </button>


      </div>
    </header>
  );
}
