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
    <Card className="p-5 bg-surface border-line shadow-none rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-ink tracking-tight">
            PORTFOLIO
          </h3>
          <p className="text-xs text-ink-secondary font-medium">
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
              className="p-3 rounded-lg bg-page border border-line flex items-center justify-between text-xs hover:border-line-strong transition-colors"
            >
              <div>
                <div className="font-bold text-ink">{item.name}</div>
                <div className="text-[11px] text-ink-secondary num-tabular">
                  {formatINR(invested)} → {formatINR(currentVal)}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-extrabold num-tabular px-2 py-0.5 rounded text-[11px] ${
                    isPositive
                      ? "bg-positive-soft text-positive border border-positive/30"
                      : "bg-negative-soft text-negative border border-[#FECDCA]"
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
