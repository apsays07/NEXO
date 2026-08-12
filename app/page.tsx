"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { LoginForm } from "@/components/auth/LoginForm";
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
  const { activeTab, isAuthenticated, isAuthLoaded } = useNexo();

  if (!isAuthLoaded || !isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111318] font-sans antialiased animate-fadeIn">
      {/* LEFT SIDEBAR NAVIGATION */}
      <Sidebar />

      {/* MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
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

