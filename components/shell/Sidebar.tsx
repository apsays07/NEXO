"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import {
  SquaresFour,
  TrendUp,
  Files,
  ChartPie,
  Users,
  DotsThree,
  Lightning,
  Gear,
} from "@phosphor-icons/react";
import { MoreDrawer } from "./MoreDrawer";

export function Sidebar() {
  const { activeTab, setActiveTab, members, ipos } = useNexo();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const workspaceNav = [
    { id: "dashboard", label: "Home", icon: SquaresFour },
    { id: "ipos", label: "IPO Workspace", icon: TrendUp, badge: ipos.length },
    { id: "applications", label: "Applications", icon: Files },
    { id: "portfolio", label: "Portfolio", icon: ChartPie },
  ];

  const groupNav = [
    { id: "members", label: "Group Members", icon: Users, badge: members.length },
  ];

  const mobileNav = [
    { id: "dashboard", label: "Home", icon: SquaresFour },
    { id: "ipos", label: "IPOs", icon: TrendUp, badge: ipos.length },
    { id: "applications", label: "Apps", icon: Files },
    { id: "portfolio", label: "Portfolio", icon: ChartPie },
    { id: "more", label: "More", icon: DotsThree },
  ];

  const adminMember = members[0];

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible on lg screens >= 1024px) */}
      <aside className="hidden lg:flex w-[230px] bg-[#FCFCFD] border-r border-[#E2E8F0] flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30 font-sans">
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-200/80 bg-white/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 hover:scale-[1.05] transition-transform duration-200 cursor-pointer">
                N
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                  NEXO
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 border border-blue-100 font-extrabold tracking-wider uppercase">
                    OS
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-bold shadow-3xs">
              <svg className="w-3 h-3 text-emerald-600 fill-current shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified</span>
            </div>
          </div>

          {/* Navigation Sections */}
          <nav className="p-3 space-y-4">
            {/* WORKSPACE */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-medium text-[#5F6673] uppercase tracking-wider">
                WORKSPACE
              </div>
              {workspaceNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full h-8.5 flex items-center justify-between px-2.5 rounded-lg text-sm transition-colors group cursor-pointer ${
                      isActive
                        ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                        : "text-[#5F6673] hover:text-[#111318] hover:bg-[#F4F6F8] font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={16}
                        className={
                          isActive ? "text-[#2563EB]" : "text-[#5F6673] group-hover:text-[#111318]"
                        }
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? "bg-[#2563EB]/15 text-[#2563EB]"
                            : "bg-[#F1F5F9] text-[#5F6673]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* GROUP MANAGEMENT */}
            <div className="space-y-1 pt-2 border-t border-[#E2E8F0]">
              <div className="px-2 py-1 text-[11px] font-medium text-[#5F6673] uppercase tracking-wider">
                COMMUNITY
              </div>
              {groupNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full h-8.5 flex items-center justify-between px-2.5 rounded-lg text-sm transition-colors group cursor-pointer ${
                      isActive
                        ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                        : "text-[#5F6673] hover:text-[#111318] hover:bg-[#F4F6F8] font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={16}
                        className={
                          isActive ? "text-[#2563EB]" : "text-[#5F6673] group-hover:text-[#111318]"
                        }
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive
                            ? "bg-[#2563EB]/15 text-[#2563EB]"
                            : "bg-[#F1F5F9] text-[#5F6673]"
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

        {/* User Footer Profile */}
        <div className="p-3 border-t border-[#E2E8F0] bg-white">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <img
              src={adminMember?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={adminMember?.name || "User"}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#111318] truncate">
                {adminMember?.name || "Ankit"}
              </p>
              <p className="text-[10px] text-[#5F6673] truncate">
                Group Admin
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* TABLET COLLAPSED SIDEBAR (Visible on md screens 768px - 1023px) */}
      <aside className="hidden md:flex lg:hidden w-16 bg-[#FCFCFD] border-r border-[#E2E8F0] flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30 font-sans py-3 items-center">
        <div className="space-y-6 flex flex-col items-center">
          {/* Logo */}
          <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm shadow-2xs">
            N
          </div>

          {/* Icons Nav */}
          <div className="space-y-3">
            {workspaceNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  title={item.label}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={20} />
                </button>
              );
            })}
            <button
              onClick={() => setActiveTab("members" as any)}
              title="Members"
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                activeTab === "members" ? "bg-blue-50 text-blue-600 font-bold" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Users size={20} />
            </button>
          </div>
        </div>

        {/* User Profile Avatar */}
        <img
          src={adminMember?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
          alt={adminMember?.name || "User"}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
          title={adminMember?.name || "Ankit"}
        />
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (Visible on screens < 768px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1 px-2 flex items-center justify-around shadow-lg pb-safe font-sans">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          const isMore = item.id === "more";
          const isActive = isMore
            ? isMoreOpen || ["members", "activity", "settings"].includes(activeTab)
            : activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (isMore) {
                  setIsMoreOpen(true);
                } else {
                  setActiveTab(item.id as any);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all cursor-pointer touch-target ${
                isActive ? "text-blue-600 font-bold" : "text-slate-500 font-medium"
              }`}
            >
              <div className="relative">
                <Icon size={22} className={isActive ? "text-blue-600" : "text-slate-500"} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-bold px-1 py-0.2 rounded-full min-w-[14px] text-center leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* More Drawer Sheet */}
      <MoreDrawer isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />
    </>
  );
}
