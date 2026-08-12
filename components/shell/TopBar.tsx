"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { MagnifyingGlass, SignOut, User, CaretDown, ShieldCheck } from "@phosphor-icons/react";
import { AvailableCapitalPopover } from "./AvailableCapitalPopover";
import { CommandPalette } from "../ui/CommandPalette";

export function TopBar() {
  const { activeTab, portfolioSummary, members, currentUser: sessionUser, logout } = useNexo();
  const activeUser = sessionUser || members[0];
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    ipos: "IPO Workspace",
    applications: "Applications",
    portfolio: "Portfolio",
    members: "Group Members",
    premium: "Nexo Premium",
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-13 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
        {/* Title & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#5F6673]">
          <span className="text-[#111318] font-semibold">{titles[activeTab] || "Dashboard"}</span>
          <span>/</span>
          <span className="text-[#7B8491]">Private Group</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="h-8.5 w-64 hidden sm:flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl px-3 text-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <MagnifyingGlass size={15} className="text-[#5F6673]" />
              <span className="text-xs font-normal text-[#5F6673]">Search IPOs, members, PAN...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[12px] font-mono font-medium rounded bg-white text-[#5F6673] border border-[#E2E8F0]">
              ⌘K
            </kbd>
          </button>

          {/* Available Capital Indicator Popover */}
          <AvailableCapitalPopover summary={portfolioSummary} />

          {/* Profile Circle Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title={activeUser?.name || "Account Profile"}
            >
              <img
                src={activeUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={activeUser?.name || "User"}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-[#BFDBFE]"
              />
              <CaretDown size={12} className="text-slate-500 hidden sm:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 animate-fadeIn">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <img
                    src={activeUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={activeUser?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {activeUser?.name || "Member"}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-blue-50 text-blue-600 border border-blue-100">
                        {activeUser?.role || "MEMBER"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                      {activeUser?.email || "user@nexo.private"}
                    </p>
                  </div>
                </div>

                {/* Account Details */}
                <div className="px-4 py-2 border-b border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400 text-[11px]">PAN Card</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-700">
                      {activeUser?.panMasked || "XXXXXXXX41"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-400 text-[11px]">Status</span>
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <ShieldCheck size={13} /> Active Session
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-1 px-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium cursor-pointer"
                  >
                    <SignOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
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

