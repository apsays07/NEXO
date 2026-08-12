"use client";

import React from "react";
import { Card } from "../ui/Card";
import { formatINR } from "@/lib/mockData";
import { PortfolioSummary } from "@/types/nexo";
import { ChartPie } from "@phosphor-icons/react";

interface CapitalAllocationProps {
  summary: PortfolioSummary;
}

export function CapitalAllocation({ summary }: CapitalAllocationProps) {
  const { allocation } = summary;

  return (
    <Card className="p-6 bg-white border-[#E2E8F0] shadow-2xs flex flex-col justify-between h-full font-sans">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChartPie size={18} className="text-[#2563EB]" />
            <h3 className="nexo-h4 text-[#111318]">
              Where is our capital?
            </h3>
          </div>
          <span className="text-xs text-[#5F6673] font-mono font-medium">Allocation</span>
        </div>

        {/* Minimal Segmented Bar */}
        <div className="space-y-3">
          <div className="h-3 w-full rounded-full bg-[#F1F5F9] overflow-hidden flex shadow-inner">
            <div
              className="bg-[#059669] h-full transition-all duration-300"
              style={{ width: `${allocation.availablePercent}%` }}
              title={`Available: ${allocation.availablePercent}%`}
            />
            <div
              className="bg-[#D97706] h-full transition-all duration-300"
              style={{ width: `${allocation.blockedPercent}%` }}
              title={`Blocked: ${allocation.blockedPercent}%`}
            />
            <div
              className="bg-[#2563EB] h-full transition-all duration-300"
              style={{ width: `${allocation.investedPercent}%` }}
              title={`Invested: ${allocation.investedPercent}%`}
            />
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#5F6673] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                Available Capital
              </span>
              <span className="font-semibold text-[#111318] num-tabular">
                {allocation.availablePercent}% ({formatINR(summary.availableCapital)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#5F6673] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                Blocked in Applications
              </span>
              <span className="font-semibold text-[#111318] num-tabular">
                {allocation.blockedPercent}% ({formatINR(summary.currentlyBlocked)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#5F6673] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                Invested Holdings
              </span>
              <span className="font-semibold text-[#111318] num-tabular">
                {allocation.investedPercent}% ({formatINR(summary.capitalDeployed)})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-center">
        <span className="text-xs text-[#5F6673] font-semibold num-tabular">
          {formatINR(summary.totalCapital)} total tracked capital
        </span>
      </div>
    </Card>
  );
}
