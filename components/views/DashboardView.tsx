"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { FeaturedOpportunity } from "../dashboard/FeaturedOpportunity";
import { ApplyIPOModal } from "../ipo/ApplyIPOModal";
import { IPOOpportunity } from "@/types/nexo";

export function DashboardView() {
  const { ipos, openIpoDetail } = useNexo();
  const [applyTargetIpo, setApplyTargetIpo] = useState<IPOOpportunity | null>(null);

  const featuredIpo = ipos.find((i) => i.isFeatured) || ipos[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12">
      {/* GREETING HEADER */}
      <DashboardHeader />

      {/* CURRENT OPPORTUNITY ONLY */}
      {featuredIpo && (
        <FeaturedOpportunity
          ipo={featuredIpo}
          onInspect={openIpoDetail}
          onApply={(ipo) => setApplyTargetIpo(ipo)}
        />
      )}

      {/* APPLY IPO MODAL FORM */}
      {applyTargetIpo && (
        <ApplyIPOModal
          ipo={applyTargetIpo}
          isOpen={!!applyTargetIpo}
          onClose={() => setApplyTargetIpo(null)}
        />
      )}
    </div>
  );
}
