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

  const workspaceNav = [
    { id: "dashboard", label: "Home", icon: SquaresFour },
    { id: "ipos", label: "IPO Workspace", icon: TrendUp, badge: ipos.length },
    { id: "applications", label: "Applications", icon: Files },
    { id: "portfolio", label: "Portfolio", icon: ChartPie },
  ];

  const groupNav = [
    { id: "members", label: "Group Members", icon: Users, badge: members.length },
  ];

  const adminMember = members[0]; // Niranjan

  return (
    <aside className="w-[230px] bg-[#FCFCFD] border-r border-[#E4E7EC] flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#E4E7EC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#2F6BFF] flex items-center justify-center text-white font-black text-sm shadow-xs">
              N
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-[#111827] flex items-center gap-1">
                NEXO
                <span className="text-[9px] px-1 py-0.2 rounded bg-[#EEF4FF] text-[#2F6BFF] border border-[#D0E1FF] font-semibold">
                  OS
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-[#12B76A] font-bold bg-[#ECFDF3] px-2 py-0.5 rounded-full border border-[#A6F4C5]">
            ● Verified
          </div>
        </div>

        {/* Compact Navigation Sections */}
        <nav className="p-3 space-y-4">
          {/* WORKSPACE */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
              WORKSPACE
            </div>
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full h-8 flex items-center justify-between px-2.5 rounded-md text-xs font-semibold transition-colors group ${
                    isActive
                      ? "bg-[#EEF4FF] text-[#2F6BFF]"
                      : "text-[#667085] hover:text-[#111827] hover:bg-[#F4F6F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={
                        isActive ? "text-[#2F6BFF]" : "text-[#667085] group-hover:text-[#111827]"
                      }
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-[#2F6BFF]/15 text-[#2F6BFF]"
                          : "bg-[#F2F4F7] text-[#667085]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* GROUP */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold text-[#98A2B3] uppercase tracking-wider">
              GROUP
            </div>
            {groupNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full h-8 flex items-center justify-between px-2.5 rounded-md text-xs font-semibold transition-colors group ${
                    isActive
                      ? "bg-[#EEF4FF] text-[#2F6BFF]"
                      : "text-[#667085] hover:text-[#111827] hover:bg-[#F4F6F8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      className={
                        isActive ? "text-[#2F6BFF]" : "text-[#667085] group-hover:text-[#111827]"
                      }
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-[#2F6BFF]/15 text-[#2F6BFF]"
                          : "bg-[#F2F4F7] text-[#667085]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Footer User Profile */}
      <div className="p-3 border-t border-[#E4E7EC] bg-[#F7F8FA]">
        <div className="flex items-center justify-between p-1.5">
          <div className="flex items-center gap-2">
            <img
              src={adminMember.avatar}
              alt={adminMember.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E4E7EC]"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-extrabold text-[#111827] truncate">
                {adminMember.name}
              </div>
              <div className="text-[10px] text-[#98A2B3] truncate font-mono">
                {adminMember.panMasked}
              </div>
            </div>
          </div>

          <button
            title="Workspace Settings"
            className="p-1 rounded-md text-[#667085] hover:text-[#111827] hover:bg-[#F4F6F8] transition-colors"
          >
            <Gear size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
