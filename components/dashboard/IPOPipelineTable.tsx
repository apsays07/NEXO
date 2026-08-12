"use client";

import React from "react";
import { Card } from "../ui/Card";
import { StatusBadge, RecommendationBadge } from "../ui/Badge";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";

interface IPOPipelineTableProps {
  ipos: IPOOpportunity[];
  onInspect: (ipo: IPOOpportunity) => void;
  onViewAll: () => void;
}

export function IPOPipelineTable({ ipos, onInspect, onViewAll }: IPOPipelineTableProps) {
  return (
    <Card className="p-5 bg-white border-[#E4E7EC] shadow-none rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-[#111827] tracking-tight">
            OUR IPO PIPELINE
          </h3>
          <p className="text-xs text-[#667085] font-medium">
            Selected opportunities we're currently tracking.
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs text-[#2F6BFF] hover:underline font-bold"
        >
          View all →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E4E7EC] text-[#98A2B3] uppercase text-[10px] tracking-wider font-bold">
              <th className="py-2.5 px-3">IPO</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Decision</th>
              <th className="py-2.5 px-3">Deadline</th>
              <th className="py-2.5 px-3">Members</th>
              <th className="py-2.5 px-3 text-right">Committed Capital</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F6F8]">
            {ipos.slice(0, 5).map((ipo) => (
              <tr
                key={ipo.id}
                onClick={() => onInspect(ipo)}
                className="h-11 hover:bg-[#F4F6F8] cursor-pointer transition-colors"
              >
                <td className="py-2 px-3">
                  <div className="font-bold text-[#111827] text-xs">{ipo.name}</div>
                  <div className="text-[11px] text-[#667085] truncate">{ipo.company}</div>
                </td>
                <td className="py-2 px-3">
                  <StatusBadge status={ipo.status} size="sm" />
                </td>
                <td className="py-2 px-3">
                  <RecommendationBadge type={ipo.recommendation} size="sm" />
                </td>
                <td className="py-2 px-3 text-[#D98A16] font-bold">
                  {ipo.metrics.closeDate}
                </td>
                <td className="py-2 px-3 font-semibold text-[#111827]">
                  {ipo.participantsCount}
                </td>
                <td className="py-2 px-3 text-right font-extrabold text-[#12B76A] num-tabular">
                  {formatINR(ipo.combinedCapital)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
