"use client";

import React from "react";
import { ProfileAvatar } from "./ProfileAvatar";
import { Camera, CheckCircle, PencilSimple } from "@phosphor-icons/react";

interface ProfileHeaderProps {
  name: string;
  role: string;
  avatar?: string | null;
  isVerified?: boolean;
  createdAt?: string;
  onEditProfile: () => void;
}

export function ProfileHeader({
  name,
  role,
  avatar,
  isVerified = true,
  createdAt = "August 2026",
  onEditProfile,
}: ProfileHeaderProps) {
  return (
    <div className="p-5 sm:p-6 bg-surface border border-line rounded-2xl shadow-2xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Avatar with Overlay Camera Button */}
          <div className="relative group cursor-pointer" onClick={onEditProfile}>
            <ProfileAvatar src={avatar} name={name} size="hero" />
            <div className="absolute inset-0 rounded-full bg-slate-900/50 backdrop-blur-3xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white shadow-md">
              <Camera size={22} weight="bold" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-h2 font-semibold text-ink tracking-tight leading-tight">
                {name}
              </h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-positive-soft border border-positive/30 text-positive text-caption font-semibold">
                  <CheckCircle size={13} weight="fill" />
                  <span>Verified Member</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-caption text-ink-tertiary font-medium">
              <span className="px-2 py-0.5 rounded bg-accent-soft text-accent border border-accent/20 font-semibold uppercase tracking-wider">
                {role}
              </span>
              <span>•</span>
              <span>Member since {createdAt}</span>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <button
          onClick={onEditProfile}
          className="px-4 py-2 rounded-xl bg-surface-alt border border-line-strong hover:bg-surface-hover text-ink font-semibold text-small shadow-2xs transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 self-start sm:self-center"
        >
          <PencilSimple size={15} />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}
