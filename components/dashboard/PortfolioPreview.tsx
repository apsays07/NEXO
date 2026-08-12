"use client";

import React from "react";
import { Card } from "../ui/Card";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { ChartPie } from "@phosphor-icons/react";

interface PortfolioPreviewProps {
  ipos: IPOOpportunity[];
  onViewPortfolio: () => void;
}

export function PortfolioPreview({ ipos, onViewPortfolio }: PortfolioPreviewProps) {
  const holdings = ipos.filter(
    (i) => i.status === "HOLDING" || i.status === "SOLD" || i.status === "ALLOTTED"
  );

  return (
    <Card className="p-6 bg-white border-[#E2E8F0] shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChartPie size={18} className="text-[#2563EB]" />
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A]">PORTFOLIO</h3>
            <p className="text-xs text-[#64748B] font-medium">
              Current holdings and performance.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewPortfolio}
          className="text-xs text-[#2563EB] hover:underline font-extrabold"
        >
          View portfolio →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {holdings.map((item) => {
          const invested = item.combinedCapital || 30000;
          const currentVal =
            item.currentPrice && item.issuePrice
              ? (item.currentPrice / item.issuePrice) * invested
              : invested * (1 + (item.listingGainPercent || 0) / 100);
          const returnPercent = item.listingGainPercent || 0;

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs hover:border-[#CBD5E1] transition-colors"
            >
              <div>
                <div className="font-extrabold text-[#0F172A] text-sm">{item.name}</div>
                <div className="text-[11px] text-[#64748B] font-medium mt-0.5">
                  {formatINR(invested)} invested
                </div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-[#0F172A] num-tabular">
                  {formatINR(currentVal)} current
                </div>
                <div className="text-[#059669] font-extrabold num-tabular mt-0.5">
                  +{returnPercent}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
