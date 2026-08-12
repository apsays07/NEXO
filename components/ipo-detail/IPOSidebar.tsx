"use client";

import React from "react";
import { Card } from "../ui/Card";
import { RecommendationBadge, StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { ArrowRight, ShieldCheck, Users, LockKey } from "@phosphor-icons/react";

interface IPOSidebarProps {
  ipo: IPOOpportunity;
  onManageClick: () => void;
}

export function IPOSidebar({ ipo, onManageClick }: IPOSidebarProps) {
  const participants = ipo.applications.flatMap((a) => a.participants);

  return (
    <div className="sticky top-28 space-y-4">
      <Card className="p-6 bg-white border-[#E2E8F0] shadow-sm space-y-5">
        <div className="space-y-3 pb-4 border-b border-[#E2E8F0]">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
            Syndicate Overview
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B] font-medium">Our Decision</span>
            <RecommendationBadge type={ipo.recommendation} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B] font-medium">Current Stage</span>
            <StatusBadge status={ipo.status} size="sm" />
          </div>
        </div>

        <div className="space-y-3 pb-4 border-b border-[#E2E8F0] text-xs">
          <div className="flex justify-between">
            <span className="text-[#64748B] font-medium">Committed Capital</span>
            <span className="font-extrabold text-[#059669] num-tabular">
              {formatINR(ipo.combinedCapital)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#64748B] font-medium">Participants</span>
            <span className="font-extrabold text-[#0F172A] num-tabular">
              {ipo.participantsCount} Members
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#64748B] font-medium">Applications Filed</span>
            <span className="font-extrabold text-[#0F172A] num-tabular">
              {participants.length} / {ipo.participantsCount} Verified
            </span>
          </div>
        </div>

        {/* Member Avatar Stack */}
        <div className="space-y-2 pb-2">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
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
            <span className="text-xs text-[#64748B] font-medium">
              Pooled Syndicate Vault
            </span>
          </div>
        </div>

        <Button size="sm" variant="primary" className="w-full" onClick={onManageClick}>
          Manage Application <ArrowRight size={14} />
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">
          <ShieldCheck size={14} className="text-[#059669]" /> Private Encrypted Memo
        </div>
      </Card>
    </div>
  );
}
