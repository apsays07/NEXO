"use client";

import React from "react";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { MessagesView } from "@/components/views/MessagesView";

export default function MessagesPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-page text-ink font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar />
        <main className="p-4 sm:p-6 md:p-8 pb-24 lg:pb-8 flex-1 max-w-7xl w-full mx-auto overflow-y-auto">
          <MessagesView />
        </main>
      </div>
    </div>
  );
}
