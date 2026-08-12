"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import {
  Users,
  Lightning,
  Gear,
  X,
  ShieldCheck,
} from "@phosphor-icons/react";
import { formatINR } from "@/lib/mockData";

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoreDrawer({ isOpen, onClose }: MoreDrawerProps) {
  const { activeTab, setActiveTab, members, portfolioSummary } = useNexo();

  if (!isOpen) return null;

  const adminMember = members[0];

  const handleNavClick = (tabId: string) => {
    if (["dashboard", "ipos", "applications", "portfolio", "members"].includes(tabId)) {
      setActiveTab(tabId as any);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs animate-fade-in font-sans lg:hidden">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="relative z-10 w-full max-h-[85vh] overflow-y-auto bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl animate-slide-up flex flex-col p-5 space-y-5 pb-safe-nav">
        {/* Handle / Drag Pill */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto shrink-0" />

        {/* Header: User Profile */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={adminMember?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={adminMember?.name || "Ankit"}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {adminMember?.name || "Ankit"}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Group Admin • {adminMember?.panMasked || "ABCDE2741D"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Capital Summary Grid */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
              Available Capital
            </span>
            <span className="text-sm font-mono font-bold text-slate-900">
              {formatINR(portfolioSummary.availableCapital)}
            </span>
          </div>
          <div className="space-y-0.5 text-right">
            <span className="text-[11px] font-bold uppercase text-slate-400 block tracking-wider">
              Capital Deployed
            </span>
            <span className="text-sm font-mono font-bold text-blue-600">
              {formatINR(portfolioSummary.capitalDeployed)}
            </span>
          </div>
        </div>

        {/* Extended Navigation Options */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Community & Management
          </span>

          <button
            onClick={() => handleNavClick("members")}
            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "members"
                ? "bg-blue-50 text-blue-600 border border-blue-200/80"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Users size={18} />
              </div>
              <span>Group Members</span>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {members.length}
            </span>
          </button>

          <button
            onClick={() => handleNavClick("members")}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Lightning size={18} />
              </div>
              <span>Activity Log</span>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200">
              LIVE
            </span>
          </button>

          <button
            onClick={() => handleNavClick("members")}
            className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Gear size={18} />
              </div>
              <span>Settings & Rules</span>
            </div>
          </button>
        </div>

        {/* Footer Security Badge */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>NEXO Encrypted Vault</span>
          </div>
          <span>v2.4.0</span>
        </div>
      </div>
    </div>
  );
}
