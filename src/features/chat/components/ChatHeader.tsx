"use client";

import React from "react";
import { Conversation, Member, UserPresenceStatus } from "@/types/nexo";
import { ArrowLeft, TrendUp, Users, DotsThreeVertical, ShieldCheck } from "@phosphor-icons/react";

interface ChatHeaderProps {
  conversation: Conversation;
  currentMemberId: string;
  presenceStatus?: UserPresenceStatus;
  onBackMobile?: () => void;
  onOpenIpoPage?: (ipoId: string) => void;
}

export function ChatHeader({
  conversation,
  currentMemberId,
  presenceStatus = "ONLINE",
  onBackMobile,
  onOpenIpoPage,
}: ChatHeaderProps) {
  const isDirect = conversation.type === "DIRECT";
  const isIpo = conversation.type === "IPO";

  let title = conversation.title;
  let avatar = conversation.avatar || "/oggy.png";
  let subtitle = `${conversation.participants?.length || 2} members`;

  if (isDirect && conversation.otherMember) {
    title = conversation.otherMember.name;
    avatar = conversation.otherMember.avatar || "/oggy.png";
    subtitle = `@${conversation.otherMember.username || conversation.otherMember.name.toLowerCase()}`;
  } else if (isIpo) {
    subtitle = `IPO Group Chat • ${conversation.participants?.length || 3} participants`;
  }

  return (
    <div className="h-16 px-4 bg-surface border-b border-line flex items-center justify-between shrink-0 select-none z-10">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        {onBackMobile && (
          <button
            onClick={onBackMobile}
            className="md:hidden p-1.5 -ml-1.5 rounded-lg text-ink-tertiary hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer"
            title="Back to Messages"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {/* Avatar */}
        <div className="relative shrink-0">
          {isIpo ? (
            <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent border border-accent/20 flex items-center justify-center font-bold text-sm">
              <TrendUp size={18} />
            </div>
          ) : (
            <img
              src={avatar}
              alt={title}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-line bg-surface-alt"
            />
          )}

          {isDirect && (
            <span
              className={`w-2.5 h-2.5 rounded-full ring-2 ring-surface absolute bottom-0 right-0 ${
                presenceStatus === "ONLINE" ? "bg-emerald-500" : "bg-ink-tertiary"
              }`}
            />
          )}
        </div>

        {/* Title & Presence */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-extrabold text-ink truncate leading-tight">
              {title}
            </h3>
            {isDirect && conversation.otherMember?.role === "ADMIN" && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 font-mono font-bold uppercase tracking-wider">
                Admin
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-ink-tertiary font-medium leading-none mt-0.5">
            {isDirect ? (
              <span className="flex items-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    presenceStatus === "ONLINE" ? "bg-emerald-500" : "bg-ink-tertiary"
                  }`}
                />
                {presenceStatus === "ONLINE" ? "Online" : "Offline"}
              </span>
            ) : (
              <span className="truncate">{subtitle}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {isIpo && conversation.ipoId && onOpenIpoPage && (
          <button
            onClick={() => onOpenIpoPage(conversation.ipoId!)}
            className="px-2.5 py-1 rounded-lg bg-surface-alt hover:bg-surface-hover border border-line text-xs font-semibold text-accent transition-colors flex items-center gap-1 cursor-pointer"
          >
            <TrendUp size={13} /> View IPO Details →
          </button>
        )}
      </div>
    </div>
  );
}
