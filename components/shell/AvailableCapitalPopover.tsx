"use client";

import React, { useState, useRef, useEffect } from "react";
import { formatINR } from "@/lib/mockData";
import { PortfolioSummary } from "@/types/nexo";
import { Coins } from "@phosphor-icons/react";

interface AvailableCapitalPopoverProps {
  summary: PortfolioSummary;
}

export function AvailableCapitalPopover({ summary }: AvailableCapitalPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ECFDF3] border border-[#A6F4C5] text-xs font-semibold hover:bg-[#D1FADF] transition-colors cursor-pointer"
      >
        <span className="text-[#027A48] font-bold">AVAILABLE:</span>
        <span className="font-extrabold text-[#12B76A] num-tabular">
          {formatINR(summary.availableCapital)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-[#E4E7EC] shadow-xl p-4 z-40 space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-2 font-bold text-[#111827]">
            <span>Capital Breakdown</span>
            <span className="font-mono text-[#667085]">Syndicate Vault</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[#667085]">Total Capital:</span>
              <span className="font-bold text-[#111827] num-tabular">
                {formatINR(summary.totalCapital)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#667085]">Deployed in Holdings:</span>
              <span className="font-bold text-[#111827] num-tabular">
                {formatINR(summary.capitalDeployed)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#667085]">Blocked in Applications:</span>
              <span className="font-bold text-[#D98A16] num-tabular">
                {formatINR(summary.currentlyBlocked)}
              </span>
            </div>

            <div className="flex justify-between pt-2 border-t border-[#E4E7EC] font-bold">
              <span className="text-[#12B76A]">Available to Allocate:</span>
              <span className="text-[#12B76A] num-tabular">
                {formatINR(summary.availableCapital)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
