"use client";

import React from "react";
import { Card } from "../ui/Card";
import { StatusBadge, RecommendationBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { ArrowRight, Clock, ShieldCheck, Users, CheckCircle } from "@phosphor-icons/react";

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
      className="p-6 md:p-8 bg-white border-[#E4E7EC] shadow-none rounded-2xl flex flex-col justify-between h-full group hover:border-[#CBD5E1] transition-all space-y-6"
    >
      <div>
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E4E7EC]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#EEF4FF] text-[#2F6BFF] flex items-center justify-center font-black text-lg border border-[#D0E1FF] shadow-2xs">
              {ipo.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold text-[#667085] uppercase tracking-wider bg-[#F4F6F8] px-2 py-0.5 rounded border border-[#E4E7EC]">
                  {ipo.category || "Mainboard IPO"}
                </span>
                <span className="text-[#D0D5DD]">•</span>
                <span className="text-xs text-[#667085] font-medium">{ipo.company}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] group-hover:text-[#2F6BFF] transition-colors tracking-tight">
                {ipo.name}
              </h3>
            </div>
          </div>

          <StatusBadge status={ipo.status} size="md" />
        </div>

        {/* Financial Metrics Cluster */}
        <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC] space-y-1">
            <span className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider block">
              Min Investment
            </span>
            <div className="text-base sm:text-lg font-extrabold text-[#111827] num-tabular">
              {formatINR(ipo.metrics.minInvestment)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC] space-y-1">
            <span className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider block">
              Issue Size
            </span>
            <div className="text-base sm:text-lg font-extrabold text-[#111827] num-tabular">
              {ipo.metrics.issueSize || "₹1,400 Cr"}
            </div>
          </div>
        </div>

        {/* Syndicate Decision Box */}
        <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#027A48]">
              <ShieldCheck size={16} />
              <span>SYNDICATE CONSENSUS</span>
            </div>
            <RecommendationBadge type={ipo.recommendation} size="sm" />
          </div>

          <p className="text-xs sm:text-sm text-[#027A48] font-medium leading-relaxed italic">
            "{ipo.thesis}"
          </p>

          <div className="flex items-center gap-3 pt-2 text-[11px] text-[#059669] border-t border-[#A6F4C5]/60 font-medium">
            <span>Authored by: <strong className="font-extrabold text-[#027A48]">Ashay</strong></span>
            <span>•</span>
            <span>Decision date: <strong className="font-extrabold text-[#027A48]">12 Aug 2026</strong></span>
          </div>
        </div>
      </div>

      {/* Footer Group Commitment & Action */}
      <div className="pt-4 border-t border-[#E4E7EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
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
              <div className="text-xs font-extrabold text-[#111827]">
                {ipo.participantsCount} Members Committed
              </div>
              <span className="text-[11px] text-[#667085] font-medium">
                Syndicate Combo Vault
              </span>
            </div>
          </div>

          <span className="text-[#D0D5DD] hidden sm:inline">•</span>

          <div>
            <span className="text-[10px] text-[#667085] uppercase tracking-wider block font-bold">
              Total Capital
            </span>
            <span className="font-black text-[#12B76A] num-tabular text-base">
              {formatINR(ipo.combinedCapital)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-[#D98A16] font-bold flex items-center gap-1.5 bg-[#FFFAEB] px-2.5 py-1 rounded-lg border border-[#FEF0C7]">
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
