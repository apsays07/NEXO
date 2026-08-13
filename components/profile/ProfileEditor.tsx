"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Camera, CircleNotch, CheckCircle, Warning, UploadSimple } from "@phosphor-icons/react";
import { updateProfile, uploadAvatar } from "@/src/features/profile/api";

/* ─── Oggy and the Cockroaches Presets ─── */
const CARTOON_PRESETS = [
  {
    id: "preset_1",
    url: "/oggy.png",
    label: "Oggy",
  },
  {
    id: "preset_2",
    url: "/jack.png",
    label: "Jack",
  },
  {
    id: "preset_3",
    url: "/sinchan.png",
    label: "Shinchan",
  },
  {
    id: "preset_4",
    url: "/doremon.png",
    label: "Doraemon",
  },
  {
    id: "preset_5",
    url: "/japlu.png",
    label: "Cockroach",
  },
];

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentDisplayName: string;
  currentEmail: string;
  currentPhone: string;
  currentAvatar: string;
  onSuccess: (updated: {
    name: string;
    displayName: string;
    email: string;
    phone: string;
    avatar: string;
  }) => void;
}

export function ProfileEditor({
  isOpen,
  onClose,
  currentName,
  currentDisplayName,
  currentEmail,
  currentPhone,
  currentAvatar,
  onSuccess,
}: ProfileEditorProps) {
  const [name, setName] = useState(currentName);
  const [displayName, setDisplayName] = useState(currentDisplayName);
  const [email, setEmail] = useState(currentEmail);
  const [phone, setPhone] = useState(currentPhone);
  const [avatar, setAvatar] = useState(currentAvatar);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setDisplayName(currentDisplayName || currentName);
      setEmail(currentEmail);
      setPhone(currentPhone);
      setAvatar(currentAvatar);
      setError(null);
      setToastMessage(null);
    }
  }, [isOpen, currentName, currentDisplayName, currentEmail, currentPhone, currentAvatar]);

  if (!isOpen) return null;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }
    setIsUploading(true);
    setError(null);
    try {
      const res = await uploadAvatar(file);
      setAvatar(res.avatarUrl);
      setToastMessage("Custom photo uploaded!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      // reset so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: name.trim(),
        displayName: displayName.trim() || name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar,
      });
      onSuccess({
        name: name.trim(),
        displayName: displayName.trim() || name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar,
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save profile changes.");
      setIsSubmitting(false);
    }
  };

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-lg bg-surface border border-line rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">

        {/* ── Header ── */}
        <div className="p-5 border-b border-line flex items-center justify-between bg-surface shrink-0">
          <div>
            <h3 className="text-h4 font-semibold text-ink">Edit Profile</h3>
            <p className="text-caption text-ink-tertiary font-medium">
              Choose an avatar &amp; update your info
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-tertiary hover:text-ink hover:bg-surface-alt transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6 text-small font-medium">

            {/* Alerts */}
            {error && (
              <div className="p-3 rounded-xl bg-negative-soft border border-negative/30 text-negative text-small font-semibold flex items-center gap-2">
                <Warning size={16} />
                <span>{error}</span>
              </div>
            )}
            {toastMessage && (
              <div className="p-3 rounded-xl bg-positive-soft border border-positive/30 text-positive text-small font-semibold flex items-center gap-2">
                <CheckCircle size={16} weight="fill" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* ══════════════════════════════════════════
                AVATAR PICKER
            ══════════════════════════════════════════ */}
            <div className="space-y-3">
              <p className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider">
                Choose your avatar
              </p>

              {/* Current preview */}
              <div className="flex justify-center">
                <div className="relative">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Current avatar"
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-accent/40 shadow-lg"
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white ring-4 ring-accent/40 shadow-lg select-none"
                      style={{ background: "linear-gradient(135deg, #4f52ff 0%, #6b93ff 50%, #29b6f6 100%)" }}
                    >
                      {initials}
                    </div>
                  )}
                  <span
                    className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-surface"
                    style={{ background: "#32C98B" }}
                  />
                </div>
              </div>

              {/* 5 Cartoon presets */}
              <div className="grid grid-cols-5 gap-2.5">
                {CARTOON_PRESETS.map((preset) => {
                  const isSelected = avatar === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setAvatar(preset.url);
                        setToastMessage(`${preset.label} selected!`);
                        setTimeout(() => setToastMessage(null), 2000);
                      }}
                      title={preset.label}
                      className="relative flex flex-col items-center gap-1.5 group focus:outline-none"
                    >
                      {/* Ring container */}
                      <div
                        className={`relative rounded-full transition-all duration-200 ${
                          isSelected
                            ? "ring-2 ring-offset-2 ring-accent ring-offset-surface scale-105 shadow-lg"
                            : "ring-2 ring-transparent hover:ring-accent/40 hover:scale-105"
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-14 h-14 rounded-full object-contain p-1.5 bg-surface-alt border border-line-subtle shadow-2xs"
                          loading="lazy"
                        />
                        {/* Checkmark overlay */}
                        {isSelected && (
                          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-accent/20">
                            <CheckCircle size={20} weight="fill" className="text-accent drop-shadow" />
                          </div>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-semibold transition-colors ${
                          isSelected ? "text-accent" : "text-ink-tertiary group-hover:text-ink"
                        }`}
                      >
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Upload from file */}
              <div className="pt-1">
                <label
                  className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-dashed cursor-pointer transition-all duration-150 ${
                    isUploading
                      ? "border-accent/40 bg-accent/5 text-accent/60"
                      : "border-line-strong hover:border-accent/50 hover:bg-surface-alt text-ink-tertiary hover:text-ink"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <CircleNotch size={15} className="animate-spin text-accent" />
                      <span className="text-small font-semibold text-accent">Uploading…</span>
                    </>
                  ) : (
                    <>
                      <UploadSimple size={15} />
                      <span className="text-small font-semibold">Upload from device</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <p className="text-center text-[10px] text-ink-tertiary mt-1.5">
                  JPG, PNG, WEBP · max 5 MB
                </p>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                IDENTITY FIELDS
            ══════════════════════════════════════════ */}
            <div className="space-y-4">
              <p className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider">
                Personal info
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-caption font-semibold text-ink-secondary mb-1">
                    Full Name <span className="text-negative">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-caption font-semibold text-ink-secondary mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Shown in sidebar"
                    className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-caption font-semibold text-ink-secondary mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-caption font-semibold text-ink-secondary mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer controls ── */}
          <div className="px-6 pb-6 pt-2 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-line text-small font-semibold text-ink-secondary hover:bg-surface-alt transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-70 text-white font-semibold text-small shadow-xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <CircleNotch size={16} className="animate-spin text-white" />
                  <span>Saving…</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
