"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { AvailableCapitalPopover } from "./AvailableCapitalPopover";
import { NotificationPopover } from "./NotificationPopover";
import { CommandPalette } from "../ui/CommandPalette";

export function TopBar() {
  const { activeTab, searchQuery, setSearchQuery, portfolioSummary } = useNexo();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    ipos: "IPO Workspace",
    applications: "Applications",
    portfolio: "Portfolio",
    members: "Group Members",
  };

  return (
    <>
      <header className="h-13 border-b border-[#E4E7EC] bg-[#FFFFFF]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        {/* Title & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#667085]">
          <span className="text-[#111827] font-extrabold">{titles[activeTab] || "Dashboard"}</span>
          <span>/</span>
          <span className="text-[#98A2B3]">Private Group</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="h-8 w-56 hidden sm:flex items-center justify-between bg-[#F7F8FA] border border-[#E4E7EC] hover:border-[#D0D5DD] rounded-lg px-2.5 text-xs text-[#98A2B3] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <MagnifyingGlass size={14} className="text-[#667085]" />
              <span className="text-[11px] font-medium text-[#667085]">Search IPOs, members, PAN...</span>
            </div>
            <kbd className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-white text-[#667085] border border-[#E4E7EC]">
              ⌘K
            </kbd>
          </button>

          {/* Available Capital Indicator Popover */}
          <AvailableCapitalPopover summary={portfolioSummary} />

          {/* Activity Bell Popover */}
          <NotificationPopover />

          {/* Profile Circle */}
          <div className="w-7 h-7 rounded-full bg-[#EEF4FF] border border-[#D0E1FF] text-[#2F6BFF] flex items-center justify-center font-bold text-xs">
            A
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
