import React from "react";
import { IPOLifecycleStage } from "@/types/nexo";
import { Check } from "@phosphor-icons/react";

interface LifecycleBarProps {
  currentStage: IPOLifecycleStage;
}

const STAGES: { stage: IPOLifecycleStage; label: string }[] = [
  { stage: "RESEARCHING", label: "Researching" },
  { stage: "WATCHLIST", label: "Watchlist" },
  { stage: "APPLYING", label: "Applying" },
  { stage: "APPLIED", label: "Applied" },
  { stage: "ALLOTMENT_PENDING", label: "Allotment" },
  { stage: "HOLDING", label: "Holding / Listed" },
  { stage: "CLOSED", label: "Closed" },
];

export function LifecycleBar({ currentStage }: LifecycleBarProps) {
  const getStageIndex = (stage: IPOLifecycleStage) => {
    switch (stage) {
      case "RESEARCHING":
        return 0;
      case "WATCHLIST":
        return 1;
      case "APPLYING":
      case "APPLICATION_OPEN":
        return 2;
      case "APPLIED":
        return 3;
      case "ALLOTMENT_PENDING":
      case "ALLOTTED":
      case "NOT_ALLOTTED":
        return 4;
      case "LISTED":
      case "HOLDING":
        return 5;
      case "SOLD":
      case "CLOSED":
        return 6;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="w-full py-3 px-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
      <div className="flex items-center justify-between relative">
        {/* Background track line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#E2E8F0] -translate-y-1/2 z-0" />

        {/* Progress track line */}
        <div
          className="absolute top-1/2 left-4 h-0.5 bg-[#2563EB] -translate-y-1/2 z-0 transition-all duration-300"
          style={{
            width: `${(currentIndex / (STAGES.length - 1)) * 100}%`,
          }}
        />

        {STAGES.map((s, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div
              key={s.stage}
              className="relative z-10 flex flex-col items-center gap-1.5"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                  isCompleted
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : isCurrent
                    ? "bg-[#2563EB] text-white ring-4 ring-[#2563EB]/20 animate-pulse"
                    : "bg-[#FFFFFF] text-[#94A3B8] border border-[#CBD5E1]"
                }`}
              >
                {isCompleted ? <Check size={12} weight="bold" /> : idx + 1}
              </div>

              <span
                className={`text-[11px] font-bold hidden sm:block ${
                  isCurrent
                    ? "text-[#2563EB]"
                    : isCompleted
                    ? "text-[#334155]"
                    : "text-[#94A3B8]"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
