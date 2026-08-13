import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "success" | "danger" | "tertiary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-page disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer tracking-tight";

  const variantStyles = {
    primary:
      "bg-accent hover:opacity-90 text-white font-semibold focus:ring-accent/15 shadow-2xs",
    secondary:
      "bg-surface-alt hover:bg-surface-hover text-ink font-medium border border-line focus:ring-line-strong",
    tertiary:
      "bg-surface-alt hover:bg-surface-hover text-ink font-medium border border-line focus:ring-line-strong",
    ghost:
      "bg-transparent hover:bg-surface-hover text-ink-secondary hover:text-ink font-medium focus:ring-line",
    outline:
      "bg-transparent hover:bg-surface-hover text-ink font-medium border border-line-strong focus:ring-line-strong",
    success:
      "bg-positive hover:opacity-90 text-white font-semibold focus:ring-positive/15 shadow-2xs",
    danger:
      "bg-negative-soft text-negative hover:bg-negative-soft/90 font-medium border border-negative/30 focus:ring-negative/15",
  };

  const sizeStyles = {
    sm: "px-3 h-8 text-[13px] leading-[18px] font-semibold gap-1.5",
    md: "px-3.5 h-9 text-sm leading-5 gap-2",
    lg: "px-5 h-10 text-sm leading-5 font-semibold gap-2 rounded-xl",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
