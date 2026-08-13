"use client";

import React from "react";
import { formatINR } from "@/lib/mockData";

interface ProfileStatsProps {
  activeAppsCount?: number;
  totalContribution?: number;
  activeHoldingsCount?: number;
  realizedPnl?: number;
}

export function ProfileStats({
  activeAppsCount = 3,
  totalContribution = 120000,
  activeHoldingsCount = 2,
  realizedPnl = 18400,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
      <div className="p-3.5 rounded-2xl bg-surface border border-line space-y-1">
        <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider block">
          Active Applications
        </span>
        <div className="text-h3 font-semibold text-ink num-tabular">
          {activeAppsCount}
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-surface border border-line space-y-1">
        <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider block">
          Total Contribution
        </span>
        <div className="text-h3 font-semibold text-ink num-tabular">
          {formatINR(totalContribution)}
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-surface border border-line space-y-1">
        <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider block">
          Active Holdings
        </span>
        <div className="text-h3 font-semibold text-ink num-tabular">
          {activeHoldingsCount}
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-surface border border-line space-y-1">
        <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider block">
          Realized P&L
        </span>
        <div className="text-h3 font-semibold text-positive num-tabular">
          +{formatINR(realizedPnl)}
        </div>
      </div>
    </div>
  );
}
