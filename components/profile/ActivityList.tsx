"use client";

import React from "react";
import { formatINR } from "@/lib/mockData";
import { TrendUp, Clock, ArrowRight } from "@phosphor-icons/react";
import { useNexo } from "@/context/NexoContext";

export function ActivityList() {
  const { setActiveTab } = useNexo();

  const ipoActivity = [
    {
      id: "act_1",
      name: "Dhoot Transmission",
      type: "COMBO",
      contribution: 50000,
      status: "Applied",
      timestamp: "12 minutes ago",
      statusColor: "text-positive bg-positive-soft border-positive/30",
    },
    {
      id: "act_2",
      name: "Zenith Technologies",
      type: "SOLO",
      contribution: 25000,
      status: "Applied",
      timestamp: "Yesterday",
      statusColor: "text-positive bg-positive-soft border-positive/30",
    },
    {
      id: "act_3",
      name: "Arclight Manufacturing",
      type: "COMBO",
      contribution: 40000,
      status: "Allotment Pending",
      timestamp: "2 days ago",
      statusColor: "text-caution bg-caution-soft border-caution/30",
    },
  ];

  return (
    <div className="p-5 sm:p-6 bg-surface border border-line rounded-2xl space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-alt border border-line-strong text-ink flex items-center justify-center font-bold">
            <TrendUp size={18} />
          </div>
          <div>
            <h3 className="text-h4 font-semibold text-ink">My IPO Activity</h3>
            <p className="text-caption text-ink-tertiary font-medium">
              Your recent participation log and bidding status
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab("applications" as any)}
          className="text-caption font-semibold text-accent hover:underline cursor-pointer flex items-center gap-1"
        >
          View All <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-2.5">
        {ipoActivity.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab("applications" as any)}
            className="p-3 rounded-xl bg-surface-alt/60 border border-line-subtle hover:border-line hover:bg-surface-hover transition-colors flex items-center justify-between gap-3 cursor-pointer text-small"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">{item.name}</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-accent-soft text-accent border border-accent/20">
                  {item.type}
                </span>
              </div>
              <p className="text-caption text-ink-tertiary font-medium flex items-center gap-1">
                <Clock size={12} />
                <span>{item.timestamp}</span>
              </p>
            </div>

            <div className="text-right space-y-1">
              <p className="font-semibold text-ink num-tabular">
                {formatINR(item.contribution)}
              </p>
              <span
                className={`inline-block text-[11px] font-semibold px-2 py-0.2 rounded border ${item.statusColor}`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
