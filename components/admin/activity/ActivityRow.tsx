"use client";

import React from "react";
import { AuditActivity } from "@/src/features/activity/types";
import {
  formatActivityDescription,
  formatActivityTime,
  formatShortTime,
  getSeverityClasses,
  formatCategory,
} from "@/src/features/activity/formatters";
import { ActivityIcon } from "./ActivityIcon";

interface ActivityRowProps {
  activity: AuditActivity;
  onClick: (a: AuditActivity) => void;
}

export function ActivityRow({ activity, onClick }: ActivityRowProps) {
  const description = formatActivityDescription(activity);
  const timeLabel = formatShortTime(activity.createdAt || activity.timestamp as any);
  const relativeTime = formatActivityTime(activity.createdAt || activity.timestamp as any);
  const severityClasses = getSeverityClasses(activity.severity || "INFO");
  const categoryLabel = formatCategory(activity.category);
  const actorName = activity.actorName || (activity as any).memberName || "System";
  const actorRole = activity.actorRole;
  const isAdminActor = actorRole === "ADMIN" || actorRole === "SUPER_ADMIN";

  return (
    <button
      onClick={() => onClick(activity)}
      className="w-full flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#14161A] transition-colors cursor-pointer text-left group"
    >
      {/* Icon */}
      <ActivityIcon
        eventType={activity.eventType || (activity as any).type}
        severity={activity.severity || "INFO"}
        size={16}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-extrabold text-slate-900 dark:text-[#F5F7FA] truncate">
            {actorName}
          </span>
          {actorRole && (
            <span
              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono ${
                isAdminActor
                  ? "bg-blue-50 dark:bg-[#17233D] text-blue-600 dark:text-[#6B93FF]"
                  : "bg-slate-100 dark:bg-[#1D2026] text-slate-500 dark:text-[#858D99]"
              }`}
            >
              {actorRole === "SUPER_ADMIN" ? "SUPER ADMIN" : actorRole}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-600 dark:text-[#AEB5C0] font-medium mt-0.5 truncate">
          {description}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${severityClasses.badge}`}>
            {activity.severity || "INFO"}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-[#626A75] font-medium">
            {categoryLabel}
          </span>
          {activity.targetName && (
            <>
              <span className="text-[10px] text-slate-300 dark:text-[#343943]">·</span>
              <span className="text-[10px] text-slate-500 dark:text-[#858D99] truncate max-w-[120px]">
                {activity.targetName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-right shrink-0">
        <p className="text-[11px] font-semibold text-slate-400 dark:text-[#626A75]">{timeLabel}</p>
        <p className="text-[10px] text-slate-300 dark:text-[#343943] mt-0.5">{relativeTime}</p>
      </div>
    </button>
  );
}
