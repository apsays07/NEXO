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
      className={`bg-surface rounded-2xl border border-line p-5 transition-all duration-200 shadow-2xs font-sans ${
        hoverable
          ? "hover:bg-surface hover:border-line-strong hover:shadow-md hover:shadow-line/20 cursor-pointer active:scale-[0.99]"
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
}

export function MetricCard({
  label,
  value,
  subtitle,
  change,
  changeType = "positive",
  icon,
}: MetricCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-ink-secondary uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-surface-alt text-ink-secondary border border-line">
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink num-tabular">
          {value}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {change && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                changeType === "positive"
                  ? "bg-positive-soft text-positive border border-positive/30"
                  : changeType === "negative"
                  ? "bg-negative-soft text-negative border border-negative/30"
                  : "bg-surface-alt text-ink-secondary border border-line"
              }`}
            >
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-ink-secondary font-normal">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
