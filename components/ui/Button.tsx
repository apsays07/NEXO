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
    "inline-flex items-center justify-center transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer tracking-tight";

  const variantStyles = {
    primary:
      "bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold focus:ring-[#2563EB] shadow-2xs",
    secondary:
      "bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#111318] font-medium border border-[#E2E8F0] focus:ring-[#CBD5E1]",
    ghost:
      "bg-transparent hover:bg-[#F1F5F9] text-[#5F6673] hover:text-[#111318] font-medium focus:ring-[#E2E8F0]",
    outline:
      "bg-transparent hover:bg-[#F8FAFC] text-[#111318] font-medium border border-[#CBD5E1] focus:ring-[#94A3B8]",
    success:
      "bg-[#12B76A] hover:bg-[#027A48] text-white font-semibold focus:ring-[#12B76A] shadow-2xs",
    danger:
      "bg-[#FEF3F2] text-[#B42318] hover:bg-[#FEE4E2] font-medium border border-[#FECDCA] focus:ring-[#F04438]",
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
