"use client";

import React from "react";
import {
  SquaresFour,
  TrendUp,
  Coins,
  Users,
  ChartLineUp,
  ListChecks,
  Plus,
  SignOut,
} from "@phosphor-icons/react";
import { useAdmin } from "../context/AdminContext";

interface AdminSidebarProps {
  onAddIpoClick: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ onAddIpoClick, activeTab, setActiveTab }: AdminSidebarProps) {
  const { currentUser } = useAdmin();

  const mainNav = [
    { id: "overview", label: "Overview", icon: SquaresFour },
    { id: "ipos", label: "IPO Management", icon: TrendUp },
    { id: "distribute-profit", label: "Distribute Profit", icon: Coins },
    { id: "members", label: "Members", icon: Users },
  ];

  const secondaryNav = [
    { id: "analytics", label: "Analytics", icon: ChartLineUp },
    { id: "audit", label: "Audit Logs", icon: ListChecks },
  ];

  return (
    <aside className="w-[240px] bg-slate-900 text-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none font-sans z-30">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            N
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
              NEXO
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold uppercase tracking-wider">
                ADMIN
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-bold tracking-wider uppercase">
              CONSOLE
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-4">
          {/* MAIN MANAGEMENT */}
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full h-9 flex items-center gap-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                  }`}
                >
                  <Icon size={17} className={isActive ? "text-white" : "text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full h-9 flex items-center gap-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                  }`}
                >
                  <Icon size={17} className={isActive ? "text-white" : "text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-2">
            <button
              onClick={onAddIpoClick}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              <Plus size={16} weight="bold" />
              <span>+ Add IPO</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Admin Profile Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold text-white truncate">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-400 font-medium truncate">
              Administrator
            </p>
          </div>
          <button
            title="Sign Out"
            onClick={() => alert("Admin signed out")}
            className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <SignOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
