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
    "inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F7F8FA] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer";

  const variantStyles = {
    primary:
      "bg-[#2F6BFF] hover:bg-[#1D52D8] text-white focus:ring-[#2F6BFF] shadow-2xs",
    secondary:
      "bg-[#F4F6F8] hover:bg-[#E4E7EC] text-[#111827] border border-[#E4E7EC] focus:ring-[#D0D5DD]",
    ghost:
      "bg-transparent hover:bg-[#F4F6F8] text-[#667085] hover:text-[#111827] focus:ring-[#E4E7EC]",
    outline:
      "bg-transparent hover:bg-[#F7F8FA] text-[#111827] border border-[#D0D5DD] focus:ring-[#98A2B3]",
    success:
      "bg-[#12B76A] hover:bg-[#027A48] text-white focus:ring-[#12B76A] shadow-2xs",
    danger:
      "bg-[#FEF3F2] text-[#B42318] hover:bg-[#FEE4E2] border border-[#FECDCA] focus:ring-[#F04438]",
  };

  const sizeStyles = {
    sm: "px-3 h-8 text-xs gap-1.5",
    md: "px-3.5 h-9 text-xs sm:text-sm gap-2",
    lg: "px-5 h-10 text-sm gap-2 rounded-lg",
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
