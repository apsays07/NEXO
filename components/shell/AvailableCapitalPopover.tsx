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
    <div className="relative inline-block font-sans" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 h-10 rounded-xl bg-positive-soft/80 hover:bg-positive-soft border border-positive/30 text-xs sm:text-sm font-bold text-positive transition-all duration-150 active:scale-[0.98] shadow-3xs cursor-pointer"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive/75 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-positive"></span>
        </span>
        <span className="text-positive font-extrabold uppercase tracking-wide text-[10px]">Available:</span>
        <span className="font-black text-positive font-mono num-tabular">
          {formatINR(summary.availableCapital)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-68 rounded-2xl bg-surface/95 backdrop-blur-md border border-line/80 shadow-2xl p-4.5 z-40 space-y-4 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <span className="font-extrabold text-ink text-[13px]">Capital Breakdown</span>
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Vault</span>
          </div>

          <div className="space-y-2.5 font-medium text-ink-secondary">
            <div className="flex justify-between items-center">
              <span className="text-ink-muted font-medium">Total Capital</span>
              <span className="font-bold text-ink font-mono num-tabular">
                {formatINR(summary.totalCapital)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-ink-muted font-medium">Deployed in Holdings</span>
              <span className="font-bold text-ink font-mono num-tabular">
                {formatINR(summary.capitalDeployed)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-ink-muted font-medium">Blocked in Apps</span>
              <span className="font-bold text-caution font-mono num-tabular">
                {formatINR(summary.currentlyBlocked)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-line font-extrabold text-[13px]">
              <span className="text-positive">Available to Allocate</span>
              <span className="text-positive font-mono num-tabular">
                {formatINR(summary.availableCapital)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
