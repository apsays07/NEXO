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
      <Card className="p-6 bg-surface border-line shadow-2xs space-y-5">
        <div className="space-y-1.5 pb-4 border-b border-line">
          <h3 className="text-sm font-semibold text-ink">
            Group Overview
          </h3>
          <p className="text-xs text-ink-secondary font-normal leading-relaxed">
            NEXO simplifies multi-friend IPO capital pooling.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-page border border-line space-y-1.5">
          <div className="text-[11px] font-semibold text-ink-secondary uppercase tracking-wider">
            Pooled Capital Vault
          </div>
          <div className="text-xl font-bold text-ink num-tabular">
            {formatINR(ipo.combinedCapital)}
          </div>
        </div>

        <div className="space-y-3 pb-4 border-b border-line text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-secondary font-medium">Our Decision</span>
            <RecommendationBadge type={ipo.recommendation} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-secondary font-medium">Current Stage</span>
            <StatusBadge status={ipo.status} size="sm" />
          </div>
        </div>

        <div className="space-y-3 pb-4 border-b border-line text-xs">
          <div className="flex justify-between">
            <span className="text-ink-secondary font-medium">Committed Capital</span>
            <span className="font-semibold text-positive num-tabular">
              {formatINR(ipo.combinedCapital)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-ink-secondary font-medium">Participants</span>
            <span className="font-semibold text-ink num-tabular">
              {ipo.participantsCount} Members
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-ink-secondary font-medium">Applications Filed</span>
            <span className="font-semibold text-ink num-tabular">
              {participants.length} / {ipo.participantsCount} Verified
            </span>
          </div>
        </div>

        {/* Member Avatar Stack */}
        <div className="space-y-2 pb-2">
          <span className="text-[12px] font-semibold text-ink-secondary uppercase tracking-wider block">
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
            <span className="text-xs text-ink-secondary font-medium">
              Pooled Vault
            </span>
          </div>
        </div>

        <Button size="sm" variant="primary" className="w-full" onClick={onManageClick}>
          Manage Application <ArrowRight size={14} />
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[12px] text-ink-secondary">
          <ShieldCheck size={14} className="text-positive" /> Private Encrypted Memo
        </div>
      </Card>
    </div>
  );
}
