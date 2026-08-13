"use client";

import React, { useState, useEffect } from "react";
import { MemberSearchUser } from "@/types/nexo";
import { MagnifyingGlass, X, UserPlus, CheckCircle, ShieldCheck, Crown } from "@phosphor-icons/react";

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMember: (memberId: string) => void;
}

export function NewConversationModal({
  isOpen,
  onClose,
  onSelectMember,
}: NewConversationModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MemberSearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    const fetchMembers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/members/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data?.success && Array.isArray(data.members)) {
          setResults(data.members);
        }
      } catch (err) {
        console.error("Failed to search members:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchMembers, 150);
    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-line rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up select-none">
        {/* Header */}
        <div className="p-4 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-accent" />
            <h3 className="text-sm font-extrabold text-ink">New Private Message</h3>
          </div>
          <button
            onClick={onClose}
            className="text-ink-tertiary hover:text-ink p-1 rounded-lg hover:bg-surface-alt transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-line bg-surface-alt/40">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search member by @username or display name..."
              autoFocus
              className="w-full pl-9 pr-4 py-2 bg-surface-alt border border-line rounded-xl text-xs text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-line/30 min-h-[220px]">
          {isLoading ? (
            <div className="text-center py-10 text-xs text-ink-tertiary">
              Searching members...
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-xs text-ink-tertiary space-y-1">
              <p className="font-semibold text-ink">No members found</p>
              <p className="text-[11px]">Search by @username (e.g. @niranjan, @ranveer)</p>
            </div>
          ) : (
            results.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onSelectMember(m.id);
                  onClose();
                }}
                className="w-full p-2.5 flex items-center justify-between hover:bg-surface-hover rounded-xl transition-colors cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.avatar || "/oggy.png"}
                    alt={m.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-line bg-surface-alt"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-extrabold text-ink group-hover:text-accent transition-colors">
                        {m.name}
                      </p>
                      {m.role === "ADMIN" && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 text-[9px] font-mono font-bold uppercase">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-accent">
                      @{m.username || m.name.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-accent group-hover:translate-x-0.5 transition-transform">
                  <span>Message</span>
                  <span>→</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
