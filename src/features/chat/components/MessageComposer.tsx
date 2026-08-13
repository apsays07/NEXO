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

  // Auto-resize textarea height between 40px and 140px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 40), 140)}px`;
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
      textareaRef.current.style.height = "40px";
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-surface/90 backdrop-blur-md border-t border-line/70 shrink-0 pb-safe z-10 font-sans">
      <div className="flex items-end gap-2 bg-surface-alt/80 border border-line focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/15 rounded-2xl p-2 transition-all shadow-2xs">
        {/* Attachment Plus Button */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setShowAttachmentTooltip(true);
              setTimeout(() => setShowAttachmentTooltip(false), 2000);
            }}
            className="w-8 h-8 rounded-xl text-ink-tertiary hover:text-ink hover:bg-surface-hover flex items-center justify-center transition-colors cursor-pointer"
            title="Add attachment"
          >
            <Plus size={18} />
          </button>

          {showAttachmentTooltip && (
            <div className="absolute left-0 bottom-11 z-30 px-3 py-1 rounded-xl bg-black text-white text-[11px] font-sans shadow-xl whitespace-nowrap animate-fade-in">
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
          className="flex-1 bg-transparent py-2 px-1 text-xs text-ink placeholder:text-ink-tertiary focus:outline-none resize-none min-h-[40px] max-h-[140px] leading-relaxed font-sans"
          rows={1}
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className={`h-8 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
            text.trim() && !disabled
              ? "bg-accent text-white hover:bg-accent-hover active:scale-95 shadow-sm"
              : "bg-surface-alt text-ink-tertiary cursor-not-allowed opacity-50"
          }`}
        >
          <span>Send</span>
          <PaperPlaneRight size={13} weight="fill" />
        </button>
      </div>
    </div>
  );
}
