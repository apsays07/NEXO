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
    <Card id="decision" className="p-6 bg-surface border-line shadow-2xs space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-positive" />
          <h3 className="nexo-h4 text-ink uppercase">
            OUR DECISION
          </h3>
        </div>
        <RecommendationBadge type={ipo.recommendation} size="md" />
      </div>

      <div className="p-4 rounded-2xl bg-positive-soft border border-positive/30">
        <p className="text-sm font-medium text-[#047857] leading-relaxed">
          "{ipo.thesis}"
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-ink-secondary pt-2 border-t border-line">
        <div className="flex items-center gap-4">
          {ipo.decisionBy && (
            <span>
              Decision made by: <strong className="text-ink font-semibold">{ipo.decisionBy}</strong>
            </span>
          )}
          {ipo.decisionDate && (
            <span>
              Decision date: <strong className="text-ink font-semibold">{ipo.decisionDate}</strong>
            </span>
          )}
        </div>
        <span className="text-[12px] font-semibold text-positive bg-surface px-2.5 py-1 rounded-full border border-positive/30">
          Verified Group Consensus
        </span>
      </div>
    </Card>
  );
}
