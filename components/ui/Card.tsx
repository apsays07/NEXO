import React from "react";

interface CardProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  id,
  children,
  className = "",
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#E2E8F0] p-5 transition-all duration-200 shadow-2xs font-sans ${
        hoverable
          ? "hover:bg-white hover:border-[#CBD5E1] hover:shadow-md hover:shadow-slate-200/50 cursor-pointer active:scale-[0.99]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  subtitle,
  change,
  changeType = "positive",
  icon,
  action,
}: MetricCardProps) {
  return (
    <Card className="flex flex-col justify-between p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
          {label}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {action}
          {icon && (
            <div className="p-2 rounded-xl bg-slate-100/80 text-slate-600 border border-slate-200/80 shadow-2xs">
              {icon}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] num-tabular">
          {value}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {change && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                changeType === "positive"
                  ? "bg-[#ECFDF3] text-[#059669] border border-[#A6F4C5]"
                  : changeType === "negative"
                  ? "bg-[#FEF3F2] text-[#D92D20] border border-[#FECDCA]"
                  : "bg-[#F1F5F9] text-[#5F6673] border border-[#E2E8F0]"
              }`}
            >
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-slate-500 font-medium leading-normal">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
