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
      <header className="h-14 border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs shadow-slate-100/50">
        {/* Title & Breadcrumb + Mobile Brand Header */}
        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
          <div className="flex lg:hidden items-center gap-2 mr-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/20">
              N
            </div>
          </div>
          <span className="text-slate-900 font-extrabold text-sm sm:text-base tracking-tight">{titles[activeTab] || "Dashboard"}</span>
          <span className="text-slate-300 font-light select-none hidden sm:inline">/</span>
          <span className="text-slate-400 font-medium tracking-wide bg-slate-100/80 border border-slate-200/60 rounded-md px-2 py-0.5 text-[10px] hidden sm:inline shadow-3xs">
            Private Group
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-2 sm:hidden rounded-xl bg-slate-50 border border-slate-200/80 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-[0.98] cursor-pointer"
            title="Search"
          >
            <MagnifyingGlass size={16} />
          </button>

          {/* Desktop Search Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="h-9 w-48 md:w-64 hidden sm:flex items-center justify-between bg-slate-50/60 hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 rounded-xl px-3 text-xs transition-all duration-150 hover:shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <MagnifyingGlass size={15} className="text-slate-400 font-bold" />
              <span className="text-xs font-medium text-slate-400 truncate">Search IPOs, members...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-bold rounded-md bg-white text-slate-400 border border-slate-200 shadow-3xs">
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
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/10 hover:ring-blue-500/30 transition-all hover:scale-[1.05] duration-200 cursor-pointer shadow-sm"
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
