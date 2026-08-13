"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { Pulse as ActivityIcon, Clock } from "@phosphor-icons/react";

export function ActivityTab() {
  const { activities } = useNexo();

  return (
    <div className="space-y-5 font-sans text-ink pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">Operational Activity Audit</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Real-time feed of all group operations, uploads, status changes, and recommendations
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-line p-5 shadow-2xs space-y-4">
        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-3.5 rounded-xl bg-surface-alt/50 border border-line/60 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={act.memberAvatar || "/oggy.png"}
                  alt={act.memberName}
                  className="w-8 h-8 rounded-full object-cover border border-line shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-ink truncate">{act.title}</h4>
                  <p className="text-[11px] text-ink-secondary mt-0.5">{act.subtitle}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-ink-tertiary shrink-0">
                {act.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
