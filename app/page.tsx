"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { DashboardView } from "@/components/views/DashboardView";
import { IPOWorkspaceView } from "@/components/views/IPOWorkspaceView";
import { PortfolioView } from "@/components/views/PortfolioView";
import { MembersView } from "@/components/views/MembersView";
import { ApplicationsView } from "@/components/views/ApplicationsView";
import { IPODetailDrawer } from "@/components/views/IPODetailDrawer";
import { ApplicationModal } from "@/components/application/ApplicationModal";
import { AddIPOModal } from "@/components/ipo/AddIPOModal";

export default function Home() {
  const { activeTab } = useNexo();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#111318] font-sans antialiased">
      {/* LEFT SIDEBAR NAVIGATION & MOBILE BOTTOM BAR */}
      <Sidebar />

      {/* MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar />

        <main className="p-4 sm:p-6 md:p-8 pb-24 lg:pb-8 flex-1 max-w-7xl w-full mx-auto overflow-y-auto">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "ipos" && <IPOWorkspaceView />}
          {activeTab === "applications" && <ApplicationsView />}
          {activeTab === "portfolio" && <PortfolioView />}
          {activeTab === "members" && <MembersView />}
        </main>
      </div>

      {/* DRAWERS & MODALS */}
      <IPODetailDrawer />
      <ApplicationModal />
      <AddIPOModal />
    </div>
  );
}
