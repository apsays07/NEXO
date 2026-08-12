import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "success" | "danger";
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
    "inline-flex items-center justify-center font-bold transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-[#2563EB] hover:bg-[#1D4ED8] text-white focus:ring-[#2563EB] shadow-xs shadow-[#2563EB]/20",
    secondary:
      "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#E2E8F0] focus:ring-[#CBD5E1]",
    ghost:
      "bg-transparent hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] focus:ring-[#E2E8F0]",
    outline:
      "bg-transparent hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] focus:ring-[#94A3B8]",
    success:
      "bg-[#059669] hover:bg-[#047857] text-white font-bold focus:ring-[#059669] shadow-xs",
    danger:
      "bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2] border border-[#FCA5A5] focus:ring-[#DC2626]",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 rounded-2xl",
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
