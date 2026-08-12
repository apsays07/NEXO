"use client";

import React from "react";
import { Card } from "../ui/Card";
import { RecommendationBadge } from "../ui/Badge";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { Clock } from "@phosphor-icons/react";

interface IPOHeroProps {
  ipo: IPOOpportunity;
}

export function IPOHero({ ipo }: IPOHeroProps) {
  return (
    <Card id="overview" className="p-6 md:p-8 bg-white border-[#E2E8F0] shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side Info */}
        <div className="space-y-4 lg:w-2/3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-black text-base border border-[#BFDBFE]">
              {ipo.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B] font-bold">
                  {ipo.company}
                </span>
                <span className="text-[#94A3B8]">•</span>
                <span className="text-xs text-[#64748B] font-medium">
                  {ipo.category || "Mainboard IPO"}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  {ipo.name}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
            <span>Syndicate Decision:</span>
            <RecommendationBadge type={ipo.recommendation} size="sm" />
          </div>
        </div>

        {/* Right Side Financial Figures */}
        <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] lg:w-1/3 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1">
              Offer Price Band
            </span>
            <div className="text-3xl font-extrabold text-[#0F172A] num-tabular">
              ₹{ipo.metrics.priceBand.min} — ₹{ipo.metrics.priceBand.max}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E2E8F0] text-xs">
            <div>
              <span className="text-[#64748B] block text-[11px] font-medium">Lot Size</span>
              <span className="font-extrabold text-[#0F172A] num-tabular">
                {ipo.metrics.lotSize} shares
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px] font-medium">Min Investment</span>
              <span className="font-extrabold text-[#0F172A] num-tabular">
                {formatINR(ipo.metrics.minInvestment)}
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px] font-medium">Closes</span>
              <span className="font-extrabold text-[#D97706] flex items-center gap-0.5">
                <Clock size={12} />
                <span>{ipo.metrics.closeDate}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
