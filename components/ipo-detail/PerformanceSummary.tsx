"use client";

import React from "react";
import { Card } from "../ui/Card";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { TrendUp } from "@phosphor-icons/react";

interface PerformanceSummaryProps {
  ipo: IPOOpportunity;
}

export function PerformanceSummary({ ipo }: PerformanceSummaryProps) {
  const invested = ipo.combinedCapital || 120000;
  const gainPercent = ipo.listingGainPercent || 15.43;
  const currentVal = invested * (1 + gainPercent / 100);
  const unrealizedGain = currentVal - invested;

  return (
    <Card id="performance" className="p-6 bg-white border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendUp size={20} className="text-[#059669]" />
          <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight uppercase">
            INVESTMENT PERFORMANCE
          </h3>
        </div>
        <span className="text-xs font-black text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0] num-tabular">
          +{gainPercent}% Total Return
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
        <div>
          <span className="text-[#64748B] font-medium block">Total Invested</span>
          <span className="text-base font-extrabold text-[#0F172A] num-tabular mt-0.5 block">
            {formatINR(invested)}
          </span>
        </div>

        <div>
          <span className="text-[#64748B] font-medium block">Current Valuation</span>
          <span className="text-base font-extrabold text-[#0F172A] num-tabular mt-0.5 block">
            {formatINR(currentVal)}
          </span>
        </div>

        <div>
          <span className="text-[#64748B] font-medium block">Unrealized P&L</span>
          <span className="text-base font-extrabold text-[#059669] num-tabular mt-0.5 block">
            +{formatINR(unrealizedGain, true)}
          </span>
        </div>

        <div>
          <span className="text-[#64748B] font-medium block">Position State</span>
          <span className="text-sm font-extrabold text-[#2563EB] mt-0.5 block">
            {ipo.status === "SOLD" ? "Realized / Settled" : "ACTIVE HOLDING"}
          </span>
        </div>
      </div>
    </Card>
  );
}
