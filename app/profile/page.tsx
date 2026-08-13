"use client";

import React from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { ProfileView } from "@/components/views/ProfileView";

export default function ProfilePage() {
  return (
    <div className="flex h-screen overflow-hidden bg-page text-ink font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <ProfileView />
        </main>
      </div>
    </div>
  );
}
