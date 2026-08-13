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

const STATIC_FALLBACK_MESSAGES: Record<string, Message[]> = {
  conv_ipo_ipo_abc: [
    {
      id: "msg_1",
      conversationId: "conv_ipo_ipo_abc",
      senderId: "mem_1",
      senderName: "Ankit",
      senderUsername: "ankit",
      senderAvatar: "/oggy.png",
      text: "I think we should apply for 2 lots.",
      type: "TEXT",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: "READ",
    },
    {
      id: "msg_2",
      conversationId: "conv_ipo_ipo_abc",
      senderId: "mem_2",
      senderName: "Ashay",
      senderUsername: "ashay",
      senderAvatar: "/jack.png",
      text: "Agreed. I'll contribute ₹40,000.",
      type: "TEXT",
      createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      status: "READ",
    },
    {
      id: "msg_3",
      conversationId: "conv_ipo_ipo_abc",
      senderId: "mem_3",
      senderName: "Ranveer",
      senderUsername: "ranveer",
      senderAvatar: "/sinchan.png",
      text: "Application submitted ✓",
      type: "TEXT",
      createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      status: "READ",
    },
  ],
  conv_dir_mem_1_mem_2: [
    {
      id: "msg_dir_1",
      conversationId: "conv_dir_mem_1_mem_2",
      senderId: "mem_2",
      senderName: "Ashay",
      senderUsername: "ashay",
      senderAvatar: "/jack.png",
      text: "Let's discuss the lot size.",
      type: "TEXT",
      createdAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
      status: "READ",
    },
  ],
  conv_dir_mem_1_mem_3: [
    {
      id: "msg_dir_2",
      conversationId: "conv_dir_mem_1_mem_3",
      senderId: "mem_3",
      senderName: "Ranveer",
      senderUsername: "ranveer",
      senderAvatar: "/sinchan.png",
      text: "Allotment results are out.",
      type: "TEXT",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: "READ",
    },
  ],
};

export function ChatWindow({
  conversation,
  currentMemberId,
  onBackMobile,
  onOpenIpoPage,
}: ChatWindowProps) {
  const initialMsgs = STATIC_FALLBACK_MESSAGES[conversation.id] || [];
  const [messages, setMessages] = useState<Message[]>(initialMsgs);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [presenceStatus, setPresenceStatus] = useState<UserPresenceStatus>("ONLINE");

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/conversations/${conversation.id}/messages?memberId=${currentMemberId}`
      );
      const data = await res.json();
      if (data?.success && Array.isArray(data.messages) && data.messages.length > 0) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
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
    setMessages(STATIC_FALLBACK_MESSAGES[conversation.id] || []);
    fetchMessages();
    markAsRead();
  }, [conversation.id, fetchMessages, markAsRead]);

  // Real-time event listeners
  useEffect(() => {
    const unsubNewMsg = chatRealtime.on("message:new", (msg: Message) => {
      if (msg.conversationId === conversation.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          const tempIndex = prev.findIndex(
            (m) => m.id.startsWith("msg_temp_") && m.senderId === msg.senderId && m.text === msg.text
          );
          if (tempIndex !== -1) {
            const copy = [...prev];
            copy[tempIndex] = msg;
            return copy;
          }
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
    const tempId = `msg_temp_${Date.now()}`;
    const tempMsg: Message = {
      id: tempId,
      conversationId: conversation.id,
      senderId: currentMemberId,
      senderName: "Me",
      text,
      type: "TEXT",
      createdAt: new Date().toISOString(),
      status: "SENT",
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentMemberId, text }),
      });
      const data = await res.json();
      if (data?.success && data.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) {
            return prev.filter((m) => m.id !== tempId);
          }
          return prev.map((m) => (m.id === tempId ? data.message : m));
        });
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
    <div className="flex flex-col h-full bg-[#0C0E12] select-none font-sans overflow-hidden">
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
