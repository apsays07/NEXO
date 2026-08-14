"use client";

import React, { useState, useRef, useEffect } from "react";
import { Member } from "@/types/nexo";
import { MagnifyingGlass, Check, CaretDown } from "@phosphor-icons/react";

interface SearchableUserSelectProps {
  members: Member[];
  selectedMemberId?: string;
  selectedUsername?: string;
  onSelect: (member: Member) => void;
  placeholder?: string;
  className?: string;
}

export function SearchableUserSelect({
  members,
  selectedMemberId,
  selectedUsername,
  onSelect,
  placeholder = "Search username...",
  className = "",
}: SearchableUserSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Find currently active selected member
  const currentSelected = members.find(
    (m) =>
      (selectedMemberId && m.id === selectedMemberId) ||
      (selectedUsername && (m.username === selectedUsername || m.name === selectedUsername || `@${m.username}` === selectedUsername))
  ) || members[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMembers = members.filter((m) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    const uName = (m.username || "").toLowerCase();
    const fName = (m.name || "").toLowerCase();
    return uName.includes(q) || fName.includes(q) || `@${uName}`.includes(q);
  });

  const displayVal = currentSelected
    ? `@${(currentSelected.username || currentSelected.name).toLowerCase()} (${currentSelected.name})`
    : "Select username...";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Selector Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-surface-alt/80 border border-line hover:border-line-strong rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ink flex items-center justify-between cursor-pointer select-none transition-all shadow-2xs"
      >
        <span className="truncate">
          {displayVal}
        </span>
        <CaretDown size={14} className="text-ink-tertiary shrink-0 ml-1" />
      </div>

      {/* Floating Search Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#0C0F1A] border border-[#1F2942] rounded-2xl shadow-2xl overflow-hidden p-2 animate-in fade-in zoom-in-95">
          {/* Real-time Filter Search Input */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#121827] border border-[#1E273E] rounded-xl mb-2">
            <MagnifyingGlass size={15} className="text-[#6B93FF] shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-xs font-medium text-white placeholder-slate-500 outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Members List */}
          <div className="max-h-52 overflow-y-auto space-y-1 pr-0.5">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m) => {
                const isSelected = currentSelected?.id === m.id;
                const uName = (m.username || m.name).toLowerCase();
                return (
                  <div
                    key={m.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(m);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#4F75FF]/20 text-[#6B93FF] font-bold border border-[#4F75FF]/30"
                        : "hover:bg-[#161E33] text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={m.avatar || "/oggy.png"}
                        alt={m.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                      />
                      <div className="min-w-0">
                        <span className="font-mono font-bold block truncate">@{uName}</span>
                        <span className="text-[10px] text-slate-400 font-normal block truncate">{m.name}</span>
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="text-[#6B93FF] shrink-0" />}
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400 font-medium">
                No matching username found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
