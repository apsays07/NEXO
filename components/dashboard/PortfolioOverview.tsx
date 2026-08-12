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
    <Card className="p-5 md:p-6 bg-white border-[#E4E7EC] shadow-none rounded-xl">
      {/* ROW 1: TOTAL CAPITAL & OVERALL RETURN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
        <div>
          <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block mb-1">
            TOTAL CAPITAL
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#111827] num-tabular tracking-tight">
            {formatINR(summary.totalCapital)}
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-[#ECFDF3] border border-[#A6F4C5] px-3.5 py-2 rounded-lg self-start sm:self-auto">
          <TrendUp size={16} className="text-[#12B76A]" />
          <div className="text-xs">
            <span className="text-[#027A48] font-medium block text-[11px]">
              Overall Return
            </span>
            <span className="font-extrabold text-[#12B76A] num-tabular">
              +{summary.totalReturnPercent}% ({formatINR(summary.totalReturn, true)})
            </span>
          </div>
        </div>
      </div>

      {/* HAIRLINE DIVIDER 1 */}
      <div className="h-px bg-[#E4E7EC] w-full" />

      {/* ROW 2: DEPLOYED, BLOCKED, AVAILABLE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-5">
        <div className="sm:border-r sm:border-[#E4E7EC] sm:pr-4">
          <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block mb-0.5">
            Deployed
          </span>
          <div className="text-xl font-extrabold text-[#111827] num-tabular">
            {formatINR(summary.capitalDeployed)}
          </div>
          <span className="text-[11px] text-[#667085] font-medium block mt-0.5">
            Active holdings (40%)
          </span>
        </div>

        <div className="sm:border-r sm:border-[#E4E4EC] sm:pr-4">
          <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block mb-0.5">
            Blocked
          </span>
          <div className="text-xl font-extrabold text-[#D98A16] num-tabular">
            {formatINR(summary.currentlyBlocked)}
          </div>
          <span className="text-[11px] text-[#D98A16] font-medium block mt-0.5">
            Pending allotment (25%)
          </span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block mb-0.5">
            Available
          </span>
          <div className="text-xl font-extrabold text-[#12B76A] num-tabular">
            {formatINR(summary.availableCapital)}
          </div>
          <span className="text-[11px] text-[#12B76A] font-medium block mt-0.5">
            Ready to allocate (35%)
          </span>
        </div>
      </div>

      {/* HAIRLINE DIVIDER 2 */}
      <div className="h-px bg-[#E4E7EC] w-full" />

      {/* ROW 3: REALIZED, UNREALIZED, TOTAL RETURN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5">
        <div>
          <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block mb-0.5">
            Realized
          </span>
          <div className="text-base font-extrabold text-[#12B76A] num-tabular">
            {formatINR(summary.realizedPnL, true)}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block mb-0.5">
            Unrealized
          </span>
          <div className="text-base font-extrabold text-[#12B76A] num-tabular">
            {formatINR(summary.unrealizedPnL, true)}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider block mb-0.5">
            Total Return
          </span>
          <div className="text-base font-extrabold text-[#12B76A] num-tabular">
            {formatINR(summary.totalReturn, true)}
          </div>
        </div>
      </div>
    </Card>
  );
}
