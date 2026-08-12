import React from "react";
import { IPOLifecycleStage, RecommendationType } from "@/types/nexo";

interface StatusBadgeProps {
  status: IPOLifecycleStage;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const statusMap: Record<
    IPOLifecycleStage,
    { label: string; dotColor: string; bg: string; text: string; border: string }
  > = {
    RESEARCHING: {
      label: "Researching",
      dotColor: "bg-[#2F6BFF]",
      bg: "bg-[#EEF4FF]",
      text: "text-[#2F6BFF]",
      border: "border-[#D0E1FF]",
    },
    WATCHLIST: {
      label: "Watchlist",
      dotColor: "bg-[#667085]",
      bg: "bg-[#F8F9FA]",
      text: "text-[#667085]",
      border: "border-[#E4E7EC]",
    },
    APPLYING: {
      label: "Applying",
      dotColor: "bg-[#2F6BFF]",
      bg: "bg-[#EEF4FF]",
      text: "text-[#2F6BFF]",
      border: "border-[#D0E1FF]",
    },
    APPLICATION_OPEN: {
      label: "Open for Application",
      dotColor: "bg-[#2F6BFF]",
      bg: "bg-[#EEF4FF]",
      text: "text-[#2F6BFF]",
      border: "border-[#D0E1FF]",
    },
    APPLIED: {
      label: "Applied",
      dotColor: "bg-[#12B76A]",
      bg: "bg-[#ECFDF3]",
      text: "text-[#12B76A]",
      border: "border-[#A6F4C5]",
    },
    ALLOTMENT_PENDING: {
      label: "Allotment Pending",
      dotColor: "bg-[#F79009]",
      bg: "bg-[#FFFAEB]",
      text: "text-[#D98A16]",
      border: "border-[#FEF0C7]",
    },
    ALLOTTED: {
      label: "Allotted",
      dotColor: "bg-[#12B76A]",
      bg: "bg-[#ECFDF3]",
      text: "text-[#12B76A]",
      border: "border-[#A6F4C5]",
    },
    NOT_ALLOTTED: {
      label: "Not Allotted",
      dotColor: "bg-[#F04438]",
      bg: "bg-[#FEF3F2]",
      text: "text-[#F04438]",
      border: "border-[#FECDCA]",
    },
    LISTED: {
      label: "Listed",
      dotColor: "bg-[#2F6BFF]",
      bg: "bg-[#EEF4FF]",
      text: "text-[#2F6BFF]",
      border: "border-[#D0E1FF]",
    },
    HOLDING: {
      label: "Holding",
      dotColor: "bg-[#12B76A]",
      bg: "bg-[#ECFDF3]",
      text: "text-[#12B76A]",
      border: "border-[#A6F4C5]",
    },
    SOLD: {
      label: "Sold / Settled",
      dotColor: "bg-[#667085]",
      bg: "bg-[#F8F9FA]",
      text: "text-[#667085]",
      border: "border-[#E4E7EC]",
    },
    CLOSED: {
      label: "Closed",
      dotColor: "bg-[#98A2B3]",
      bg: "bg-[#F8F9FA]",
      text: "text-[#98A2B3]",
      border: "border-[#E4E7EC]",
    },
  };

  const config = statusMap[status] || statusMap.APPLYING;
  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.bg} ${config.text} ${config.border} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
}

interface RecommendationBadgeProps {
  type: RecommendationType;
  size?: "sm" | "md";
}

export function RecommendationBadge({
  type,
  size = "sm",
}: RecommendationBadgeProps) {
  const config = {
    APPLY: {
      label: "Group Decision: APPLY",
      dotColor: "bg-[#12B76A]",
      bg: "bg-[#ECFDF3]",
      text: "text-[#12B76A]",
      border: "border-[#A6F4C5]",
    },
    WATCH: {
      label: "Group Decision: WATCH",
      dotColor: "bg-[#D98A16]",
      bg: "bg-[#FFFAEB]",
      text: "text-[#D98A16]",
      border: "border-[#FEF0C7]",
    },
    SKIP: {
      label: "Group Decision: SKIP",
      dotColor: "bg-[#F04438]",
      bg: "bg-[#FEF3F2]",
      text: "text-[#F04438]",
      border: "border-[#FECDCA]",
    },
  }[type];

  const padding = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-md border ${config.bg} ${config.text} ${config.border} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
}
