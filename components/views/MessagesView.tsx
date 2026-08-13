"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNexo } from "@/context/NexoContext";
import { Conversation } from "@/types/nexo";
import { ConversationList } from "@/src/features/chat/components/ConversationList";
import { ChatWindow } from "@/src/features/chat/components/ChatWindow";
import { NewConversationModal } from "@/src/features/chat/components/NewConversationModal";
import { chatRealtime } from "@/src/features/chat/utils/chatRealtime";
import { ChatCircleDots } from "@phosphor-icons/react";

export function MessagesView() {
  const { currentMember, currentUser, members, openIpoDetail, ipos } = useNexo();
  const activeUser = currentUser || currentMember || members[0];
  const currentMemberId = activeUser?.id || "mem_1";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Connect to real-time service
  useEffect(() => {
    chatRealtime.connect(currentMemberId);
    return () => {
      chatRealtime.disconnect();
    };
  }, [currentMemberId]);

  // Fetch conversations list
  const fetchConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/conversations?memberId=${currentMemberId}`);
      const data = await res.json();
      if (data?.success && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !activeConversationId) {
          setActiveConversationId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentMemberId, activeConversationId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Listen to real-time conversation updates & new messages
  useEffect(() => {
    const unsubNewMsg = chatRealtime.on("message:new", () => {
      fetchConversations();
    });

    const unsubConvUpdate = chatRealtime.on("conversation:update", () => {
      fetchConversations();
    });

    return () => {
      unsubNewMsg();
      unsubConvUpdate();
    };
  }, [fetchConversations]);

  // Handle selecting or creating a direct conversation by target member ID
  const handleSelectTargetMember = async (targetMemberId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentMemberId, targetMemberId, type: "DIRECT" }),
      });
      const data = await res.json();
      if (data?.success && data.conversation) {
        await fetchConversations();
        setActiveConversationId(data.conversation.id);
      }
    } catch (err) {
      console.error("Failed to initiate direct conversation:", err);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  const handleOpenIpoPage = (ipoId: string) => {
    const foundIpo = ipos.find((i) => i.id === ipoId);
    if (foundIpo) {
      openIpoDetail(foundIpo);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] flex flex-col md:flex-row overflow-hidden bg-surface border border-line rounded-2xl shadow-xl font-sans relative">
      {/* LEFT: Conversation List (30% Desktop, 35% Tablet, 100% Mobile when no active selection on mobile) */}
      <div
        className={`w-full md:w-[30%] lg:w-[32%] shrink-0 h-full ${
          activeConversationId ? "hidden md:block" : "block"
        }`}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          currentMemberId={currentMemberId}
          onSelectConversation={(id) => setActiveConversationId(id)}
          onOpenNewMessageModal={() => setIsNewMessageModalOpen(true)}
        />
      </div>

      {/* RIGHT: Active Conversation Chat Window (70% Desktop, 65% Tablet, 100% Mobile) */}
      <div
        className={`w-full md:w-[70%] lg:w-[68%] flex-1 h-full ${
          activeConversationId ? "block" : "hidden md:block"
        }`}
      >
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentMemberId={currentMemberId}
            onBackMobile={() => setActiveConversationId(null)}
            onOpenIpoPage={handleOpenIpoPage}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-surface-alt/30 text-ink-tertiary space-y-3 select-none">
            <ChatCircleDots size={48} className="opacity-40" />
            <h3 className="text-sm font-bold text-ink">Messages</h3>
            <p className="text-xs max-w-xs leading-relaxed">
              Select a conversation from the left or start a new private message with a group member.
            </p>
            <button
              onClick={() => setIsNewMessageModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-accent text-white font-bold text-xs shadow-xs hover:bg-accent-hover transition-colors cursor-pointer"
            >
              + New Message
            </button>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      <NewConversationModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        onSelectMember={handleSelectTargetMember}
      />
    </div>
  );
}
