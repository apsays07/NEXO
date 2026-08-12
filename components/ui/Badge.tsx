import React from "react";
import { IPOLifecycleStage, RecommendationType } from "@/types/nexo";

interface StatusBadgeProps {
  status: IPOLifecycleStage;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  let styles = "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]";
  let label: string = status;

  switch (status) {
    case "RESEARCHING":
      styles = "bg-purple-50 text-purple-700 border border-purple-200";
      label = "Researching";
      break;
    case "WATCHLIST":
      styles = "bg-amber-50 text-amber-700 border border-amber-200 font-medium";
      label = "Watchlist";
      break;
    case "APPLYING":
    case "APPLICATION_OPEN":
      styles = "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-bold animate-pulse";
      label = status === "APPLYING" ? "Applying" : "Open for Application";
      break;
    case "APPLIED":
      styles = "bg-blue-50 text-blue-700 border border-blue-200 font-medium";
      label = "Applied";
      break;
    case "ALLOTMENT_PENDING":
      styles = "bg-yellow-50 text-yellow-800 border border-yellow-200 font-medium";
      label = "Allotment Pending";
      break;
    case "ALLOTTED":
    case "LISTED":
    case "HOLDING":
      styles = "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] font-bold";
      label = status === "ALLOTTED" ? "Allotted" : status === "HOLDING" ? "Holding" : "Listed";
      break;
    case "NOT_ALLOTTED":
      styles = "bg-rose-50 text-rose-700 border border-rose-200";
      label = "Not Allotted";
      break;
    case "SOLD":
    case "CLOSED":
      styles = "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] font-medium";
      label = status === "SOLD" ? "Sold / Profit Settled" : "Closed";
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full tracking-wide ${sizeClasses} ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}

interface RecommendationBadgeProps {
  type: RecommendationType;
  size?: "sm" | "md";
}

export function RecommendationBadge({ type, size = "md" }: RecommendationBadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";

  let styles = "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]";
  let label = "Group Decision: APPLY";

  if (type === "WATCH") {
    styles = "bg-amber-50 text-amber-700 border border-amber-200";
    label = "Group Decision: WATCH";
  } else if (type === "SKIP") {
    styles = "bg-rose-50 text-rose-700 border border-rose-200";
    label = "Group Decision: SKIP";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${sizeClasses} ${styles}`}
    >
      {label}
    </span>
  );
}
