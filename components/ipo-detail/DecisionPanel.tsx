"use client";

import React from "react";
import { Card } from "../ui/Card";
import { RecommendationBadge } from "../ui/Badge";
import { IPOOpportunity } from "@/types/nexo";
import { ShieldCheck } from "@phosphor-icons/react";

interface DecisionPanelProps {
  ipo: IPOOpportunity;
}

export function DecisionPanel({ ipo }: DecisionPanelProps) {
  return (
    <Card id="decision" className="p-6 bg-white border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-[#059669]" />
          <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight uppercase">
            OUR DECISION
          </h3>
        </div>
        <RecommendationBadge type={ipo.recommendation} size="md" />
      </div>

      <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0]">
        <p className="text-sm font-medium text-[#047857] leading-relaxed">
          "{ipo.thesis}"
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-4">
          <span>
            Decision made by: <strong className="text-[#0F172A] font-bold">Ashay</strong>
          </span>
          <span>
            Decision date: <strong className="text-[#0F172A] font-bold">12 Aug 2026</strong>
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#059669] bg-white px-2.5 py-1 rounded-full border border-[#A7F3D0]">
          Verified Syndicate Consensus
        </span>
      </div>
    </Card>
  );
}
