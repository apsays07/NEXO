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
    <Card className="p-6 md:p-8 bg-white border-[#E2E8F0] shadow-sm">
      {/* ROW 1: TOTAL CAPITAL & OVERALL RETURN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
        <div>
          <span className="text-xs font-extrabold text-[#64748B] uppercase tracking-wider block mb-1">
            Total Capital
          </span>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] num-tabular tracking-tight">
            {formatINR(summary.totalCapital)}
          </div>
        </div>

        <div className="flex items-center gap-3 bg-[#ECFDF5] border border-[#A7F3D0] px-4 py-2.5 rounded-2xl self-start sm:self-auto shadow-2xs">
          <div className="p-2 rounded-xl bg-[#059669] text-white">
            <TrendUp size={18} weight="bold" />
          </div>
          <div>
            <span className="text-xs text-[#047857] font-semibold block">
              Overall Return
            </span>
            <span className="text-base font-black text-[#059669] num-tabular">
              +{summary.totalReturnPercent}% ({formatINR(summary.totalReturn, true)})
            </span>
          </div>
        </div>
      </div>

      {/* SUBTLE DIVIDER 1 */}
      <div className="h-px bg-[#E2E8F0] w-full" />

      {/* ROW 2: DEPLOYED, BLOCKED, AVAILABLE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6">
        <div className="sm:border-r sm:border-[#E2E8F0] sm:pr-4">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Capital Deployed
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0F172A] num-tabular mt-1">
            {formatINR(summary.capitalDeployed)}
          </div>
          <span className="text-xs text-[#64748B] font-medium block mt-0.5">
            In active holdings (40%)
          </span>
        </div>

        <div className="sm:border-r sm:border-[#E2E8F0] sm:pr-4">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Currently Blocked
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#D97706] num-tabular mt-1">
            {formatINR(summary.currentlyBlocked)}
          </div>
          <span className="text-xs text-[#D97706] font-medium block mt-0.5">
            Pending allotment (25%)
          </span>
        </div>

        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Available Capital
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#059669] num-tabular mt-1">
            {formatINR(summary.availableCapital)}
          </div>
          <span className="text-xs text-[#059669] font-medium block mt-0.5">
            Ready for allocation (35%)
          </span>
        </div>
      </div>

      {/* SUBTLE DIVIDER 2 */}
      <div className="h-px bg-[#E2E8F0] w-full" />

      {/* ROW 3: REALIZED, UNREALIZED, TOTAL RETURN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Realized Gains
          </span>
          <div className="text-lg font-extrabold text-[#059669] num-tabular mt-1">
            {formatINR(summary.realizedPnL, true)}
          </div>
          <span className="text-[11px] text-[#64748B] font-medium block mt-0.5">
            Closed trades profit
          </span>
        </div>

        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Unrealized P&L
          </span>
          <div className="text-lg font-extrabold text-[#059669] num-tabular mt-1">
            {formatINR(summary.unrealizedPnL, true)}
          </div>
          <span className="text-[11px] text-[#64748B] font-medium block mt-0.5">
            Active position value gain
          </span>
        </div>

        <div>
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block">
            Total Net Return
          </span>
          <div className="text-lg font-extrabold text-[#059669] num-tabular mt-1">
            {formatINR(summary.totalReturn, true)}
          </div>
          <span className="text-[11px] text-[#64748B] font-medium block mt-0.5">
            Combined net profit
          </span>
        </div>
      </div>
    </Card>
  );
}
