"use client";

import React from "react";
import { Card } from "../ui/Card";
import { StatusBadge, RecommendationBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { ArrowRight, Clock, ShieldCheck } from "@phosphor-icons/react";

interface FeaturedIPOProps {
  ipo: IPOOpportunity;
  onInspect: (ipo: IPOOpportunity) => void;
}

export function FeaturedIPO({ ipo, onInspect }: FeaturedIPOProps) {
  const participants = ipo.applications.flatMap((a) => a.participants);

  return (
    <Card
      hoverable
      onClick={() => onInspect(ipo)}
      className="p-6 md:p-7 bg-gradient-to-br from-[#FFFFFF] to-[#F8FAFC] border-2 border-[#BFDBFE] shadow-md flex flex-col justify-between group"
    >
      <div>
        {/* TOP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center font-black text-lg shadow-sm shadow-[#2563EB]/20">
              {ipo.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#2563EB] text-white tracking-wide uppercase">
                  OUR CURRENT OPPORTUNITY
                </span>
                <span className="text-xs text-[#64748B] font-bold">
                  {ipo.category || "Mainboard IPO"}
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#0F172A] group-hover:text-[#2563EB] transition-colors mt-0.5">
                {ipo.name}
              </h3>
            </div>
          </div>

          <StatusBadge status={ipo.status} size="md" />
        </div>

        {/* MIDDLE */}
        <div className="py-5 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <div>
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                Offer Price Band
              </span>
              <div className="text-3xl font-black text-[#0F172A] num-tabular">
                ₹{ipo.metrics.priceBand.min} — ₹{ipo.metrics.priceBand.max}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs text-[#64748B] font-medium block">Lot Size</span>
                <span className="text-sm font-extrabold text-[#0F172A] num-tabular">
                  {ipo.metrics.lotSize} shares / lot
                </span>
              </div>
              <div>
                <span className="text-xs text-[#64748B] font-medium block">Minimum Investment</span>
                <span className="text-sm font-extrabold text-[#0F172A] num-tabular">
                  {formatINR(ipo.metrics.minInvestment)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                Application Deadline
              </span>
              <div className="text-sm font-extrabold text-[#D97706] flex items-center gap-1.5 mt-1">
                <Clock size={16} />
                <span>{ipo.metrics.closeDate}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs text-[#64748B] font-medium">Group Decision</span>
              <RecommendationBadge type={ipo.recommendation} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* SUBTLE SEPARATOR & BOTTOM */}
      <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {participants.slice(0, 4).map((p, idx) => (
              <img
                key={idx}
                src={p.avatar}
                alt={p.memberName}
                title={`${p.memberName} (${formatINR(p.contribution)})`}
                className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs"
              />
            ))}
          </div>

          <div className="text-xs">
            <span className="font-bold text-[#0F172A]">
              {ipo.participantsCount} participants
            </span>
            <span className="text-[#64748B] font-medium ml-1.5">
              ({formatINR(ipo.combinedCapital)} committed)
            </span>
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            onInspect(ipo);
          }}
        >
          View Opportunity <ArrowRight size={14} />
        </Button>
      </div>
    </Card>
  );
}
