"use client";

import React, { useState } from "react";
import { AdminTab } from "../types/admin";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminSearchModal } from "./AdminSearchModal";
import { X } from "@phosphor-icons/react";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onOpenAddIpo: () => void;
}

export function AdminLayout({
  children,
  activeTab,
  onSelectTab,
  onOpenAddIpo,
}: AdminLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page text-ink font-sans antialiased flex overflow-hidden h-screen select-none">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex h-full shrink-0">
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => onSelectTab(tab)}
          onOpenAddIpo={onOpenAddIpo}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-surface shadow-2xl">
            <AdminSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                onSelectTab(tab);
                setIsMobileSidebarOpen(false);
              }}
              onOpenAddIpo={() => {
                onOpenAddIpo();
                setIsMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              onToggleCollapse={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-page">
        {/* TOP HEADER */}
        <AdminHeader
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        {/* MAIN SCROLLABLE CONTENT (MAX WIDTH 1280PX) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1280px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* SEARCH COMMAND PALETTE */}
      <AdminSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(tab) => {
          onSelectTab(tab);
        }}
      />
    </div>
  );
}
