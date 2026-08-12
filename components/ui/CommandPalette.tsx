"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { MagnifyingGlass, TrendUp, X } from "@phosphor-icons/react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { ipos, members, setActiveTab, openIpoDetail } = useNexo();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredIpos = ipos.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.company.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center pt-0 sm:pt-20 bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 animate-fade-in font-sans">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Container Card */}
      <div className="relative z-10 w-full sm:max-w-[560px] max-h-[85vh] sm:max-h-[500px] bg-white border-t sm:border border-[#E2E8F0] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search input header */}
        <div className="p-3.5 sm:p-4 border-b border-[#E2E8F0] flex items-center gap-3 bg-slate-50/50">
          <MagnifyingGlass size={20} className="text-[#5F6673] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search IPOs, members, PAN, applications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base font-semibold tracking-tight text-[#111318] placeholder-[#7B8491] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="sm:hidden p-1.5 text-slate-400 hover:text-slate-700"
          >
            <X size={20} />
          </button>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-white text-[#5F6673] border border-[#E2E8F0]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-[380px] overflow-y-auto space-y-3 text-xs">
          {/* Quick Nav Section */}
          {!query && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-[#7B8491] uppercase tracking-wider">
                Quick Navigation
              </div>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F4F6F8] text-[#111318] font-bold text-sm transition-colors cursor-pointer touch-target"
              >
                <span>Go to Dashboard</span>
                <kbd className="hidden sm:inline-block text-[11px] font-mono font-medium text-[#5F6673]">⌘1</kbd>
              </button>
              <button
                onClick={() => {
                  setActiveTab("ipos");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F4F6F8] text-[#111318] font-bold text-sm transition-colors cursor-pointer touch-target"
              >
                <span>Open IPO Workspace</span>
                <kbd className="hidden sm:inline-block text-[11px] font-mono font-medium text-[#5F6673]">⌘2</kbd>
              </button>
              <button
                onClick={() => {
                  setActiveTab("portfolio");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F4F6F8] text-[#111318] font-bold text-sm transition-colors cursor-pointer touch-target"
              >
                <span>Open Portfolio</span>
                <kbd className="hidden sm:inline-block text-[11px] font-mono font-medium text-[#5F6673]">⌘3</kbd>
              </button>
            </div>
          )}

          {/* IPO Matches */}
          {filteredIpos.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-[#7B8491] uppercase tracking-wider">
                IPOs ({filteredIpos.length})
              </div>
              {filteredIpos.map((ipo) => (
                <button
                  key={ipo.id}
                  onClick={() => {
                    openIpoDetail(ipo);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F4F6F8] transition-colors cursor-pointer text-left touch-target"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {ipo.logo}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {ipo.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {ipo.company}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-blue-600 shrink-0">
                    {ipo.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Member Matches */}
          {filteredMembers.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="px-3 py-1 text-[11px] font-bold text-[#7B8491] uppercase tracking-wider">
                Members ({filteredMembers.length})
              </div>
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    setActiveTab("members");
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F4F6F8] transition-colors cursor-pointer text-left touch-target"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {member.panMasked}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {member.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
