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
            ? "bg-accent-soft border-accent text-accent"
            : "bg-surface border-line text-ink-secondary hover:bg-surface-hover"
        }`}
      >
        <Funnel size={14} />
        <span>Filter</span>
        {(selectedStatus !== "ALL" || selectedDecision !== "ALL") && (
          <span className="w-2 h-2 rounded-full bg-accent" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-surface border border-line shadow-xl p-4 z-30 space-y-4 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="font-extrabold text-ink">Filter IPOs</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ink-secondary hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>

          {/* Decision filter */}
          <div>
            <label className="block text-[11px] font-bold text-ink-secondary uppercase tracking-wider mb-2">
              Group Decision
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["ALL", "APPLY", "WATCH", "SKIP"].map((d) => (
                <button
                  key={d}
                  onClick={() => applyFilter(selectedStatus, d)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedDecision === d
                      ? "bg-accent text-white"
                      : "bg-surface-alt text-ink-secondary hover:bg-surface-hover"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-bold text-ink-secondary uppercase tracking-wider mb-2">
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
                        ? "bg-accent text-white"
                        : "bg-surface-alt text-ink-secondary hover:bg-surface-hover"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-line flex items-center justify-between">
            <button
              onClick={clearFilters}
              className="text-xs text-ink-secondary hover:text-ink underline font-medium"
            >
              Reset filters
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 rounded-lg bg-accent text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
