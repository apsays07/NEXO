"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { MagnifyingGlass, TrendUp, Users, Files, ArrowRight, X } from "@phosphor-icons/react";

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
        } else {
          // Open
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/30 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-[560px] bg-white border border-[#E4E7EC] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search input header */}
        <div className="p-3.5 border-b border-[#E4E7EC] flex items-center gap-3">
          <MagnifyingGlass size={18} className="text-[#667085]" />
          <input
            type="text"
            autoFocus
            placeholder="Search IPOs, members, PAN, applications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-[#111827] placeholder-[#98A2B3] focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#F4F6F8] text-[#667085] border border-[#E4E7EC]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-[360px] overflow-y-auto space-y-3 text-xs">
          {/* Quick Nav Section */}
          {!query && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
                Quick Navigation
              </div>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F4F6F8] text-[#111827] font-semibold transition-colors"
              >
                <span>Go to Dashboard</span>
                <kbd className="text-[10px] font-mono text-[#667085]">⌘1</kbd>
              </button>
              <button
                onClick={() => {
                  setActiveTab("ipos");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F4F6F8] text-[#111827] font-semibold transition-colors"
              >
                <span>Open IPO Workspace</span>
                <kbd className="text-[10px] font-mono text-[#667085]">⌘2</kbd>
              </button>
              <button
                onClick={() => {
                  setActiveTab("portfolio");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F4F6F8] text-[#111827] font-semibold transition-colors"
              >
                <span>Open Portfolio</span>
                <kbd className="text-[10px] font-mono text-[#667085]">⌘3</kbd>
              </button>
            </div>
          )}

          {/* IPO Opportunities */}
          {filteredIpos.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
                IPO Opportunities
              </div>
              {filteredIpos.map((ipo) => (
                <button
                  key={ipo.id}
                  onClick={() => {
                    openIpoDetail(ipo);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F4F6F8] text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendUp size={16} className="text-[#2F6BFF]" />
                    <div>
                      <div className="font-bold text-[#111827]">{ipo.name}</div>
                      <div className="text-[11px] text-[#667085]">{ipo.company}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#12B76A] bg-[#ECFDF3] px-2 py-0.5 rounded border border-[#A6F4C5]">
                    {ipo.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Group Members */}
          {filteredMembers.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
                Syndicate Members
              </div>
              {filteredMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveTab("members");
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#F4F6F8] text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-semibold text-[#111827]">{m.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#667085]">{m.panMasked}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 border-t border-[#E4E7EC] bg-[#F7F8FA] flex items-center justify-between text-[11px] text-[#667085]">
          <span>Type to search IPOs, PAN, members...</span>
          <span className="font-mono">NEXO Command ⌘K</span>
        </div>
      </div>
    </div>
  );
}
