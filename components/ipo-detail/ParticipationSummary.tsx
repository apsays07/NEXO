"use client";

import React from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { Users, Plus, CheckCircle } from "@phosphor-icons/react";

interface ParticipationSummaryProps {
  ipo: IPOOpportunity;
  onJoinClick: () => void;
}

export function ParticipationSummary({
  ipo,
  onJoinClick,
}: ParticipationSummaryProps) {
  const participants = ipo.applications.flatMap((a) => a.participants);

  return (
    <Card id="participation" className="p-6 bg-surface border-line shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-accent" />
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight uppercase">
              OUR PARTICIPATION
            </h3>
            <p className="text-xs text-[#64748B] font-medium">
              {ipo.participantsCount} Members • {formatINR(ipo.combinedCapital)} Total Committed
            </p>
          </div>
        </div>

        <Button size="sm" variant="primary" onClick={onJoinClick}>
          <Plus size={14} weight="bold" /> Add / Join Application
        </Button>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {participants.map((p, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-page border border-line space-y-3 hover:border-[#CBD5E1] transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={p.avatar}
                  alt={p.memberName}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                />
                <div>
                  <div className="text-sm font-extrabold text-[#0F172A]">
                    {p.memberName}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-soft text-accent">
                    COMBO
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-positive bg-[#ECFDF5] px-2 py-0.5 rounded-md border border-[#A7F3D0]">
                {p.status}
              </span>
            </div>

            <div className="pt-2 border-t border-line flex items-center justify-between text-xs">
              <div>
                <span className="text-[#64748B] text-[11px] block font-medium">
                  Contribution
                </span>
                <span className="font-extrabold text-[#0F172A] num-tabular">
                  {formatINR(p.contribution)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#64748B] text-[11px] block font-medium">
                  Share %
                </span>
                <span className="font-black text-accent num-tabular">
                  {(p.percentage ?? 0).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
