"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { MetricCard, Card } from "../ui/Card";
import { StatusBadge } from "../ui/Badge";
import { formatINR } from "@/lib/mockData";
import { Vault, TrendUp, Coins, Percent } from "@phosphor-icons/react";

export function PortfolioView() {
  const { portfolioSummary, ipos } = useNexo();

  const activeHoldings = ipos.filter(
    (i) => i.status === "HOLDING" || i.status === "SOLD" || i.status === "ALLOTTED"
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Portfolio Overview Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Realized Gains"
          value={formatINR(portfolioSummary.realizedPnL, true)}
          change="+82.0% Avg Return"
          changeType="positive"
          subtitle="Closed positions"
          icon={<Coins size={20} className="text-[#059669]" />}
        />
        <MetricCard
          label="Unrealized Value"
          value={formatINR(portfolioSummary.unrealizedPnL, true)}
          change="+83.5% Current"
          changeType="positive"
          subtitle="Active holding positions"
          icon={<TrendUp size={20} className="text-[#059669]" />}
        />
        <MetricCard
          label="Allotment Success Rate"
          value={`${portfolioSummary.allotmentSuccessRatePercent}%`}
          subtitle="4 Allotted / 6 Applied"
          icon={<Percent size={20} className="text-[#2563EB]" />}
        />
        <MetricCard
          label="Total Capital Deployed"
          value={formatINR(portfolioSummary.capitalDeployed)}
          subtitle="Across 5 group members"
          icon={<Vault size={20} className="text-[#D97706]" />}
        />
      </div>

      {/* Detailed Holdings & History */}
      <Card className="border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="nexo-h3 text-[#111318]">
              Group Portfolio Performance & Holdings
            </h3>
            <p className="text-xs text-[#5F6673] font-normal mt-0.5">
              Track individual member shares and proportional returns
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] nexo-table-header">
                <th className="py-3 px-4">IPO / Asset</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Total Pooled</th>
                <th className="py-3 px-4">Participating Members</th>
                <th className="py-3 px-4">Issue Price</th>
                <th className="py-3 px-4">Current / Exit</th>
                <th className="py-3 px-4 text-right">Net Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] nexo-table-body">
              {activeHoldings.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#111318] text-sm">{item.name}</div>
                    <div className="text-[12px] text-[#5F6673] font-normal">{item.company}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 nexo-table-num text-[#111318]">
                    {formatINR(item.combinedCapital)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex -space-x-2">
                      {item.applications
                        .flatMap((a) => a.participants)
                        .map((p, idx) => (
                          <img
                            key={idx}
                            src={p.avatar}
                            alt={p.memberName}
                            title={`${p.memberName} (${p.percentage}%)`}
                            className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-2xs"
                          />
                        ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 nexo-table-num text-[#5F6673]">
                    ₹{item.issuePrice || item.metrics.priceBand.max}
                  </td>
                  <td className="py-3.5 px-4 nexo-table-num text-[#111318]">
                    ₹{item.currentPrice || "-"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.realizedProfit ? (
                      <div>
                        <div className="text-[#059669] font-semibold nexo-table-num">
                          {formatINR(item.realizedProfit, true)}
                        </div>
                        <div className="text-[11px] text-[#059669] font-medium">
                          +{item.listingGainPercent}% Realized
                        </div>
                      </div>
                    ) : item.listingGainPercent ? (
                      <div>
                        <div className="text-[#059669] font-semibold nexo-table-num">
                          +{item.listingGainPercent}%
                        </div>
                        <div className="text-[11px] text-[#5F6673] font-normal">Unrealized</div>
                      </div>
                    ) : (
                      <span className="text-[#7B8491] font-normal">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
