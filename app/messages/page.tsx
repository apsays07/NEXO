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
        <main className="flex-1 max-w-7xl w-full mx-auto h-full overflow-hidden p-2 sm:p-4 pb-20 lg:pb-4 flex flex-col">
          <MessagesView />
        </main>
      </div>
    </div>
  );
}
