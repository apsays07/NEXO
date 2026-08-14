"use client";

import React from "react";
import { AuditActivity } from "@/src/features/activity/types";
import {
  formatActivityDescription,
  formatShortTime,
  getSeverityClasses,
  formatCategory,
} from "@/src/features/activity/formatters";
import { ActivityIcon } from "./ActivityIcon";

interface ActivityTableProps {
  activities: AuditActivity[];
  onSelect: (a: AuditActivity) => void;
}

export function ActivityTable({ activities, onSelect }: ActivityTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#252931]">
      <table className="w-full text-left text-xs font-medium">
        <thead className="bg-slate-50 dark:bg-[#14161A] border-b border-slate-200 dark:border-[#252931]">
          <tr className="text-[10px] font-extrabold text-slate-500 dark:text-[#626A75] uppercase tracking-wider">
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Actor</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Target</th>
            <th className="px-4 py-3">Severity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-[#1B1E23] bg-white dark:bg-[#101114]">
          {activities.map((activity) => {
            const sev = activity.severity || "INFO";
            const sc = getSeverityClasses(sev);
            const description = formatActivityDescription(activity);
            const actorName = activity.actorName || (activity as any).memberName || "System";
            const timeLabel = formatShortTime(activity.createdAt || (activity as any).timestamp);
            const category = formatCategory(activity.category);
            const isAdminActor = activity.actorRole === "ADMIN" || activity.actorRole === "SUPER_ADMIN";

            return (
              <tr
                key={activity.id || String((activity as any)._id)}
                onClick={() => onSelect(activity)}
                className="hover:bg-slate-50 dark:hover:bg-[#14161A] transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 font-mono text-[11px] text-slate-500 dark:text-[#858D99] whitespace-nowrap">
                  {timeLabel}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ActivityIcon
                      eventType={activity.eventType || (activity as any).type}
                      severity={sev}
                      size={13}
                    />
                    <span className="font-bold text-slate-900 dark:text-[#F5F7FA] truncate max-w-[100px]">
                      {actorName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-[#AEB5C0] max-w-[200px] truncate">
                  {description}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-[#1D2026] text-slate-600 dark:text-[#AEB5C0]">
                    {category}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-[#858D99] truncate max-w-[140px]">
                  {activity.targetName || "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sc.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {sev}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
