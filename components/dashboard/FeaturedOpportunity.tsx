"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import { StatusBadge, RecommendationBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { ArrowRight, Clock, ShieldCheck } from "@phosphor-icons/react";
import { IPODetailModal } from "../ipo/IPODetailModal";

interface FeaturedOpportunityProps {
  ipo: IPOOpportunity;
  onInspect: (ipo: IPOOpportunity) => void;
  onApply: (ipo: IPOOpportunity) => void;
}

export function FeaturedOpportunity({ ipo, onInspect, onApply }: FeaturedOpportunityProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <Card className="p-6 md:p-8 bg-white border-[#E2E8F0] shadow-none rounded-2xl flex flex-col justify-between h-full space-y-6 font-sans">
        <div>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-lg border border-[#BFDBFE] shadow-2xs shrink-0">
                {ipo.logo}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-medium text-[#5F6673] uppercase tracking-wider bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                    {ipo.category || "Mainboard IPO"}
                  </span>
                  <span className="text-[#7B8491]">•</span>
                  <span className="text-xs font-medium text-[#5F6673]">{ipo.company}</span>
                </div>
                {/* Clickable IPO name → opens detail modal */}
                <button
                  onClick={() => setShowDetail(true)}
                  className="text-left text-[22px] leading-[30px] font-semibold text-[#111318] hover:text-[#2563EB] hover:underline underline-offset-2 transition-colors tracking-tight cursor-pointer"
                >
                  {ipo.name}
                </button>
              </div>
            </div>

            <StatusBadge status={ipo.status} size="md" />
          </div>

          {/* Financial Metrics Cluster */}
          <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-[12px] font-medium text-[#5F6673] uppercase tracking-wider block">
                Min Investment
              </span>
              <div className="text-[18px] leading-[26px] font-semibold text-[#111318] num-tabular">
                {formatINR(ipo.metrics.minInvestment)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <span className="text-[12px] font-medium text-[#5F6673] uppercase tracking-wider block">
                Issue Size
              </span>
              <div className="text-[18px] leading-[26px] font-semibold text-[#111318] num-tabular">
                {ipo.metrics.issueSize || "—"}
              </div>
            </div>
          </div>

          {/* Group Decision Box */}
          <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#027A48]">
                <ShieldCheck size={16} />
                <span>Group Decision</span>
              </div>
              <RecommendationBadge type={ipo.recommendation} size="sm" />
            </div>

            <p className="text-sm text-[#027A48] font-medium leading-relaxed">
              {ipo.thesis}
            </p>

            <div className="flex items-center gap-3 pt-2 text-[12px] text-[#059669] border-t border-[#A6F4C5]/60 font-medium">
              {ipo.decisionBy && (
                <span>Authored by: <strong className="font-semibold text-[#027A48]">{ipo.decisionBy}</strong></span>
              )}
              {ipo.decisionBy && ipo.decisionDate && <span>•</span>}
              {ipo.decisionDate && (
                <span>Decision date: <strong className="font-semibold text-[#027A48]">{ipo.decisionDate}</strong></span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <span className="text-xs text-[#D97706] font-semibold flex items-center gap-1.5 bg-[#FFFAEB] px-2.5 py-1.5 rounded-lg border border-[#FEF0C7]">
            <Clock size={14} /> Closes {ipo.metrics.closeDate}
          </span>
          <Button
            size="md"
            variant="success"
            onClick={() => onApply(ipo)}
          >
            Apply Now <ArrowRight size={14} />
          </Button>
        </div>
      </Card>

      {/* IPO Detail Modal */}
      <IPODetailModal
        ipo={ipo}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onApply={onApply}
      />
    </>
  );
}
