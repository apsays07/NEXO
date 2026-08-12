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
    <Card id="decision" className="p-6 bg-white border-[#E2E8F0] shadow-2xs space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-[#059669]" />
          <h3 className="nexo-h4 text-[#111318] uppercase">
            OUR DECISION
          </h3>
        </div>
        <RecommendationBadge type={ipo.recommendation} size="md" />
      </div>

      <div className="p-4 rounded-2xl bg-[#ECFDF3] border border-[#A6F4C5]">
        <p className="text-sm font-medium text-[#047857] leading-relaxed">
          "{ipo.thesis}"
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-[#5F6673] pt-2 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-4">
          {ipo.decisionBy && (
            <span>
              Decision made by: <strong className="text-[#111318] font-semibold">{ipo.decisionBy}</strong>
            </span>
          )}
          {ipo.decisionDate && (
            <span>
              Decision date: <strong className="text-[#111318] font-semibold">{ipo.decisionDate}</strong>
            </span>
          )}
        </div>
        <span className="text-[12px] font-semibold text-[#059669] bg-white px-2.5 py-1 rounded-full border border-[#A6F4C5]">
          Verified Group Consensus
        </span>
      </div>
    </Card>
  );
}
