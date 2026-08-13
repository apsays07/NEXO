"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { ChatCircleText, PaperPlaneRight } from "@phosphor-icons/react";

export function MessagesTab() {
  const { conversations } = useNexo() as any;

  return (
    <div className="space-y-5 font-sans text-ink pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">Group Operations Messages</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Internal communication channels for IPO pools, solo participation, and admin operational notices
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[500px] rounded-2xl bg-surface border border-line overflow-hidden shadow-2xs">
        {/* Conversations List */}
        <div className="md:col-span-4 border-r border-line p-3 space-y-2 overflow-y-auto">
          <span className="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider px-2 block">
            CHANNELS & CHATS
          </span>

          {(conversations as any[])?.map((conv: any) => (
            <div
              key={conv.id}
              className="p-2.5 rounded-xl bg-surface-alt/50 hover:bg-surface-hover border border-line/60 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-ink truncate">{conv.title}</span>
                {conv.unreadCount ? (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-accent text-white">
                    {conv.unreadCount}
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-ink-secondary truncate mt-1">
                {conv.lastMessage || "Click to view conversation"}
              </p>
            </div>
          ))}
        </div>

        {/* Message View Area */}
        <div className="md:col-span-8 p-4 flex flex-col justify-between bg-surface-alt/20">
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-surface border border-line max-w-md">
              <span className="text-[10px] font-bold text-accent block">Niranjan (Admin)</span>
              <p className="text-xs text-ink mt-0.5">&quot;Application proof for Dhoot Transmission submitted successfully.&quot;</p>
              <span className="text-[9px] font-mono text-ink-tertiary block mt-1">10:14 AM</span>
            </div>
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 max-w-md ml-auto">
              <span className="text-[10px] font-bold text-accent block">Ashay</span>
              <p className="text-xs text-ink mt-0.5">&quot;Great, I will review the allotment status when registrar opens.&quot;</p>
              <span className="text-[9px] font-mono text-ink-tertiary block mt-1">10:16 AM</span>
            </div>
          </div>

          <div className="pt-3 border-t border-line flex items-center gap-2">
            <input
              type="text"
              placeholder="Send operational message to group..."
              className="flex-1 h-9 px-3 rounded-lg bg-surface border border-line text-xs text-ink focus:outline-hidden"
            />
            <button className="h-9 px-3 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90 cursor-pointer flex items-center gap-1">
              <PaperPlaneRight size={14} weight="bold" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
