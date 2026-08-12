"use client";

import React, { useState } from "react";
import { Funnel, X, Check } from "@phosphor-icons/react";

interface FilterPopoverProps {
  onFilterChange: (filters: { status: string; decision: string }) => void;
}

export function FilterPopover({ onFilterChange }: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedDecision, setSelectedDecision] = useState("ALL");

  const applyFilter = (status: string, decision: string) => {
    setSelectedStatus(status);
    setSelectedDecision(decision);
    onFilterChange({ status, decision });
  };

  const clearFilters = () => {
    applyFilter("ALL", "ALL");
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
          selectedStatus !== "ALL" || selectedDecision !== "ALL"
            ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB]"
            : "bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"
        }`}
      >
        <Funnel size={14} />
        <span>Filter</span>
        {(selectedStatus !== "ALL" || selectedDecision !== "ALL") && (
          <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl p-4 z-30 space-y-4 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="font-extrabold text-[#0F172A]">Filter IPOs</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#64748B] hover:text-[#0F172A]"
            >
              <X size={14} />
            </button>
          </div>

          {/* Decision filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Group Decision
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["ALL", "APPLY", "WATCH", "SKIP"].map((d) => (
                <button
                  key={d}
                  onClick={() => applyFilter(selectedStatus, d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedDecision === d
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
              Lifecycle Stage
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["ALL", "APPLYING", "ALLOTMENT_PENDING", "HOLDING", "CLOSED"].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => applyFilter(st, selectedDecision)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedStatus === st
                        ? "bg-[#2563EB] text-white"
                        : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="text-xs text-[#64748B] hover:text-[#0F172A] underline font-medium"
            >
              Reset filters
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-lg bg-[#2563EB] text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
