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
        className="flex items-center gap-2 px-3.5 py-1.8 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200/80 text-xs font-bold text-emerald-800 transition-all duration-150 active:scale-[0.98] shadow-3xs cursor-pointer"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-emerald-700 font-extrabold uppercase tracking-wide text-[10px]">Available:</span>
        <span className="font-black text-emerald-600 font-mono num-tabular">
          {formatINR(summary.availableCapital)}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-68 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl p-4.5 z-40 space-y-4 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="font-extrabold text-slate-900 text-[13px]">Capital Breakdown</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vault</span>
          </div>

          <div className="space-y-2.5 font-medium text-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Total Capital</span>
              <span className="font-bold text-slate-900 font-mono num-tabular">
                {formatINR(summary.totalCapital)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Deployed in Holdings</span>
              <span className="font-bold text-slate-900 font-mono num-tabular">
                {formatINR(summary.capitalDeployed)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Blocked in Apps</span>
              <span className="font-bold text-amber-600 font-mono num-tabular">
                {formatINR(summary.currentlyBlocked)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 font-extrabold text-[13px]">
              <span className="text-emerald-700">Available to Allocate</span>
              <span className="text-emerald-600 font-mono num-tabular">
                {formatINR(summary.availableCapital)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
