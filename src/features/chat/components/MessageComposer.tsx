"use client";

import React, { useState, useRef, useEffect } from "react";
import { PaperPlaneRight, Plus } from "@phosphor-icons/react";

interface MessageComposerProps {
  onSendMessage: (text: string) => void;
  onTypingStatusChange?: (isTyping: boolean) => void;
  disabled?: boolean;
}

export function MessageComposer({
  onSendMessage,
  onTypingStatusChange,
  disabled = false,
}: MessageComposerProps) {
  const [text, setText] = useState("");
  const [showAttachmentTooltip, setShowAttachmentTooltip] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea height between 44px and 140px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 44), 140)}px`;
    }
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (onTypingStatusChange) {
      onTypingStatusChange(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        onTypingStatusChange(false);
      }, 2500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setText("");
    if (onTypingStatusChange) {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      onTypingStatusChange(false);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
    }
  };

  return (
    <div className="p-3 bg-surface border-t border-line shrink-0 pb-safe z-10">
      <div className="flex items-end gap-2 bg-surface-alt/70 border border-line focus-within:border-accent/50 rounded-2xl p-1.5 transition-all">
        {/* Attachment Button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setShowAttachmentTooltip(true);
              setTimeout(() => setShowAttachmentTooltip(false), 2000);
            }}
            className="p-2 rounded-xl text-ink-tertiary hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer"
            title="Add attachment"
          >
            <Plus size={18} />
          </button>

          {showAttachmentTooltip && (
            <div className="absolute left-0 bottom-10 z-30 px-2.5 py-1 rounded-lg bg-black text-white text-[11px] font-sans shadow-lg whitespace-nowrap animate-fade-in">
              Attachments coming soon
            </div>
          )}
        </div>

        {/* Textarea Input */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          disabled={disabled}
          className="flex-1 bg-transparent py-2 px-1 text-xs text-ink placeholder:text-ink-tertiary focus:outline-none resize-none min-h-[44px] max-h-[140px] leading-relaxed font-sans"
          rows={1}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className={`h-9 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
            text.trim() && !disabled
              ? "bg-accent text-white hover:bg-accent-hover active:scale-95 shadow-2xs"
              : "bg-surface-alt text-ink-tertiary cursor-not-allowed opacity-60"
          }`}
        >
          <span>Send</span>
          <PaperPlaneRight size={14} weight="fill" />
        </button>
      </div>
    </div>
  );
}
