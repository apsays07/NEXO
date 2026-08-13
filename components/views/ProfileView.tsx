"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { useTheme } from "@/components/providers/ThemeProvider";
import { getProfile } from "@/src/features/profile/api";
import { UserProfile } from "@/src/features/profile/types";
import { ProfileEditor } from "../profile/ProfileEditor";
import {
  PencilSimple,
  EnvelopeSimple,
  Phone,
  IdentificationCard,
  Shield,
  User,
  CheckCircle,
} from "@phosphor-icons/react";

const FIELD_ROWS = [
  { key: "name",      label: "Full Name",     Icon: User,               mono: false },
  { key: "email",     label: "Email",         Icon: EnvelopeSimple,     mono: false },
  { key: "phone",     label: "Phone",         Icon: Phone,              mono: false },
  { key: "panMasked", label: "PAN",           Icon: IdentificationCard, mono: true  },
  { key: "roleLabel", label: "Role",          Icon: Shield,             mono: false },
] as const;

export function ProfileView() {
  const { currentUser, members, updateCurrentUser } = useNexo();
  const { theme } = useTheme();
  const activeUser = currentUser || members[0];
  const isDark = theme === "dark";

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await getProfile();
        if (res?.profile) setProfileData(res.profile);
      } catch (e) {}
    }
    loadProfile();
  }, []);

  // Session (activeUser) always wins for identity — the DB profile is supplemental only.
  // profileData may be a stale singleton seeded with a placeholder name; never let it
  // override the currently-logged-in user's real data.
  const name        = activeUser?.name      || profileData?.name      || "Member";
  const displayName = name;
  const email       = activeUser?.email     || (profileData?.email  && profileData.email.trim() ? profileData.email   : "")  || "";
  const phone       = activeUser?.phone     || profileData?.phone     || "";
  const avatar      = activeUser?.avatar    || profileData?.avatar    || "";
  const role        = String(activeUser?.role || profileData?.role || "MEMBER").toUpperCase();
  const panMasked   = activeUser?.panMasked || profileData?.panMasked || "";
  const roleLabel   = role === "ADMIN" ? "Administrator" : "Member";

  const fieldValues: Record<string, string> = { name, email, phone, panMasked, roleLabel };

  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  /* ── theme-dependent tokens ── */
  const bgImage   = isDark ? "url('/profile-bg.jpg')"       : "url('/profile-bg-light.jpg')";
  const overlay   = isDark
    ? "linear-gradient(to bottom, rgba(6,8,16,0.50) 0%, rgba(6,8,16,0.35) 40%, rgba(6,8,16,0.88) 80%, rgba(6,8,16,1) 100%)"
    : "linear-gradient(to bottom, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.20) 40%, rgba(255,255,255,0.88) 80%, rgba(255,255,255,1) 100%)";
  const cardBg    = isDark ? "rgba(14,16,22,0.70)"          : "rgba(255,255,255,0.72)";
  const cardBorder= isDark ? "rgba(255,255,255,0.07)"       : "rgba(0,0,0,0.08)";
  const rowDivide = isDark ? "rgba(255,255,255,0.05)"       : "rgba(0,0,0,0.06)";
  const labelColor= isDark ? "rgba(133,141,153,0.75)"       : "rgba(80,90,110,0.75)";
  const valueColor= isDark ? "#E8ECF0"                      : "#111318";
  const nameColor = isDark ? "#F5F7FA"                      : "#111318";
  const iconBg    = isDark ? "rgba(255,255,255,0.05)"       : "rgba(0,0,0,0.05)";
  const iconBorder= isDark ? "rgba(255,255,255,0.08)"       : "rgba(0,0,0,0.08)";
  const iconColor = isDark ? "rgba(133,141,153,0.8)"        : "rgba(80,90,110,0.8)";
  const editBg    = isDark ? "rgba(255,255,255,0.06)"       : "rgba(0,0,0,0.05)";
  const editBorder= isDark ? "rgba(255,255,255,0.12)"       : "rgba(0,0,0,0.12)";
  const editColor = isDark ? "rgba(245,247,250,0.75)"       : "rgba(30,40,60,0.75)";
  const footerColor= isDark ? "rgba(98,106,117,0.6)"        : "rgba(100,110,130,0.6)";
  const dotColor  = isDark ? "rgba(180,200,255,0.07)"       : "rgba(60,100,220,0.05)";

  return (
    <div
      className="relative h-full flex flex-col items-center justify-center font-sans animate-fade-in overflow-hidden"
      style={{ minHeight: "calc(100vh - 60px)" }}
    >

      {/* ── Background image (theme-aware) ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: bgImage, backgroundSize: "cover", backgroundPosition: "center top" }}
      />
      {/* ── Overlay (theme-aware) ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background: overlay }}
      />
      {/* ── Dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor.replace("0.07","0.9")} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          opacity: 0.6,
        }}
      />

      {/* ══════════════════════════════════════
          SINGLE-FRAME CARD
      ══════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-sm px-4 flex flex-col items-center gap-4">

        {/* ── Avatar ── */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full animate-pulse-glow pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(107,147,255,0.45) 0%, transparent 70%)", transform: "scale(1.9)" }}
          />
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: isDark
              ? "0 0 0 3px rgba(107,147,255,0.35), 0 0 0 7px rgba(107,147,255,0.10), 0 0 28px rgba(107,147,255,0.25)"
              : "0 0 0 3px rgba(60,100,220,0.25), 0 0 0 7px rgba(60,100,220,0.08), 0 0 28px rgba(60,100,220,0.15)"
            }}
          />
          {avatar ? (
            <img src={avatar} alt={name} className="relative w-20 h-20 rounded-full object-cover" />
          ) : (
            <div
              className="relative w-20 h-20 rounded-full text-white flex items-center justify-center text-2xl font-bold select-none"
              style={{ background: "linear-gradient(135deg, #4f52ff 0%, #6b93ff 50%, #29b6f6 100%)" }}
            >
              {initials}
            </div>
          )}
          <span
            className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2"
            style={{ background: "#32C98B", borderColor: isDark ? "#060810" : "#ffffff", boxShadow: "0 0 6px rgba(50,201,139,0.7)" }}
          />
        </div>

        {/* ── Name + role ── */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color: nameColor }}>{name}</h1>
            <CheckCircle size={18} weight="fill" style={{ color: "#6B93FF", flexShrink: 0 }} />
          </div>
          <span
            className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
            style={{ background: "rgba(107,147,255,0.12)", borderColor: "rgba(107,147,255,0.28)", color: "#6B93FF" }}
          >
            {role}
          </span>
        </div>

        {/* ── Details card ── */}
        <div
          className="w-full rounded-2xl overflow-hidden shadow-xl"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
        >
          {FIELD_ROWS.map(({ key, label, Icon, mono }) => (
            <div
              key={key}
              className="group flex items-center gap-3 px-4 py-3 transition-all duration-150 cursor-default"
              style={{ borderBottom: `1px solid ${rowDivide}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = isDark ? "rgba(107,147,255,0.05)" : "rgba(60,100,220,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
              >
                <Icon size={14} style={{ color: iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: labelColor }}>{label}</p>
                <p className={`text-small font-semibold truncate ${mono ? "font-mono tracking-widest" : ""}`} style={{ color: valueColor }}>
                  {fieldValues[key]}
                </p>
              </div>
              {key !== "roleLabel" && key !== "panMasked" && (
                <PencilSimple
                  size={12}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                  style={{ color: "#6B93FF" }}
                  onClick={() => setIsEditorOpen(true)}
                />
              )}
            </div>
          ))}

          {/* Edit button inside card footer */}
          <button
            onClick={() => setIsEditorOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 transition-all duration-200 cursor-pointer"
            style={{ background: editBg, color: editColor }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(107,147,255,0.10)"; (e.currentTarget as HTMLButtonElement).style.color = "#6B93FF"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = editBg; (e.currentTarget as HTMLButtonElement).style.color = editColor; }}
          >
            <PencilSimple size={13} />
            <span className="text-[12px] font-semibold">Edit Profile</span>
          </button>
        </div>

        {/* Footer note */}
        <p className="text-[11px] text-center leading-relaxed" style={{ color: footerColor }}>
          Your details are private and encrypted end-to-end.
        </p>
      </div>

      {/* Edit Profile Drawer */}
      <ProfileEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        currentName={name}
        currentDisplayName={displayName}
        currentEmail={email}
        currentPhone={phone}
        currentAvatar={avatar}
        onSuccess={(updated) => {
          // 1. Update local profile state (profile page itself)
          setProfileData((prev) => ({ ...(prev || ({} as any)), ...updated }));
          // 2. Push name + avatar into the global currentUser so every
          //    component (Sidebar, TopBar, MoreDrawer…) reflects the change immediately.
          updateCurrentUser({
            name: updated.name,
            avatar: updated.avatar,
            email: updated.email,
          });
        }}
      />
    </div>
  );
}
