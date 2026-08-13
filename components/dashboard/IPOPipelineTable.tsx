"use client";

import React from "react";
import { Card } from "../ui/Card";
import { GMPBadge } from "../ui/Badge";
import { formatINR, formatDate } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";

interface IPOPipelineTableProps {
  ipos: IPOOpportunity[];
  onInspect: (ipo: IPOOpportunity) => void;
  onViewAll: () => void;
}

export function IPOPipelineTable({ ipos, onInspect, onViewAll }: IPOPipelineTableProps) {
  return (
    <Card className="p-5 bg-surface border-line shadow-none rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-h4 font-semibold text-ink tracking-tight">
            OUR IPO PIPELINE
          </h3>
          <p className="text-small text-ink-secondary font-medium">
            Selected opportunities we're currently tracking.
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-small text-accent hover:underline font-semibold"
        >
          View all →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line text-ink-tertiary uppercase text-caption tracking-wider font-semibold">
              <th className="py-2.5 px-3">IPO</th>
              <th className="py-2.5 px-3">GMP (%)</th>
              <th className="py-2.5 px-3">Deadline</th>
              <th className="py-2.5 px-3">Members</th>
              <th className="py-2.5 px-3 text-right">Committed Capital</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-subtle text-small">
            {ipos.slice(0, 5).map((ipo) => (
              <tr
                key={ipo.id}
                onClick={() => onInspect(ipo)}
                className="h-11 hover:bg-surface-alt cursor-pointer transition-colors"
              >
                <td className="py-2.5 px-3">
                  <div className="text-sm font-semibold text-ink">{ipo.name}</div>
                  <div className="text-caption text-ink-tertiary truncate">{ipo.company}</div>
                </td>
                <td className="py-2.5 px-3">
                  <GMPBadge gmpPercent={ipo.metrics?.gmpPercent ?? 18.5} size="sm" />
                </td>
                <td className="py-2.5 px-3 text-caution font-semibold text-caption">
                  {formatDate(ipo.metrics.closeDate)}
                </td>
                <td className="py-2.5 px-3 num-table text-ink">
                  {ipo.participantsCount}
                </td>
                <td className="py-2.5 px-3 text-right num-table text-positive font-semibold">
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
