"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { MagnifyingGlass, User, Gear, SignOut } from "@phosphor-icons/react";
import { AvailableCapitalPopover } from "./AvailableCapitalPopover";
import { NotificationPopover } from "./NotificationPopover";
import { CommandPalette } from "../ui/CommandPalette";

export function TopBar() {
  const { activeTab, searchQuery, setSearchQuery, portfolioSummary, members } = useNexo();
  const currentUser = members[0];
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <header className="h-16 border-b border-slate-100 bg-white/75 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs shadow-slate-100/30">
        {/* Title & Breadcrumb + Mobile Brand Header */}
        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
          <div className="flex lg:hidden items-center gap-2 mr-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/20">
              N
            </div>
          </div>
          <span className="text-slate-900 font-extrabold text-sm sm:text-base tracking-tight hover:text-blue-600 transition-colors cursor-pointer select-none">
            {titles[activeTab] || "Dashboard"}
          </span>
          <svg className="w-3 h-3 text-slate-300 hidden sm:inline shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/60 rounded-full px-2.5 py-0.8 text-[10px] font-bold text-slate-400 shadow-3xs hidden sm:inline select-none">
            <svg className="w-2.5 h-2.5 text-slate-400 fill-current" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Private Vault
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
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
            className="h-9 w-48 md:w-64 hidden sm:flex items-center justify-between bg-slate-50/60 hover:bg-white border border-slate-200 hover:border-blue-500/40 rounded-full px-3.5 text-xs transition-all duration-200 hover:shadow-xs cursor-pointer select-none group focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <MagnifyingGlass size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-500 transition-colors truncate">Search anything...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[9px] font-sans font-bold rounded-full bg-slate-100 text-slate-400 border border-slate-200 shadow-3xs group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
              ⌘K
            </kbd>
          </button>

          {/* Available Capital Indicator Popover */}
          <AvailableCapitalPopover summary={portfolioSummary} />

          {/* Activity Bell Popover */}
          <NotificationPopover />

          {/* Profile Circle with Interactive User Dropdown */}
          <div className="relative shrink-0" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={currentUser?.name || "Ankit"}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/10 hover:ring-blue-500/30 transition-all hover:scale-[1.05] duration-200 shadow-sm"
                title={currentUser?.name || "Ankit"}
              />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl p-2.5 z-40 space-y-1 animate-fade-in text-xs font-sans">
                {/* User Info Header */}
                <div className="px-3 py-2 border-b border-slate-100 mb-1.5">
                  <p className="font-extrabold text-slate-900 text-xs truncate">
                    {currentUser?.name || "Ankit"}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate mt-0.5">
                    {currentUser?.role || "Group Admin"}
                  </p>
                </div>

                {/* Dropdown Items */}
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <User size={14} className="text-slate-400" />
                  <span>Profile Settings</span>
                </button>
                
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Gear size={14} className="text-slate-400" />
                  <span>System Settings</span>
                </button>

                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50/50 font-bold transition-colors flex items-center gap-2 cursor-pointer mt-1 border-t border-slate-100 pt-2"
                >
                  <SignOut size={14} className="text-red-500" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
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
