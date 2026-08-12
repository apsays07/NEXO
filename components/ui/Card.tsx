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
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-[#5F6673] uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {action}
          {icon && (
            <div className="p-2 rounded-xl bg-[#F1F5F9] text-[#5F6673] border border-[#E2E8F0]">
              {icon}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#111318] num-tabular">
          {value}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {change && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
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
            <span className="text-xs text-[#5F6673] font-normal">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
