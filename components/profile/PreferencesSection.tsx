"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PreferenceToggle } from "./PreferenceToggle";
import { Sliders, Sun, Moon, Globe, Bell } from "@phosphor-icons/react";

export function PreferencesSection() {
  const { theme, toggleTheme } = useTheme();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [appReminders, setAppReminders] = useState(true);
  const [ipoReminders, setIpoReminders] = useState(true);

  return (
    <div className="p-5 sm:p-6 bg-surface border border-line rounded-2xl space-y-4 font-sans">
      <div className="flex items-center gap-2.5 pb-3 border-b border-line">
        <div className="w-8 h-8 rounded-lg bg-surface-alt border border-line-strong text-ink flex items-center justify-center font-bold">
          <Sliders size={18} />
        </div>
        <div>
          <h3 className="text-h4 font-semibold text-ink">Preferences</h3>
          <p className="text-caption text-ink-tertiary font-medium">
            Appearance, regional settings, and alert dispatch rules
          </p>
        </div>
      </div>

      <div className="space-y-4 text-small">
        {/* Theme Selector */}
        <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-line-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider flex items-center gap-1.5">
              {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />} Appearance
            </span>
            <kbd className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-surface border border-line text-ink-tertiary">
              Ctrl + Shift + D
            </kbd>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (theme !== "light") toggleTheme();
              }}
              className={`p-2.5 rounded-xl border text-caption font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === "light"
                  ? "bg-surface border-accent text-accent shadow-xs"
                  : "bg-surface-alt border-line text-ink-secondary hover:text-ink"
              }`}
            >
              <Sun size={15} /> Light Theme
            </button>
            <button
              onClick={() => {
                if (theme !== "dark") toggleTheme();
              }}
              className={`p-2.5 rounded-xl border text-caption font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-surface border-accent text-accent shadow-xs"
                  : "bg-surface-alt border-line text-ink-secondary hover:text-ink"
              }`}
            >
              <Moon size={15} /> Dark Theme
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-line-subtle flex items-center justify-between">
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <Globe size={14} /> System Language
          </span>
          <span className="font-semibold text-ink">English (US)</span>
        </div>

        {/* Notification Rules */}
        <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-line-subtle space-y-1">
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider block mb-1 flex items-center gap-1.5">
            <Bell size={14} /> Notification Preferences
          </span>

          <PreferenceToggle
            label="Email Notifications"
            description="Receive syndicate decision digests"
            checked={emailNotifs}
            onChange={setEmailNotifs}
          />
          <PreferenceToggle
            label="Application Reminders"
            description="Get alerted before bidding closes"
            checked={appReminders}
            onChange={setAppReminders}
          />
          <PreferenceToggle
            label="IPO Launch Reminders"
            description="Notifications on new mainboard opportunities"
            checked={ipoReminders}
            onChange={setIpoReminders}
          />
        </div>
      </div>
    </div>
  );
}
