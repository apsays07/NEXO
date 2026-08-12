"use client";

import React from "react";
import { Card } from "../ui/Card";
import { LifecycleBar } from "../ui/LifecycleBar";
import { IPOOpportunity } from "@/types/nexo";

interface LifecycleProps {
  ipo: IPOOpportunity;
}

export function Lifecycle({ ipo }: LifecycleProps) {
  return (
    <Card className="p-6 bg-white border-[#E2E8F0] shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight uppercase">
          APPLICATION LIFECYCLE
        </h3>
        <span className="text-xs text-[#64748B] font-mono">Stage Timeline</span>
      </div>

      <LifecycleBar currentStage={ipo.status} />

      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs flex items-center justify-between">
        <span className="text-[#475569] font-medium">
          Applications are currently open for syndicate members.
        </span>
        <span className="text-[#D97706] font-extrabold">
          Closes {ipo.metrics.closeDate}
        </span>
      </div>
    </Card>
  );
}
