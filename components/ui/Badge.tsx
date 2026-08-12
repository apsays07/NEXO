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
      dotColor: "bg-accent",
      bg: "bg-accent-soft",
      text: "text-accent",
      border: "border-accent/30",
    },
    WATCHLIST: {
      label: "Watchlist",
      dotColor: "bg-ink-secondary",
      bg: "bg-surface-alt",
      text: "text-ink-secondary",
      border: "border-line",
    },
    APPLYING: {
      label: "Applying",
      dotColor: "bg-accent",
      bg: "bg-accent-soft",
      text: "text-accent",
      border: "border-accent/30",
    },
    APPLICATION_OPEN: {
      label: "Open for Application",
      dotColor: "bg-accent",
      bg: "bg-accent-soft",
      text: "text-accent",
      border: "border-accent/30",
    },
    APPLIED: {
      label: "Applied",
      dotColor: "bg-positive",
      bg: "bg-positive-soft",
      text: "text-positive",
      border: "border-positive/30",
    },
    ALLOTMENT_PENDING: {
      label: "Allotment Pending",
      dotColor: "bg-caution",
      bg: "bg-caution-soft",
      text: "text-caution",
      border: "border-caution/30",
    },
    ALLOTTED: {
      label: "Allotted",
      dotColor: "bg-positive",
      bg: "bg-positive-soft",
      text: "text-positive",
      border: "border-positive/30",
    },
    NOT_ALLOTTED: {
      label: "Not Allotted",
      dotColor: "bg-negative",
      bg: "bg-negative-soft",
      text: "text-negative",
      border: "border-negative/30",
    },
    LISTED: {
      label: "Listed",
      dotColor: "bg-accent",
      bg: "bg-accent-soft",
      text: "text-accent",
      border: "border-accent/30",
    },
    HOLDING: {
      label: "Holding",
      dotColor: "bg-positive",
      bg: "bg-positive-soft",
      text: "text-positive",
      border: "border-positive/30",
    },
    SOLD: {
      label: "Sold / Settled",
      dotColor: "bg-ink-secondary",
      bg: "bg-surface-alt",
      text: "text-ink-secondary",
      border: "border-line",
    },
    CLOSED: {
      label: "Closed",
      dotColor: "bg-ink-muted",
      bg: "bg-surface-alt",
      text: "text-ink-muted",
      border: "border-line",
    },
  };

  const config = statusMap[status] || statusMap.APPLYING;
  const padding = size === "sm" ? "px-2 py-0.5 text-[12px] leading-4 font-medium" : "px-2.5 py-1 text-xs leading-4 font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${padding}`}
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
      dotColor: "bg-positive",
      bg: "bg-positive-soft",
      text: "text-positive",
      border: "border-positive/30",
    },
    WATCH: {
      label: "Group Decision: WATCH",
      dotColor: "bg-caution",
      bg: "bg-caution-soft",
      text: "text-caution",
      border: "border-caution/30",
    },
    SKIP: {
      label: "Group Decision: SKIP",
      dotColor: "bg-negative",
      bg: "bg-negative-soft",
      text: "text-negative",
      border: "border-negative/30",
    },
  }[type];

  const padding = size === "sm" ? "px-2 py-0.5 text-[12px] leading-4 font-semibold" : "px-2.5 py-1 text-xs leading-4 font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${config.bg} ${config.text} ${config.border} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
}
