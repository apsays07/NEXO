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
    <Card className="p-6 bg-surface border-line shadow-2xs flex flex-col justify-between h-full font-sans">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ChartPie size={18} className="text-accent" />
            <h3 className="nexo-h4 text-ink">
              Where is our capital?
            </h3>
          </div>
          <span className="text-xs text-ink-secondary font-mono font-medium">Allocation</span>
        </div>

        {/* Minimal Segmented Bar */}
        <div className="space-y-3">
          <div className="h-3 w-full rounded-full bg-surface-alt overflow-hidden flex shadow-inner">
            <div
              className="bg-positive h-full transition-all duration-300"
              style={{ width: `${allocation.availablePercent}%` }}
              title={`Available: ${allocation.availablePercent}%`}
            />
            <div
              className="bg-caution h-full transition-all duration-300"
              style={{ width: `${allocation.blockedPercent}%` }}
              title={`Blocked: ${allocation.blockedPercent}%`}
            />
            <div
              className="bg-accent h-full transition-all duration-300"
              style={{ width: `${allocation.investedPercent}%` }}
              title={`Invested: ${allocation.investedPercent}%`}
            />
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink-secondary font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-positive" />
                Available Capital
              </span>
              <span className="font-semibold text-ink num-tabular">
                {allocation.availablePercent}% ({formatINR(summary.availableCapital)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink-secondary font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-caution" />
                Blocked in Applications
              </span>
              <span className="font-semibold text-ink num-tabular">
                {allocation.blockedPercent}% ({formatINR(summary.currentlyBlocked)})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink-secondary font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                Invested Holdings
              </span>
              <span className="font-semibold text-ink num-tabular">
                {allocation.investedPercent}% ({formatINR(summary.capitalDeployed)})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-line text-center">
        <span className="text-xs text-ink-secondary font-semibold num-tabular">
          {formatINR(summary.totalCapital)} total tracked capital
        </span>
      </div>
    </Card>
  );
}
