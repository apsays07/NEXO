"use client";

import React from "react";
import { Card } from "../ui/Card";
import { StatusBadge, RecommendationBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { ArrowRight, Clock, ShieldCheck } from "@phosphor-icons/react";

interface FeaturedOpportunityProps {
  ipo: IPOOpportunity;
  onInspect: (ipo: IPOOpportunity) => void;
  onApply: (ipo: IPOOpportunity) => void;
}

export function FeaturedOpportunity({ ipo, onInspect, onApply }: FeaturedOpportunityProps) {
  const participants = ipo.applications.flatMap((a) => a.participants);

  return (
    <Card
      hoverable
      onClick={() => onInspect(ipo)}
      className="p-6 md:p-8 bg-white border-[#E2E8F0] shadow-none rounded-2xl flex flex-col justify-between h-full group hover:border-[#CBD5E1] transition-all space-y-6 font-sans"
    >
      <div>
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-lg border border-[#BFDBFE] shadow-2xs">
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
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#111318] group-hover:text-[#2563EB] transition-colors tracking-tight">
                {ipo.name}
              </h3>
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
              {ipo.metrics.issueSize || "₹1,400 Cr"}
            </div>
          </div>
        </div>

        {/* Syndicate Decision Box */}
        <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#027A48]">
              <ShieldCheck size={16} />
              <span>Description</span>
            </div>
            <RecommendationBadge type={ipo.recommendation} size="sm" />
          </div>

          <p className="text-sm text-[#027A48] font-medium leading-relaxed italic">
            "{ipo.thesis}"
          </p>

          <div className="flex items-center gap-3 pt-2 text-[12px] text-[#059669] border-t border-[#A6F4C5]/60 font-medium">
            <span>Authored by: <strong className="font-semibold text-[#027A48]">Ashay</strong></span>
            <span>•</span>
            <span>Decision date: <strong className="font-semibold text-[#027A48]">12 Aug 2026</strong></span>
          </div>
        </div>
      </div>

      {/* Footer Group Commitment & Action */}
      <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((p, idx) => (
                <img
                  key={idx}
                  src={p.avatar}
                  alt={p.memberName}
                  className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
                />
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-[#111318]">
                {ipo.participantsCount} Members Committed
              </div>
              <span className="text-[12px] text-[#5F6673] font-medium">
                Syndicate Combo Vault
              </span>
            </div>
          </div>

          <span className="text-[#CBD5E1] hidden sm:inline">•</span>

          <div>
            <span className="text-[12px] text-[#5F6673] uppercase tracking-wider block font-medium">
              Total Capital
            </span>
            <span className="font-semibold text-[#12B76A] num-tabular text-[18px]">
              {formatINR(ipo.combinedCapital)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-[#D97706] font-semibold flex items-center gap-1.5 bg-[#FFFAEB] px-2.5 py-1 rounded-lg border border-[#FEF0C7]">
            <Clock size={14} /> Closes {ipo.metrics.closeDate}
          </span>
          <Button
            size="md"
            variant="success"
            onClick={(e) => {
              e.stopPropagation();
              onApply(ipo);
            }}
          >
            Apply IPO
          </Button>
          <Button
            size="md"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onInspect(ipo);
            }}
          >
            Details <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
