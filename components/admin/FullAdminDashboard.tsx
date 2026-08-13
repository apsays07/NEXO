"use client";

import React, { useState } from "react";
import { AdminProvider } from "../../admin/context/AdminContext";
import { AdminSidebar } from "../../admin/components/AdminSidebar";
import { AdminIPOManagement } from "../../admin/components/AdminIPOManagement";
import { DistributeProfitView } from "../../admin/components/DistributeProfitView";
import { AddIPODrawer } from "../../admin/components/AddIPODrawer";
import { RegistrarCheckerTab } from "./RegistrarCheckerTab";

function AdminDashboardContent() {
  const [activeTab, setActiveTab] = useState("ipos");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleAddSuccess = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 5000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* ADMIN SIDEBAR */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddIpoClick={() => setIsDrawerOpen(true)}
      />

      {/* MAIN ADMIN WORKSPACE CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              NEXO Admin Console • Active (Port 3000)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">
              Role: <strong className="text-slate-900">Administrator</strong>
            </span>
          </div>
        </header>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="m-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center justify-between">
            <span>{feedbackMsg}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-emerald-500 hover:text-emerald-700">✕</button>
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 sm:p-6 md:p-8 flex-1 max-w-6xl w-full mx-auto">
          {activeTab === "ipos" && <AdminIPOManagement />}
          {activeTab === "distribute-profit" && <DistributeProfitView />}
          {activeTab === "registrar-checker" && <RegistrarCheckerTab />}
          {activeTab !== "ipos" && activeTab !== "distribute-profit" && activeTab !== "registrar-checker" && (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
              <h3 className="text-base font-extrabold text-slate-800">
                {activeTab.toUpperCase()} Section
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Use <strong className="text-blue-600">IPO Management</strong>, <strong className="text-amber-600">Distribute Profit</strong>, or <strong className="text-emerald-600">Registrar Allotments</strong> in the sidebar.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* GLOBAL ADD IPO DRAWER */}
      <AddIPODrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}

export function FullAdminDashboard() {
  return (
    <AdminProvider>
      <AdminDashboardContent />
    </AdminProvider>
  );
}
