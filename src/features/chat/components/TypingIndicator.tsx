"use client";

import React from "react";

interface TypingIndicatorProps {
  typingUsers: string[]; // names or usernames of typing members
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (!typingUsers || typingUsers.length === 0) return null;

  let text = `${typingUsers[0]} is typing...`;
  if (typingUsers.length === 2) {
    text = `${typingUsers[0]} and ${typingUsers[1]} are typing...`;
  } else if (typingUsers.length > 2) {
    text = `${typingUsers.length} people are typing...`;
  }

  return (
    <div className="px-4 py-1.5 flex items-center gap-2 text-xs text-ink-tertiary font-medium animate-fade-in select-none">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-pulse delay-75" />
        <span className="w-1.5 h-1.5 rounded-full bg-accent/40 animate-pulse delay-150" />
      </div>
      <span className="text-[11px] font-sans">{text}</span>
    </div>
  );
}
