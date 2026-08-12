"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import {
  Users,
  Lightning,
  Gear,
  X,
  ShieldCheck,
  Moon,
  Sun,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { formatINR } from "@/lib/mockData";

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoreDrawer({ isOpen, onClose }: MoreDrawerProps) {
  const { activeTab, setActiveTab, members, portfolioSummary } = useNexo();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const adminMember = members[0];

  const handleNavClick = (tabId: string) => {
    if (["dashboard", "ipos", "applications", "portfolio", "members"].includes(tabId)) {
      setActiveTab(tabId as "dashboard" | "ipos" | "applications" | "portfolio" | "members");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay backdrop-blur-xs animate-fade-in font-sans lg:hidden">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="relative z-10 w-full max-h-[85vh] overflow-y-auto bg-surface rounded-t-3xl border-t border-line shadow-2xl animate-slide-up flex flex-col p-5 space-y-5 pb-safe-nav">
        {/* Handle / Drag Pill */}
        <div className="w-12 h-1.5 bg-surface-alt rounded-full mx-auto shrink-0" />

        {/* Header: User Profile */}
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <div className="flex items-center gap-3">
            <img
              src={adminMember?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={adminMember?.name || "Ankit"}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/20"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-ink tracking-tight">
                  {adminMember?.name || "Ankit"}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-soft text-accent border border-accent/30">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-ink-tertiary font-medium">
                Group Admin • {adminMember?.panMasked || "ABCDE2741D"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink-secondary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Capital Summary Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-surface-alt border border-line/80">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase text-ink-muted block tracking-wider">
              Available Capital
            </span>
            <span className="text-sm font-mono font-bold text-ink">
              {formatINR(portfolioSummary.availableCapital)}
            </span>
          </div>
          <div className="space-y-0.5 text-right">
            <span className="text-[11px] font-bold uppercase text-ink-muted block tracking-wider">
              Capital Deployed
            </span>
            <span className="text-sm font-mono font-bold text-accent">
              {formatINR(portfolioSummary.capitalDeployed)}
            </span>
          </div>
        </div>

        {/* Extended Navigation Options */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider px-2">
            Community & Management
          </span>

          <button
            onClick={() => handleNavClick("members")}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "members"
                ? "bg-accent-soft text-accent border border-accent/30"
                : "text-ink-secondary hover:bg-surface-hover"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-ink-secondary">
                <Users size={18} />
              </div>
              <span>Group Members</span>
            </div>
            <span className="text-xs font-mono font-bold bg-surface-alt text-ink-secondary px-2 py-0.5 rounded-full">
              {members.length}
            </span>
          </button>

          <button
            onClick={() => handleNavClick("members")}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-ink-secondary hover:bg-surface-hover transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-ink-secondary">
                <Lightning size={18} />
              </div>
              <span>Activity Log</span>
            </div>
            <span className="text-[10px] font-bold bg-positive-soft text-positive px-2 py-0.5 rounded-full border border-positive/30">
              LIVE
            </span>
          </button>

          <button
            onClick={() => handleNavClick("members")}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-ink-secondary hover:bg-surface-hover transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-ink-secondary">
                <Gear size={18} />
              </div>
              <span>Settings & Rules</span>
            </div>
          </button>

          <button
            onClick={() => {
              toggleTheme();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-ink-secondary hover:bg-surface-hover transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center text-ink-secondary">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </div>
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <span className="text-[10px] font-bold bg-surface-alt text-ink-tertiary px-2 py-0.5 rounded-full border border-line">
              Ctrl+Shift+D
            </span>
          </button>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-3 border-t border-line flex items-center justify-between text-xs text-ink-muted font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-positive" />
            <span>NEXO Encrypted Vault</span>
          </div>
          <span>v2.4.0</span>
        </div>
      </div>
    </div>
  );
}
