"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import {
  SquaresFour,
  TrendUp,
  Files,
  ChartPie,
  Users,
  Gear,
  ShieldCheck,
} from "@phosphor-icons/react";

export function Sidebar() {
  const { activeTab, setActiveTab, members, ipos } = useNexo();

  const navItems = [
    { id: "dashboard", label: "Home", icon: SquaresFour },
    { id: "ipos", label: "IPO Workspace", icon: TrendUp, badge: ipos.length },
    { id: "applications", label: "Applications", icon: Files },
    { id: "portfolio", label: "Portfolio", icon: ChartPie },
    { id: "members", label: "Group Members", icon: Users, badge: members.length },
  ];

  const adminMember = members[0]; // Niranjan

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30 shadow-sm">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white font-black text-lg tracking-wider shadow-md shadow-[#2563EB]/20">
              N
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-[#0F172A] flex items-center gap-1.5">
                NEXO
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-semibold tracking-normal">
                  OS
                </span>
              </h1>
              <p className="text-[11px] text-[#64748B] font-medium">
                Private Wealth Syndicate
              </p>
            </div>
          </div>
        </div>

        {/* Private Syndicate Badge */}
        <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#059669]" />
            <div>
              <div className="text-xs font-bold text-[#0F172A]">Trusted Syndicate</div>
              <div className="text-[10px] text-[#64748B]">5 Verified Members</div>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-[#059669] animate-ping" />
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-1 mt-2">
          <div className="px-3 py-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
            Workspace Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] font-semibold shadow-sm"
                    : "text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-[#2563EB]"
                        : "text-[#64748B] group-hover:text-[#0F172A]"
                    }
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                      isActive
                        ? "bg-[#2563EB]/15 text-[#2563EB]"
                        : "bg-[#F1F5F9] text-[#64748B]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer User Profile */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <img
              src={adminMember.avatar}
              alt={adminMember.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#2563EB]/30"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5 truncate">
                {adminMember.name}
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-mono font-bold">
                  ADMIN
                </span>
              </div>
              <div className="text-[10px] text-[#64748B] truncate font-mono">
                {adminMember.panMasked}
              </div>
            </div>
          </div>

          <button
            title="Workspace Settings"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <Gear size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
