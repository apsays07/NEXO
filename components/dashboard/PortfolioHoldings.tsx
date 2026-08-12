"use client";

import React from "react";
import { Card } from "../ui/Card";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";

interface PortfolioHoldingsProps {
  ipos: IPOOpportunity[];
  onViewPortfolio: () => void;
}

export function PortfolioHoldings({ ipos, onViewPortfolio }: PortfolioHoldingsProps) {
  const holdings = ipos.filter(
    (i) => i.status === "HOLDING" || i.status === "SOLD" || i.status === "ALLOTTED"
  );

  return (
    <Card className="p-5 bg-white border-[#E4E7EC] shadow-none rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-[#111827] tracking-tight">
            PORTFOLIO
          </h3>
          <p className="text-xs text-[#667085] font-medium">
            Active holdings & performance
          </p>
        </div>

        <button
          type="button"
          onClick={onViewPortfolio}
          className="text-xs text-[#2F6BFF] hover:underline font-bold"
        >
          View Portfolio →
        </button>
      </div>

      <div className="space-y-2">
        {holdings.map((item) => {
          const invested = item.combinedCapital || 30000;
          const currentVal = invested * (1 + (item.listingGainPercent || 0) / 100);
          const isPositive = (item.listingGainPercent || 0) >= 0;

          return (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-[#F7F8FA] border border-[#E4E7EC] flex items-center justify-between text-xs hover:border-[#D0D5DD] transition-colors"
            >
              <div>
                <div className="font-bold text-[#111827]">{item.name}</div>
                <div className="text-[11px] text-[#667085] num-tabular">
                  {formatINR(invested)} → {formatINR(currentVal)}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-extrabold num-tabular px-2 py-0.5 rounded text-[11px] ${
                    isPositive
                      ? "bg-[#ECFDF3] text-[#12B76A] border border-[#A6F4C5]"
                      : "bg-[#FEF3F2] text-[#F04438] border border-[#FECDCA]"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {item.listingGainPercent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
