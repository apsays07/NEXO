import React from "react";
import { IPOLifecycleStage, RecommendationType } from "@/types/nexo";
import { TrendUp, TrendDown } from "@phosphor-icons/react";

interface GMPBadgeProps {
  gmpPercent?: number;
  size?: "sm" | "md";
  className?: string;
  animate?: boolean;
}

export function GMPBadge({
  gmpPercent = 18.5,
  size = "sm",
  className = "",
  animate = true,
}: GMPBadgeProps) {
  const percent = typeof gmpPercent === "number" ? gmpPercent : 18.5;
  const isPositive = percent >= 0;
  const formattedPercent = `${isPositive ? "+" : ""}${percent.toFixed(1)}%`;
  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-2 font-sans select-none tracking-tight transition-all duration-200 hover:scale-[1.03] shrink-0 ${
        isSmall
          ? "px-3 py-1.5 text-[13px] rounded-full"
          : "px-4 py-2 text-[14px] rounded-full"
      } ${
        isPositive
          ? "bg-emerald-950/90 text-emerald-200 border-2 border-emerald-400/60 shadow-[0_0_16px_rgba(16,185,129,0.25)]"
          : "bg-rose-950/90 text-rose-200 border-2 border-rose-400/60 shadow-[0_0_16px_rgba(244,63,94,0.25)]"
      } backdrop-blur-md ${className}`}
    >
      {/* Live Signal Indicator */}
      <span className="relative flex items-center justify-center shrink-0 w-2.5 h-2.5">
        {animate && (
          <span
            className={`absolute inset-0 rounded-full animate-ping opacity-80 ${
              isPositive ? "bg-emerald-400" : "bg-rose-400"
            }`}
          />
        )}
        <span
          className={`relative w-2 h-2 rounded-full ${
            isPositive
              ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
              : "bg-rose-400 shadow-[0_0_8px_#fb7185]"
          }`}
        />
      </span>

      {/* Label */}
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
        GMP
      </span>

      {/* Value */}
      <span
        className={`font-black font-mono tracking-tight text-[13px] ${
          isPositive ? "text-emerald-300" : "text-rose-300"
        }`}
      >
        {formattedPercent}
      </span>

      {/* Trend Arrow */}
      {isPositive ? (
        <TrendUp
          size={isSmall ? 15 : 17}
          weight="bold"
          className="text-emerald-300 shrink-0"
        />
      ) : (
        <TrendDown
          size={isSmall ? 15 : 17}
          weight="bold"
          className="text-rose-300 shrink-0"
        />
      )}
    </span>
  );
}

interface StatusBadgeProps {
  status?: IPOLifecycleStage;
  gmpPercent?: number;
  size?: "sm" | "md";
}

export function StatusBadge({ status, gmpPercent, size = "sm" }: StatusBadgeProps) {
  return <GMPBadge gmpPercent={gmpPercent} size={size} />;
}

interface RecommendationBadgeProps {
  type?: RecommendationType;
  gmpPercent?: number;
  size?: "sm" | "md";
}

export function RecommendationBadge({
  type,
  gmpPercent,
  size = "sm",
}: RecommendationBadgeProps) {
  return <GMPBadge gmpPercent={gmpPercent} size={size} />;
}
