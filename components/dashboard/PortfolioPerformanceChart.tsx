"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import { formatINR } from "@/lib/mockData";
import { PortfolioSummary } from "@/types/nexo";
import { TrendUp } from "@phosphor-icons/react";

interface PortfolioPerformanceChartProps {
  summary: PortfolioSummary;
}

export function PortfolioPerformanceChart({ summary }: PortfolioPerformanceChartProps) {
  const [timeframe, setTimeframe] = useState<"1M" | "3M" | "6M" | "1Y">("3M");

  return (
    <Card className="p-5 bg-surface border-line shadow-none rounded-xl space-y-4 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-ink tracking-tight">
              PORTFOLIO PERFORMANCE
            </h3>
            <p className="text-xs text-ink-secondary font-medium">
              Tracked capital growth & valuation trend
            </p>
          </div>

          {/* Timeframe Toggles */}
          <div className="flex items-center p-0.5 rounded-lg bg-surface-alt border border-line text-xs">
            {(["1M", "3M", "6M", "1Y"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  timeframe === t
                    ? "bg-surface text-[#2F6BFF] shadow-2xs"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Current Valuation Display */}
        <div className="flex items-baseline gap-3 mt-3">
          <div className="text-2xl font-extrabold text-ink num-tabular">
            {formatINR(summary.totalCapital)}
          </div>
          <span className="text-xs font-bold text-positive num-tabular flex items-center gap-0.5">
            <TrendUp size={14} /> +{summary.totalReturnPercent}% (+{formatINR(summary.totalReturn, true)})
          </span>
        </div>

        {/* Subtle Thin Line SVG Graph */}
        <div className="h-32 w-full mt-4 pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F6BFF" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#2F6BFF" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            <line x1="0" y1="20" x2="400" y2="20" stroke="#F4F6F8" strokeWidth="1" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="#F4F6F8" strokeWidth="1" />
            <line x1="0" y1="80" x2="400" y2="80" stroke="#F4F6F8" strokeWidth="1" />

            {/* Gradient Fill */}
            <path
              d="M 0 85 Q 80 70 150 55 T 300 35 L 400 15 L 400 100 L 0 100 Z"
              fill="url(#chartGradient)"
            />

            {/* Thin Line Path */}
            <path
              d="M 0 85 Q 80 70 150 55 T 300 35 L 400 15"
              fill="none"
              stroke="#2F6BFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Endpoint Dot */}
            <circle cx="400" cy="15" r="4" fill="#2F6BFF" stroke="#FFFFFF" strokeWidth="2" />
          </svg>
        </div>
      </div>

      <div className="pt-2 border-t border-line flex items-center justify-between text-[11px] text-ink-secondary">
        <span>Net asset valuation based on verified ledger</span>
        <span className="font-mono">{timeframe} Trend</span>
      </div>
    </Card>
  );
}
