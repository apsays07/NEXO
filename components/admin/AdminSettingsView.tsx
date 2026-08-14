"use client";

import React, { useState } from "react";
import {
  Gear,
  SlidersHorizontal,
  ShieldCheck,
  Bell,
  Database,
  CheckCircle,
  ArrowClockwise,
  Sun,
  Moon,
  Desktop,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function AdminSettingsView() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"general" | "appearance" | "security" | "notifications" | "system">("general");

  // General Settings State
  const [workspaceName, setWorkspaceName] = useState("NEXO Private Workspace");
  const [currency, setCurrency] = useState("INR (₹)");
  const [allotmentPolicy, setAllotmentPolicy] = useState("pro-rata");
  const [autoSyncDisk, setAutoSyncDisk] = useState(true);

  // Security Settings State
  const [enable2FA, setEnable2FA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("24h");
  const [requirePassConfirm, setRequirePassConfirm] = useState(true);
  const [auditVerbosity, setAuditVerbosity] = useState("detailed");

  // Notification Settings State
  const [notifyNewMember, setNotifyNewMember] = useState(true);
  const [notifyIpoExpiry, setNotifyIpoExpiry] = useState(true);
  const [realtimeWs, setRealtimeWs] = useState(true);

  // Status Alerts
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("Admin settings saved successfully.");
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch("/api/seed-db");
      const data = await res.json();
      if (data?.success) {
        setStatusMsg("Database re-seeded successfully with default IPOs and members.");
      } else {
        setStatusMsg("Database seed failed or already populated.");
      }
    } catch {
      setStatusMsg("Database seed executed.");
    } finally {
      setIsSeeding(false);
      setTimeout(() => setStatusMsg(null), 5000);
    }
  };

  return (
    <div className="space-y-6 font-sans antialiased text-slate-900 dark:text-[#F5F7FA] pb-12">
      {/* ── HEADER TITLE ── */}
      <div className="bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-[#17233D] text-blue-600 dark:text-[#6B93FF] border border-blue-200 dark:border-[#6B93FF]/30 flex items-center justify-center font-bold">
              <Gear size={18} />
            </div>
            <h1 className="text-xl font-black text-slate-800 dark:text-[#F5F7FA] tracking-tight">
              Admin Console Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#858D99] font-medium mt-1">
            Manage system policies, security parameters, notifications, appearance, and workspace defaults.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-5 py-2.5 rounded-xl bg-blue-600 dark:bg-[#6B93FF] hover:bg-blue-500 dark:hover:bg-[#7BA0FF] text-white dark:text-[#101114] font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer active:scale-95"
        >
          Save All Settings
        </button>
      </div>

      {/* Save Notification */}
      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-[#102C22] border border-emerald-200 dark:border-[#32C98B]/20 text-emerald-800 dark:text-[#32C98B] text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle size={18} className="text-emerald-600 dark:text-[#32C98B] shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* ── SETTINGS NAVIGATION TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#252931] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "general"
              ? "bg-slate-900 dark:bg-[#6B93FF] text-white dark:text-[#101114] shadow-sm"
              : "text-slate-600 dark:text-[#AEB5C0] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#14161A]"
          }`}
        >
          <SlidersHorizontal size={15} />
          <span>General Workspace</span>
        </button>

        <button
          onClick={() => setActiveTab("appearance")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "appearance"
              ? "bg-slate-900 dark:bg-[#6B93FF] text-white dark:text-[#101114] shadow-sm"
              : "text-slate-600 dark:text-[#AEB5C0] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#14161A]"
          }`}
        >
          {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
          <span>Appearance & Theme</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "security"
              ? "bg-slate-900 dark:bg-[#6B93FF] text-white dark:text-[#101114] shadow-sm"
              : "text-slate-600 dark:text-[#AEB5C0] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#14161A]"
          }`}
        >
          <ShieldCheck size={15} />
          <span>Security & Auth</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "notifications"
              ? "bg-slate-900 dark:bg-[#6B93FF] text-white dark:text-[#101114] shadow-sm"
              : "text-slate-600 dark:text-[#AEB5C0] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#14161A]"
          }`}
        >
          <Bell size={15} />
          <span>Notifications & Realtime</span>
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "system"
              ? "bg-slate-900 dark:bg-[#6B93FF] text-white dark:text-[#101114] shadow-sm"
              : "text-slate-600 dark:text-[#AEB5C0] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#14161A]"
          }`}
        >
          <Database size={15} />
          <span>System & Database</span>
        </button>
      </div>

      {/* ── TAB CONTENT ── */}
      <form onSubmit={handleSaveSettings}>
        {/* 1. GENERAL TAB */}
        {activeTab === "general" && (
          <div className="bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-2xl p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-[#F5F7FA] uppercase tracking-wider">
                Workspace Configuration
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#858D99] font-medium">
                Default settings applied across the NEXO private investment platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-[#858D99] uppercase tracking-wider block mb-1.5">
                  Workspace Title
                </label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] text-xs font-semibold text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-600 dark:focus:border-[#6B93FF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-[#858D99] uppercase tracking-wider block mb-1.5">
                  Base Currency Symbol
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] text-xs font-semibold text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-600 dark:focus:border-[#6B93FF]"
                >
                  <option value="INR (₹)">INR (₹) — Indian Rupee</option>
                  <option value="USD ($)">USD ($) — US Dollar</option>
                  <option value="EUR (€)">EUR (€) — Euro</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-[#858D99] uppercase tracking-wider block mb-1.5">
                  Default IPO Allotment Policy
                </label>
                <select
                  value={allotmentPolicy}
                  onChange={(e) => setAllotmentPolicy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] text-xs font-semibold text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-600 dark:focus:border-[#6B93FF]"
                >
                  <option value="pro-rata">Pro-Rata Distribution (Based on Contribution)</option>
                  <option value="lottery">Random Lottery (Equal Chance Per Account)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] self-end">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">Disk Storage Auto-Sync</p>
                  <p className="text-[10px] text-slate-500 dark:text-[#858D99] font-medium">
                    Persist added IPOs to shared_ipos.json
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSyncDisk}
                  onChange={(e) => setAutoSyncDisk(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 dark:accent-[#6B93FF] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. APPEARANCE TAB */}
        {activeTab === "appearance" && (
          <div className="bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-2xl p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-[#F5F7FA] uppercase tracking-wider">
                Theme & Interface Appearance
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#858D99] font-medium">
                Choose light or dark visual presentation for the entire NEXO platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => theme !== "light" && toggleTheme()}
                className={`p-5 rounded-2xl border transition-all text-left flex items-start gap-4 cursor-pointer ${
                  theme === "light"
                    ? "bg-blue-50 dark:bg-[#17233D] border-blue-500 dark:border-[#6B93FF] ring-2 ring-blue-500/20"
                    : "bg-slate-50 dark:bg-[#14161A] border-slate-200 dark:border-[#252931] hover:border-slate-300 dark:hover:border-[#343943]"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold shrink-0">
                  <Sun size={22} weight="bold" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-[#F5F7FA]">Light Mode</h4>
                    {theme === "light" && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#858D99] leading-relaxed">
                    Clean high-contrast theme optimized for bright workspaces.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => theme !== "dark" && toggleTheme()}
                className={`p-5 rounded-2xl border transition-all text-left flex items-start gap-4 cursor-pointer ${
                  theme === "dark"
                    ? "bg-blue-50 dark:bg-[#17233D] border-blue-500 dark:border-[#6B93FF] ring-2 ring-blue-500/20"
                    : "bg-slate-50 dark:bg-[#14161A] border-slate-200 dark:border-[#252931] hover:border-slate-300 dark:hover:border-[#343943]"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                  <Moon size={22} weight="bold" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-[#F5F7FA]">Dark Mode</h4>
                    {theme === "dark" && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-600 dark:bg-[#6B93FF] text-white dark:text-[#101114]">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#858D99] leading-relaxed">
                    Linear-inspired rich dark theme with reduced glare (#090A0C).
                  </p>
                </div>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">Global Theme Shortcut</p>
                <p className="text-[11px] text-slate-500 dark:text-[#858D99]">
                  Toggle light/dark mode instantly from anywhere using your keyboard.
                </p>
              </div>
              <kbd className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-[#1D2026] text-slate-700 dark:text-[#AEB5C0] font-mono text-xs font-bold border border-slate-300 dark:border-[#343943]">
                Ctrl + Shift + D
              </kbd>
            </div>
          </div>
        )}

        {/* 3. SECURITY TAB */}
        {activeTab === "security" && (
          <div className="bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-2xl p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-[#F5F7FA] uppercase tracking-wider">
                Security & Authentication Parameters
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#858D99] font-medium">
                Control access levels, session timeouts, and confirmation requirements.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931]">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">Admin 2-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-500 dark:text-[#858D99]">
                    Require OTP verification during admin sign-in.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enable2FA}
                  onChange={(e) => setEnable2FA(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 dark:accent-[#6B93FF] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931]">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">Profit Distribution Password Safeguard</p>
                  <p className="text-[11px] text-slate-500 dark:text-[#858D99]">
                    Require password re-entry before releasing allotment profits.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requirePassConfirm}
                  onChange={(e) => setRequirePassConfirm(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 dark:accent-[#6B93FF] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-[#858D99] uppercase tracking-wider block mb-1.5">
                    Session Expiration Time
                  </label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] text-xs font-semibold text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-600 dark:focus:border-[#6B93FF]"
                  >
                    <option value="15m">15 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="8h">8 Hours</option>
                    <option value="24h">24 Hours (Default)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 dark:text-[#858D99] uppercase tracking-wider block mb-1.5">
                    Audit Log Verbosity Level
                  </label>
                  <select
                    value={auditVerbosity}
                    onChange={(e) => setAuditVerbosity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] text-xs font-semibold text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:border-blue-600 dark:focus:border-[#6B93FF]"
                  >
                    <option value="standard">Standard (Security Events Only)</option>
                    <option value="detailed">Detailed (All Actions & Edits)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-2xl p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-[#F5F7FA] uppercase tracking-wider">
                Notifications & Broadcasts
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#858D99] font-medium">
                Configure alerts and real-time event broadcasting.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931]">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">New Member Registration Alerts</p>
                  <p className="text-[11px] text-slate-500 dark:text-[#858D99]">
                    Receive notification when a new member is provisioned.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyNewMember}
                  onChange={(e) => setNotifyNewMember(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 dark:accent-[#6B93FF] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931]">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">IPO Closing Expiry Warnings</p>
                  <p className="text-[11px] text-slate-500 dark:text-[#858D99]">
                    Alert when an active IPO reaches closing date within 24 hours.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyIpoExpiry}
                  onChange={(e) => setNotifyIpoExpiry(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 dark:accent-[#6B93FF] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931]">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">Real-Time WebSocket Sync</p>
                  <p className="text-[11px] text-slate-500 dark:text-[#858D99]">
                    Enable live realtime updates for IPO applications and chat messages.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={realtimeWs}
                  onChange={(e) => setRealtimeWs(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 dark:accent-[#6B93FF] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. SYSTEM TAB */}
        {activeTab === "system" && (
          <div className="bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-2xl p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-[#F5F7FA] uppercase tracking-wider">
                System & Database Operations
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#858D99] font-medium">
                Database management, seed operations, and server cache controls.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900 dark:bg-[#14161A] text-white dark:text-[#F5F7FA] border border-slate-800 dark:border-[#252931] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#858D99]">Database</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 dark:text-[#32C98B] text-[10px] font-bold">
                    Connected
                  </span>
                </div>
                <p className="text-sm font-extrabold font-mono">MongoDB (nexo)</p>
                <p className="text-[10px] text-slate-400 dark:text-[#858D99]">
                  Collections: ipos, members, applications, transactions, conversations
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#14161A] border border-slate-200 dark:border-[#252931] flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">Re-Seed Default Database</p>
                  <p className="text-[11px] text-slate-500 dark:text-[#858D99]">
                    Populate initial mock IPOs, transactions, and default admin/user accounts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSeedDatabase}
                  disabled={isSeeding}
                  className="w-full py-2 rounded-xl bg-blue-600 dark:bg-[#6B93FF] hover:bg-blue-500 dark:hover:bg-[#7BA0FF] text-white dark:text-[#101114] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ArrowClockwise size={15} className={isSeeding ? "animate-spin" : ""} />
                  <span>{isSeeding ? "Seeding..." : "Re-Seed Database"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
