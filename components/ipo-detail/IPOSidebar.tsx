"use client";

import React from "react";
import { Card } from "../ui/Card";
import { RecommendationBadge, StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react";

interface IPOSidebarProps {
  ipo: IPOOpportunity;
  onManageClick: () => void;
}

export function IPOSidebar({ ipo, onManageClick }: IPOSidebarProps) {
  const participants = ipo.applications.flatMap((a) => a.participants);

  return (
    <div className="sticky top-28 space-y-4 font-sans">
      <Card className="p-6 bg-white border-[#E2E8F0] shadow-2xs space-y-5">
        <div className="space-y-1.5 pb-4 border-b border-[#E2E8F0]">
          <h3 className="text-sm font-semibold text-[#111318]">
            Group Overview
          </h3>
          <p className="text-xs text-[#5F6673] font-normal leading-relaxed">
            NEXO simplifies multi-friend IPO capital pooling.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
          <div className="text-[11px] font-semibold text-[#5F6673] uppercase tracking-wider">
            Pooled Capital Vault
          </div>
          <div className="text-xl font-bold text-[#111318] num-tabular">
            {formatINR(ipo.combinedCapital)}
          </div>
        </div>

        <div className="space-y-3 pb-4 border-b border-[#E2E8F0] text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F6673] font-medium">Our Decision</span>
            <RecommendationBadge type={ipo.recommendation} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#5F6673] font-medium">Current Stage</span>
            <StatusBadge status={ipo.status} size="sm" />
          </div>
        </div>

        <div className="space-y-3 pb-4 border-b border-[#E2E8F0] text-xs">
          <div className="flex justify-between">
            <span className="text-[#5F6673] font-medium">Committed Capital</span>
            <span className="font-semibold text-[#059669] num-tabular">
              {formatINR(ipo.combinedCapital)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#5F6673] font-medium">Participants</span>
            <span className="font-semibold text-[#111318] num-tabular">
              {ipo.participantsCount} Members
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#5F6673] font-medium">Applications Filed</span>
            <span className="font-semibold text-[#111318] num-tabular">
              {participants.length} / {ipo.participantsCount} Verified
            </span>
          </div>
        </div>

        {/* Member Avatar Stack */}
        <div className="space-y-2 pb-2">
          <span className="text-[12px] font-semibold text-[#5F6673] uppercase tracking-wider block">
            Active Members
          </span>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {participants.slice(0, 4).map((p, idx) => (
                <img
                  key={idx}
                  src={p.avatar}
                  alt={p.memberName}
                  className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-2xs"
                />
              ))}
            </div>
            <span className="text-xs text-[#5F6673] font-medium">
              Pooled Vault
            </span>
          </div>
        </div>

        <Button size="sm" variant="primary" className="w-full" onClick={onManageClick}>
          Manage Application <ArrowRight size={14} />
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#5F6673]">
          <ShieldCheck size={14} className="text-[#059669]" /> Private Encrypted Memo
        </div>
      </Card>
    </div>
  );
}
