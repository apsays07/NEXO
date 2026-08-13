"use client";

import React, { useState, useMemo } from "react";
import { Conversation } from "@/types/nexo";
import { ConversationListItem } from "./ConversationListItem";
import { MagnifyingGlass, Plus, X, ChatCircleDots } from "@phosphor-icons/react";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  currentMemberId: string;
  onSelectConversation: (id: string) => void;
  onOpenNewMessageModal: () => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  currentMemberId,
  onSelectConversation,
  onOpenNewMessageModal,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase().trim();
    return conversations.filter((c) => {
      const titleMatch = c.title?.toLowerCase().includes(q);
      const otherMatch = c.otherMember?.name?.toLowerCase().includes(q) || c.otherMember?.username?.toLowerCase().includes(q);
      const msgMatch = c.lastMessage?.toLowerCase().includes(q);
      return titleMatch || otherMatch || msgMatch;
    });
  }, [conversations, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-surface border-r border-line select-none">
      {/* List Header */}
      <div className="p-3.5 border-b border-line flex items-center justify-between gap-2 shrink-0">
        <div>
          <h2 className="text-sm font-extrabold text-ink tracking-tight flex items-center gap-2">
            Messages
          </h2>
          <p className="text-[11px] text-ink-tertiary font-medium">
            Private conversations
          </p>
        </div>

        <button
          onClick={onOpenNewMessageModal}
          className="h-8 px-2.5 rounded-lg bg-accent text-white hover:bg-accent-hover font-semibold text-xs transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 shrink-0"
        >
          <Plus size={14} weight="bold" />
          <span>New Message</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="p-2.5 border-b border-line/70 shrink-0">
        <div className="relative">
          <MagnifyingGlass
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-8.5 pr-8 py-1.5 bg-surface-alt/70 border border-line rounded-xl text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-accent transition-colors"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink cursor-pointer"
            >
              <X size={13} />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] font-mono text-ink-tertiary bg-surface border border-line rounded">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      {/* Scrollable Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-line/40">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <ChatCircleDots size={32} className="mx-auto text-ink-tertiary opacity-40" />
            <p className="text-xs font-semibold text-ink">No conversations found</p>
            <p className="text-[11px] text-ink-tertiary">
              {searchQuery ? "Try another search term" : "Click 'New Message' to start chatting"}
            </p>
          </div>
        ) : (
          filteredConversations.map((c) => (
            <ConversationListItem
              key={c.id}
              conversation={c}
              isActive={c.id === activeConversationId}
              currentMemberId={currentMemberId}
              onClick={() => onSelectConversation(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
