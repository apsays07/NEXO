"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { FeaturedOpportunity } from "../dashboard/FeaturedOpportunity";

export function DashboardView() {
  const { ipos, openIpoDetail, openApplicationModal } = useNexo();

  // Show all open/active non-hidden IPOs; featured one comes first
  const visibleIpos = ipos.filter((i) => !i.isHidden);
  const activeIpos = [
    ...visibleIpos.filter((i) => i.isFeatured),
    ...visibleIpos.filter(
      (i) =>
        !i.isFeatured &&
        ["APPLICATION_OPEN", "APPLYING", "RESEARCHING", "WATCHLIST"].includes(i.status)
    ),
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto animate-fade-in pb-6 font-sans">
      {/* GREETING HEADER */}
      <DashboardHeader />

      {/* ACTIVE IPO OPPORTUNITIES */}
      {activeIpos.length > 0 && (
        <div className="space-y-4">
          {activeIpos.length > 1 && (
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-ink">
                Open Opportunities
                <span className="ml-2 text-[12px] font-medium text-ink-secondary bg-surface-alt px-2 py-0.5 rounded-full">
                  {activeIpos.length}
                </span>
              </h2>
            </div>
          )}
          {activeIpos.map((ipo) => (
            <FeaturedOpportunity
              key={ipo.id}
              ipo={ipo}
              onInspect={openIpoDetail}
              onApply={openApplicationModal}
            />
          ))}
        </div>
      )}
    </div>
  );
}
