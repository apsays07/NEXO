"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Conversation, Message, UserPresenceStatus } from "@/types/nexo";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import { chatRealtime } from "../utils/chatRealtime";

interface ChatWindowProps {
  conversation: Conversation;
  currentMemberId: string;
  onBackMobile?: () => void;
  onOpenIpoPage?: (ipoId: string) => void;
}

export function ChatWindow({
  conversation,
  currentMemberId,
  onBackMobile,
  onOpenIpoPage,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [presenceStatus, setPresenceStatus] = useState<UserPresenceStatus>("ONLINE");

  // Fetch messages for conversation
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/conversations/${conversation.id}/messages?memberId=${currentMemberId}`
      );
      const data = await res.json();
      if (data?.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [conversation.id, currentMemberId]);

  // Mark conversation as read
  const markAsRead = useCallback(async () => {
    try {
      await fetch(`/api/conversations/${conversation.id}/read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: currentMemberId }),
      });
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }, [conversation.id, currentMemberId]);

  useEffect(() => {
    fetchMessages();
    markAsRead();
  }, [fetchMessages, markAsRead]);

  // Listen to real-time events (new message, typing, presence)
  useEffect(() => {
    const unsubNewMsg = chatRealtime.on("message:new", (msg: Message) => {
      if (msg.conversationId === conversation.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        markAsRead();
      }
    });

    const unsubTyping = chatRealtime.on(
      "message:typing",
      ({ conversationId: cId, memberId: mId, isTyping }: any) => {
        if (cId === conversation.id && mId !== currentMemberId) {
          const otherName = conversation.otherMember?.name || "Someone";
          if (isTyping) {
            setTypingUsers((prev) => Array.from(new Set([...prev, otherName])));
          } else {
            setTypingUsers((prev) => prev.filter((name) => name !== otherName));
          }
        }
      }
    );

    const unsubPresence = chatRealtime.on("presence:update", ({ memberId, status }: any) => {
      if (conversation.otherMember && memberId === conversation.otherMember.id) {
        setPresenceStatus(status);
      }
    });

    return () => {
      unsubNewMsg();
      unsubTyping();
      unsubPresence();
    };
  }, [conversation.id, conversation.otherMember, currentMemberId, markAsRead]);

  const handleSendMessage = async (text: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentMemberId, text }),
      });
      const data = await res.json();
      if (data?.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        chatRealtime.notifyNewMessage(data.message);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleTypingStatusChange = (isTyping: boolean) => {
    fetch(`/api/conversations/${conversation.id}/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: currentMemberId, isTyping }),
    }).catch(() => {});
  };

  const handleEditMessage = async (messageId: string, text: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, senderId: currentMemberId, action: "edit", text }),
      });
      const data = await res.json();
      if (data?.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, text, isEdited: true } : m))
        );
      }
    } catch (err) {
      console.error("Failed to edit message:", err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, senderId: currentMemberId, action: "delete" }),
      });
      const data = await res.json();
      if (data?.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isDeleted: true } : m))
        );
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <ChatHeader
        conversation={conversation}
        currentMemberId={currentMemberId}
        presenceStatus={presenceStatus}
        onBackMobile={onBackMobile}
        onOpenIpoPage={onOpenIpoPage}
      />

      <MessageList
        messages={messages}
        currentMemberId={currentMemberId}
        typingUsers={typingUsers}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
      />

      <MessageComposer
        onSendMessage={handleSendMessage}
        onTypingStatusChange={handleTypingStatusChange}
      />
    </div>
  );
}
