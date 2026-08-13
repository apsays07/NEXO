"use client";

import React, { useState } from "react";

interface ProfileAvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  onClick?: () => void;
}

export function ProfileAvatar({
  src,
  name,
  size = "md",
  className = "",
  onClick,
}: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const initials = (name || "N")
    .trim()
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: "w-7 h-7 text-caption font-bold",
    md: "w-9 h-9 text-small font-extrabold",
    lg: "w-11 h-11 text-base font-extrabold",
    xl: "w-14 h-14 text-lg font-extrabold",
    hero: "w-20 h-20 sm:w-24 sm:h-24 text-h2 font-black",
  };

  const hasPhoto = Boolean(src && !imageError);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {hasPhoto ? (
        <img
          src={src!}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full rounded-full object-cover ring-2 ring-accent/20 shadow-2xs"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-accent to-accent-hover text-white flex items-center justify-center ring-2 ring-accent/30 shadow-2xs tracking-tight">
          {initials}
        </div>
      )}
    </div>
  );
}
