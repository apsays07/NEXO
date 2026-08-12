"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { AvailableCapitalPopover } from "./AvailableCapitalPopover";
import { NotificationPopover } from "./NotificationPopover";
import { CommandPalette } from "../ui/CommandPalette";

export function TopBar() {
  const { activeTab, searchQuery, setSearchQuery, portfolioSummary, members } = useNexo();
  const currentUser = members[0];
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    ipos: "IPO Workspace",
    applications: "Applications",
    portfolio: "Portfolio",
    members: "Group Members",
    premium: "Nexo Premium",
  };

  return (
    <>
      <header className="h-13 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        {/* Title & Breadcrumb + Mobile Brand Header */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#5F6673]">
          <div className="flex lg:hidden items-center gap-1.5 mr-1">
            <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center text-white font-bold text-xs">
              N
            </div>
          </div>
          <span className="text-[#111318] font-bold text-xs sm:text-sm">{titles[activeTab] || "Dashboard"}</span>
          <span className="hidden sm:inline">/</span>
          <span className="text-[#7B8491] hidden sm:inline">Private Group</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 sm:hidden rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#5F6673]"
            title="Search"
          >
            <MagnifyingGlass size={16} />
          </button>

          {/* Desktop Search Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="h-8.5 w-48 md:w-64 hidden sm:flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl px-3 text-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <MagnifyingGlass size={15} className="text-[#5F6673]" />
              <span className="text-xs font-normal text-[#5F6673] truncate">Search IPOs, members...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[12px] font-mono font-medium rounded bg-white text-[#5F6673] border border-[#E2E8F0]">
              ⌘K
            </kbd>
          </button>

          {/* Available Capital Indicator Popover */}
          <AvailableCapitalPopover summary={portfolioSummary} />

          {/* Activity Bell Popover */}
          <NotificationPopover />

          {/* Profile Circle */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={currentUser?.name || "Ankit"}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-[#BFDBFE]"
              title={currentUser?.name || "Ankit"}
            />
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}
