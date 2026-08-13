"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { Conversation } from "@/types/nexo";
import { ChatCircleDots, TrendUp, ArrowRight } from "@phosphor-icons/react";

export function MessagesWidget() {
  const { setActiveTab, currentUser, members } = useNexo();
  const currentMemberId = currentUser?.id || members[0]?.id || "mem_1";
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    fetch(`/api/conversations?memberId=${currentMemberId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.conversations)) {
          setConversations(data.conversations.slice(0, 3));
        }
      })
      .catch((err) => console.error("Failed to fetch dashboard messages:", err));
  }, [currentMemberId]);

  return (
    <div className="bg-surface/80 border border-line rounded-2xl p-4 shadow-xs space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChatCircleDots size={18} className="text-accent" />
          <h3 className="text-xs font-extrabold text-ink tracking-tight uppercase">
            MESSAGES
          </h3>
        </div>
        <button
          onClick={() => setActiveTab("messages")}
          className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View messages</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-4 text-xs text-ink-tertiary">
          No recent messages. Start a private conversation.
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((c) => {
            const isDirect = c.type === "DIRECT";
            const title = isDirect && c.otherMember ? c.otherMember.name : c.title;
            const avatar = isDirect && c.otherMember ? c.otherMember.avatar : c.avatar || "/oggy.png";

            return (
              <div
                key={c.id}
                onClick={() => setActiveTab("messages")}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-alt/60 hover:bg-surface-hover border border-line/70 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {c.type === "IPO" ? (
                    <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center font-bold text-xs shrink-0">
                      <TrendUp size={14} />
                    </div>
                  ) : (
                    <img
                      src={avatar}
                      alt={title}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-ink truncate">{title}</p>
                    <p className="text-[11px] text-ink-tertiary truncate">
                      {c.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>

                {c.unreadCount && c.unreadCount > 0 ? (
                  <span className="min-w-[16px] h-4 px-1 rounded-full bg-accent text-white text-[10px] font-bold font-mono flex items-center justify-center shrink-0">
                    {c.unreadCount}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
