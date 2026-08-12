"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { MagnifyingGlass, TrendUp } from "@phosphor-icons/react";

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/30 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-[560px] bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search input header */}
        <div className="p-3.5 border-b border-[#E2E8F0] flex items-center gap-3">
          <MagnifyingGlass size={18} className="text-[#5F6673]" />
          <input
            type="text"
            autoFocus
            placeholder="Search IPOs, members, PAN, applications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[15px] font-medium tracking-tight text-[#111318] placeholder-[#7B8491] focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[12px] font-mono font-medium rounded bg-[#F1F5F9] text-[#5F6673] border border-[#E2E8F0]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-[360px] overflow-y-auto space-y-3 text-xs">
          {/* Quick Nav Section */}
          {!query && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[12px] font-medium text-[#7B8491] uppercase tracking-wider">
                Quick Navigation
              </div>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F4F6F8] text-[#111318] font-semibold text-[15px] transition-colors cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <kbd className="text-[12px] font-mono font-medium text-[#5F6673]">⌘1</kbd>
              </button>
              <button
                onClick={() => {
                  setActiveTab("ipos");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F4F6F8] text-[#111318] font-semibold text-[15px] transition-colors cursor-pointer"
              >
                <span>Open IPO Workspace</span>
                <kbd className="text-[12px] font-mono font-medium text-[#5F6673]">⌘2</kbd>
              </button>
              <button
                onClick={() => {
                  setActiveTab("portfolio");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F4F6F8] text-[#111318] font-semibold text-[15px] transition-colors cursor-pointer"
              >
                <span>Open Portfolio</span>
                <kbd className="text-[12px] font-mono font-medium text-[#5F6673]">⌘3</kbd>
              </button>
            </div>
          )}

          {/* IPO Opportunities */}
          {filteredIpos.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[12px] font-medium text-[#7B8491] uppercase tracking-wider">
                IPO Opportunities
              </div>
              {filteredIpos.map((ipo) => (
                <button
                  key={ipo.id}
                  onClick={() => {
                    openIpoDetail(ipo);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F4F6F8] text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendUp size={16} className="text-[#2563EB]" />
                    <div>
                      <div className="text-[15px] font-semibold text-[#111318]">{ipo.name}</div>
                      <div className="text-[13px] font-normal text-[#5F6673]">{ipo.company}</div>
                    </div>
                  </div>
                  <span className="text-[12px] font-medium text-[#12B76A] bg-[#ECFDF3] px-2 py-0.5 rounded border border-[#A6F4C5]">
                    {ipo.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Group Members */}
          {filteredMembers.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[12px] font-medium text-[#7B8491] uppercase tracking-wider">
                Syndicate Members
              </div>
              {filteredMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveTab("members");
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F4F6F8] text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-[15px] font-semibold text-[#111318]">{m.name}</span>
                  </div>
                  <span className="text-[13px] font-mono text-[#5F6673]">{m.panMasked}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[13px] text-[#5F6673]">
          <span>Type to search IPOs, PAN, members...</span>
          <span className="font-mono text-[12px] font-medium">NEXO Command ⌘K</span>
        </div>
      </div>
    </div>
  );
}
