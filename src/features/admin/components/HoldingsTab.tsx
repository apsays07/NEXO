"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { formatINR } from "@/lib/mockData";
import { Briefcase, TrendUp, CurrencyInr } from "@phosphor-icons/react";

export function HoldingsTab() {
  const { ipos } = useNexo();
  const holdings = ipos.filter((i) => i.status === "HOLDING" || i.status === "LISTED");

  return (
    <div className="space-y-5 font-sans text-ink pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">Active Group Holdings</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Manage active portfolio holdings, current market prices, and exit strategies
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono font-bold">
            Unrealized P&L: +₹7,250
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-line p-5 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold text-ink-tertiary uppercase tracking-wider">
                <th className="py-2.5 px-3">Holding</th>
                <th className="py-2.5 px-3 text-right">Issue Price</th>
                <th className="py-2.5 px-3 text-right">Current Price</th>
                <th className="py-2.5 px-3 text-right">Group Deployed</th>
                <th className="py-2.5 px-3 text-right">Unrealized P&L</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {holdings.length > 0 ? (
                holdings.map((h) => (
                  <tr key={h.id} className="h-12 hover:bg-surface-hover transition-colors">
                    <td className="py-2 px-3 font-bold text-ink">{h.name}</td>
                    <td className="py-2 px-3 text-right font-mono text-ink-secondary">
                      ₹{h.issuePrice || h.metrics.priceBand.max}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-ink">
                      ₹{h.currentPrice || (h.issuePrice || h.metrics.priceBand.max) * 1.15}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-ink">
                      {formatINR(h.combinedCapital || 44892)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-emerald-500">
                      +{h.listingGainPercent || 15.4}%
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button className="text-xs font-semibold text-accent hover:underline cursor-pointer">
                        Update Price →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="h-12">
                  <td className="py-2 px-3 font-bold text-ink">Bajaj Housing Finance</td>
                  <td className="py-2 px-3 text-right font-mono text-ink-secondary">₹70</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-ink">₹128.5</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-ink">{formatINR(44892)}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-500">+15.43%</td>
                  <td className="py-2 px-3 text-right">
                    <button className="text-xs font-semibold text-accent hover:underline cursor-pointer">
                      Update Price →
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
