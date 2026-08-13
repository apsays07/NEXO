"use client";

import React, { useState } from "react";
import { AdminTab } from "../types/admin";
import { AdminProfileMenu } from "./AdminProfileMenu";
import { useNexo } from "@/context/NexoContext";
import { formatINR } from "@/lib/mockData";
import {
  MagnifyingGlass,
  Bell,
  List,
  ShieldCheck,
  Wallet,
  X,
} from "@phosphor-icons/react";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
}

export function AdminHeader({
  activeTab,
  onOpenMobileSidebar,
  onOpenSearch,
}: AdminHeaderProps) {
  const { portfolioSummary } = useNexo();
  const [showNotifications, setShowNotifications] = useState(false);

  const getTabTitle = (tab: AdminTab): string => {
    switch (tab) {
      case "dashboard":
        return "Dashboard Overview";
      case "ipos":
        return "IPO Catalog & Operations";
      case "applications":
        return "Applications Ledger";
      case "allotments":
        return "Allotment Processor";
      case "holdings":
        return "Group Holdings";
      case "transactions":
        return "Transactions Ledger";
      case "members":
        return "Members & Roles";
      case "messages":
        return "Group Operations Chat";
      case "activity":
        return "Operational Activity";
      case "security":
        return "Security & Audit Logs";
      case "settings":
        return "Workspace Settings";
      default:
        return "Dashboard";
    }
  };

  const availableCapital = portfolioSummary?.availableCapital ?? 100000;

  return (
    <header className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md border-b border-line px-4 sm:px-6 h-14 flex items-center justify-between shadow-2xs shrink-0 font-sans">
      {/* LEFT BREADCRUMB */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-1.5 rounded-lg border border-line text-ink-secondary hover:text-ink hover:bg-surface-hover cursor-pointer"
          title="Open Admin Navigation"
        >
          <List size={18} />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-black tracking-wider text-ink uppercase">NEXO</span>
            <span className="text-ink-tertiary text-xs font-normal">/</span>
            <span className="text-xs font-bold text-ink-secondary tracking-tight">Admin Console</span>
            <span className="hidden sm:inline-block text-ink-tertiary text-xs font-normal">/</span>
            <span className="hidden sm:inline-block text-xs font-extrabold text-accent tracking-tight truncate">
              {getTabTitle(activeTab)}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-mono font-bold">
            <ShieldCheck size={12} weight="fill" />
            <span>SECURE</span>
          </div>
        </div>
      </div>

      {/* RIGHT TOOLS */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Available Capital Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-surface-alt border border-line text-xs">
          <Wallet size={14} className="text-accent shrink-0" />
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[10px] text-ink-tertiary uppercase font-sans font-semibold">Avail. Capital:</span>
            <span className="font-bold text-ink">{formatINR(availableCapital)}</span>
          </div>
        </div>

        {/* Search Command Center Button */}
        <button
          id="admin-global-search-trigger"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-surface hover:bg-surface-hover border border-line text-xs font-medium text-ink-secondary hover:text-ink transition-all cursor-pointer shadow-2xs"
          title="Global Search (Ctrl+K)"
        >
          <MagnifyingGlass size={15} className="text-ink-tertiary" />
          <span className="hidden md:inline text-xs text-ink-tertiary">Search IPOs, members...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-ink-tertiary px-1.5 py-0.5 rounded bg-surface-alt border border-line">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl border border-line text-ink-secondary hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-surface border border-line shadow-2xl z-50 p-3 text-xs font-sans animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-line pb-2 mb-2">
                <span className="font-bold text-ink">Operational Notifications</span>
                <button onClick={() => setShowNotifications(false)} className="text-ink-tertiary hover:text-ink">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                  <p className="font-bold text-[11px]">Allotment update required</p>
                  <p className="text-[10px] text-ink-secondary mt-0.5">Hexaware Tech results expected today.</p>
                </div>
                <div className="p-2 rounded-xl bg-surface-alt border border-line">
                  <p className="font-bold text-[11px] text-ink">Application proof uploaded</p>
                  <p className="text-[10px] text-ink-tertiary mt-0.5">Ankit uploaded payment receipt for Tata Tech.</p>
                </div>
                <div className="p-2 rounded-xl bg-surface-alt border border-line">
                  <p className="font-bold text-[11px] text-ink">New admin session</p>
                  <p className="text-[10px] text-ink-tertiary mt-0.5">Logged in from Chrome Windows 2m ago.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <AdminProfileMenu />
      </div>
    </header>
  );
}
