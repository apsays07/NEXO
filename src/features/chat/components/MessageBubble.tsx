"use client";

import React, { useState } from "react";
import { Message } from "@/types/nexo";
import { Check, Checks, Pencil, Trash, DotsThree } from "@phosphor-icons/react";

interface MessageBubbleProps {
  message: Message;
  isSelf: boolean;
  showSenderHeader: boolean;
  onEditMessage?: (messageId: string, text: string) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export function MessageBubble({
  message,
  isSelf,
  showSenderHeader,
  onEditMessage,
  onDeleteMessage,
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim() && onEditMessage) {
      onEditMessage(message.id, editText.trim());
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`group relative flex gap-2.5 max-w-[80%] md:max-w-[72%] ${
        isSelf ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
      } ${showSenderHeader ? "mt-3" : "mt-1"}`}
    >
      {/* Avatar (only shown when sender header is enabled and not self) */}
      {!isSelf && (
        <div className="w-7 h-7 rounded-full shrink-0 overflow-hidden bg-surface-alt self-end mb-0.5">
          {showSenderHeader ? (
            <img
              src={message.senderAvatar || "/oggy.png"}
              alt={message.senderName || "Member"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-7 h-7" />
          )}
        </div>
      )}

      <div className="flex flex-col min-w-0">
        {/* Sender Name (for group chats when header enabled) */}
        {!isSelf && showSenderHeader && (
          <div className="flex items-center gap-1.5 mb-1 px-1">
            <span className="text-[11px] font-bold text-ink-secondary">
              {message.senderName}
            </span>
            {message.senderUsername && (
              <span className="text-[10px] font-mono text-ink-tertiary">
                @{message.senderUsername}
              </span>
            )}
          </div>
        )}

        {/* Bubble Container */}
        <div
          className={`relative px-3.5 py-2.5 rounded-[12px] text-xs font-sans leading-relaxed shadow-3xs break-words ${
            isSelf
              ? "bg-accent/15 dark:bg-[#17233D] text-ink border border-accent/25 rounded-br-2xs"
              : "bg-surface-alt dark:bg-[#14161A] text-ink border border-line/80 rounded-bl-2xs"
          }`}
        >
          {message.isDeleted ? (
            <span className="italic text-ink-tertiary">Message deleted</span>
          ) : isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-2 min-w-[200px]">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 text-xs bg-surface border border-line rounded-lg text-ink focus:outline-none focus:border-accent"
                rows={2}
                autoFocus
              />
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-0.5 text-[11px] font-semibold text-ink-tertiary hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-0.5 text-[11px] font-bold text-white bg-accent rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <>
              <span>{message.text}</span>
              {message.isEdited && (
                <span className="text-[10px] text-ink-tertiary ml-1.5 italic font-sans">
                  (edited)
                </span>
              )}
            </>
          )}

          {/* Time & Read Receipts Footer */}
          <div
            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
              isSelf ? "text-accent/80" : "text-ink-tertiary"
            }`}
          >
            <span className="font-mono">{formattedTime}</span>
            {isSelf && !message.isDeleted && (
              <span>
                {message.status === "READ" ? (
                  <Checks size={13} className="text-accent" />
                ) : (
                  <Check size={12} className="text-ink-tertiary" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Action Menu trigger for author */}
      {isSelf && !message.isDeleted && !isEditing && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center relative shrink-0">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-lg hover:bg-surface-alt text-ink-tertiary hover:text-ink cursor-pointer"
          >
            <DotsThree size={16} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-6 z-20 bg-surface border border-line rounded-xl shadow-xl py-1 w-28 text-xs font-medium">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-ink cursor-pointer"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={() => {
                  if (onDeleteMessage) onDeleteMessage(message.id);
                  setIsMenuOpen(false);
                }}
                className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-danger cursor-pointer"
              >
                <Trash size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
