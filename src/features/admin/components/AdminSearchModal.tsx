"use client";

import React, { useState, useEffect, useRef } from "react";
import { useNexo } from "@/context/NexoContext";
import { AdminTab, SearchResultItem } from "../types/admin";
import {
  MagnifyingGlass,
  Buildings,
  Users,
  Files,
  Receipt,
  ChatCircleText,
  CaretRight,
  X,
  Command,
} from "@phosphor-icons/react";

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (tab: AdminTab, id?: string) => void;
}

export function AdminSearchModal({
  isOpen,
  onClose,
  onSelectResult,
}: AdminSearchModalProps) {
  const nexoContext = useNexo() as any;
  const { ipos, members, transactions, conversations } = nexoContext;
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          const btn = document.getElementById("admin-global-search-trigger");
          btn?.click();
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search Results Generation
  const results: SearchResultItem[] = [];

  // 1. IPOs
  (ipos || []).forEach((ipo: any) => {
    if (
      !cleanQuery ||
      ipo.name.toLowerCase().includes(cleanQuery) ||
      ipo.company.toLowerCase().includes(cleanQuery) ||
      ipo.status.toLowerCase().includes(cleanQuery)
    ) {
      results.push({
        id: `ipo_${ipo.id}`,
        title: ipo.name,
        subtitle: `${ipo.company} • ${ipo.status} • ${ipo.metrics?.issueSize || "₹1,000 Cr"}`,
        category: "IPO",
        targetTab: "ipos",
        detailId: ipo.id,
      });
    }
  });

  // 2. Members
  (members || []).forEach((mem: any) => {
    if (
      !cleanQuery ||
      mem.name.toLowerCase().includes(cleanQuery) ||
      mem.email.toLowerCase().includes(cleanQuery) ||
      mem.role.toLowerCase().includes(cleanQuery)
    ) {
      results.push({
        id: `mem_${mem.id}`,
        title: mem.name,
        subtitle: `${mem.role} • ${mem.email}`,
        category: "Member",
        targetTab: "members",
        detailId: mem.id,
      });
    }
  });

  // 3. Applications
  (ipos || []).forEach((ipo: any) => {
    ipo.applications?.forEach((app: any) => {
      if (
        !cleanQuery ||
        ipo.name.toLowerCase().includes(cleanQuery) ||
        (app.applicantName && app.applicantName.toLowerCase().includes(cleanQuery)) ||
        (app.applicationNumber && app.applicationNumber.toLowerCase().includes(cleanQuery))
      ) {
        results.push({
          id: `app_${app.id}`,
          title: `${app.applicantName || "Combo Group"} — ${ipo.name}`,
          subtitle: `App #${app.applicationNumber || app.id} • ${app.type} • ₹${(app.totalContribution || 0).toLocaleString("en-IN")}`,
          category: "Application",
          targetTab: "applications",
          detailId: app.id,
        });
      }
    });
  });

  // 4. Transactions
  (transactions || []).forEach((tx: any) => {
    if (
      !cleanQuery ||
      tx.ipoName.toLowerCase().includes(cleanQuery) ||
      tx.applicationNumber.toLowerCase().includes(cleanQuery) ||
      tx.status.toLowerCase().includes(cleanQuery)
    ) {
      results.push({
        id: `tx_${tx.id}`,
        title: `${tx.ipoName} (${tx.type})`,
        subtitle: `App #${tx.applicationNumber} • ₹${(tx.amount || 0).toLocaleString("en-IN")} • ${tx.status}`,
        category: "Transaction",
        targetTab: "transactions",
        detailId: tx.id,
      });
    }
  });

  // 5. Conversations / Messages
  (conversations || []).forEach((conv: any) => {
    if (
      !cleanQuery ||
      conv.title.toLowerCase().includes(cleanQuery) ||
      (conv.lastMessage && conv.lastMessage.toLowerCase().includes(cleanQuery))
    ) {
      results.push({
        id: `conv_${conv.id}`,
        title: conv.title,
        subtitle: conv.lastMessage || "No messages yet",
        category: "Message",
        targetTab: "messages",
        detailId: conv.id,
      });
    }
  });

  const getCategoryIcon = (category: SearchResultItem["category"]) => {
    switch (category) {
      case "IPO":
        return Buildings;
      case "Member":
        return Users;
      case "Application":
        return Files;
      case "Transaction":
        return Receipt;
      case "Message":
        return ChatCircleText;
      default:
        return Buildings;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs font-sans">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-surface border border-line shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-line flex items-center gap-3 bg-surface">
          <MagnifyingGlass size={20} className="text-ink-tertiary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search IPOs, members, applications, transactions..."
            className="w-full bg-transparent text-sm font-semibold text-ink placeholder:text-ink-tertiary focus:outline-hidden"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-ink-tertiary hover:text-ink transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-ink-tertiary px-2 py-0.5 rounded bg-surface-alt border border-line">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-line/30">
          {results.length > 0 ? (
            results.slice(0, 15).map((item) => {
              const Icon = getCategoryIcon(item.category);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectResult(item.targetTab, item.detailId);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-hover transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-surface-alt border border-line text-ink-secondary group-hover:text-accent group-hover:border-accent/30 flex items-center justify-center shrink-0 transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-ink truncate group-hover:text-accent transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-ink-tertiary truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-surface-alt text-ink-secondary border border-line">
                      {item.category}
                    </span>
                    <CaretRight size={14} className="text-ink-tertiary group-hover:text-ink transition-colors" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-ink-tertiary">
              No results found matching &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-surface-alt/50 border-t border-line text-[11px] font-medium text-ink-tertiary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-[10px]">↑↓</kbd>
            <span>Select:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-[10px]">↵</kbd>
          </div>
          <span className="font-mono text-[10px] text-accent">NEXO COMMAND SEARCH</span>
        </div>
      </div>
    </div>
  );
}
