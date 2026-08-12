"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { FeaturedOpportunity } from "../dashboard/FeaturedOpportunity";

export function DashboardView() {
  const { ipos, openIpoDetail, openApplicationModal } = useNexo();

  const featuredIpo = ipos.find((i) => i.isFeatured) || ipos[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in pb-12 font-sans">
      {/* GREETING HEADER */}
      <DashboardHeader />

      {/* CURRENT OPPORTUNITY ONLY */}
      {featuredIpo && (
        <FeaturedOpportunity
          ipo={featuredIpo}
          onInspect={openIpoDetail}
          onApply={openApplicationModal}
        />
      )}
    </div>
  );
}
