"use client";

import React from "react";
import { Card } from "../ui/Card";
import { formatINR } from "@/lib/mockData";
import { PortfolioSummary } from "@/types/nexo";
import { TrendUp } from "@phosphor-icons/react";

interface PortfolioOverviewProps {
  summary: PortfolioSummary;
}

export function PortfolioOverview({ summary }: PortfolioOverviewProps) {
  return (
    <Card className="p-4 sm:p-6 bg-surface border-line shadow-none rounded-2xl space-y-4 sm:space-y-5 font-sans">
      {/* ROW 1: TOTAL CAPITAL & OVERALL RETURN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-line">
        <div>
          <span className="text-[11px] font-bold text-ink-secondary uppercase tracking-wider block mb-1">
            TOTAL CAPITAL
          </span>
          <div className="text-2xl sm:text-4xl font-extrabold text-ink num-tabular tracking-tight">
            {formatINR(summary.totalCapital)}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-positive-soft border border-positive/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <TrendUp size={16} className="text-positive" />
          <div className="text-xs">
            <span className="text-positive font-bold block text-[10px] uppercase">
              Overall Return
            </span>
            <span className="font-extrabold text-positive num-tabular">
              +{summary.totalReturnPercent}% ({formatINR(summary.totalReturn, true)})
            </span>
          </div>
        </div>
      </div>

      {/* METRICS 2-COLUMN GRID ON MOBILE / 3-COLUMN ON DESKTOP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
        <div className="p-3 rounded-xl bg-surface-alt border border-line/80">
          <span className="text-[10px] sm:text-[11px] font-bold text-ink-secondary uppercase tracking-wider block mb-0.5">
            Capital Deployed
          </span>
          <div className="text-sm sm:text-lg font-extrabold text-ink num-tabular">
            {formatINR(summary.capitalDeployed)}
          </div>
          <span className="text-[10px] text-ink-secondary font-medium block mt-0.5">
            Active holdings
          </span>
        </div>

        <div className="p-3 rounded-xl bg-caution-soft/70 border border-amber-200/80">
          <span className="text-[10px] sm:text-[11px] font-bold text-caution uppercase tracking-wider block mb-0.5">
            Blocked
          </span>
          <div className="text-sm sm:text-lg font-extrabold text-caution num-tabular">
            {formatINR(summary.currentlyBlocked)}
          </div>
          <span className="text-[10px] text-caution font-medium block mt-0.5">
            Pending allotment
          </span>
        </div>

        <div className="p-3 rounded-xl bg-positive-soft/70 border border-positive/30 col-span-2 sm:col-span-1">
          <span className="text-[10px] sm:text-[11px] font-bold text-positive uppercase tracking-wider block mb-0.5">
            Available Capital
          </span>
          <div className="text-sm sm:text-lg font-extrabold text-positive num-tabular">
            {formatINR(summary.availableCapital)}
          </div>
          <span className="text-[10px] text-positive font-medium block mt-0.5">
            Ready to allocate
          </span>
        </div>
      </div>

      {/* RETURN SUMMARY ROW */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 border-t border-line text-center sm:text-left">
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold text-ink-secondary uppercase tracking-wider block mb-0.5">
            Realized
          </span>
          <div className="text-xs sm:text-sm font-bold text-positive num-tabular">
            {formatINR(summary.realizedPnL, true)}
          </div>
        </div>

        <div>
          <span className="text-[10px] sm:text-[11px] font-bold text-ink-secondary uppercase tracking-wider block mb-0.5">
            Unrealized
          </span>
          <div className="text-xs sm:text-sm font-bold text-positive num-tabular">
            {formatINR(summary.unrealizedPnL, true)}
          </div>
        </div>

        <div>
          <span className="text-[10px] sm:text-[11px] font-bold text-ink-secondary uppercase tracking-wider block mb-0.5">
            Total Return
          </span>
          <div className="text-xs sm:text-sm font-bold text-positive num-tabular">
            {formatINR(summary.totalReturn, true)}
          </div>
        </div>
      </div>
    </Card>
  );
}
