"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { MagnifyingGlass, TrendUp, X, Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { ipos, members, setActiveTab, openIpoDetail } = useNexo();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredIpos = ipos.filter(
    (i) =>
      i.name.toLowerCase().includes(query.toLowerCase()) ||
      i.company.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center pt-0 sm:pt-20 bg-overlay backdrop-blur-xs p-0 sm:p-4 animate-fade-in font-sans">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Container Card */}
      <div className="relative z-10 w-full sm:max-w-[560px] max-h-[85vh] sm:max-h-[500px] bg-surface border-t sm:border border-line rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search input header */}
        <div className="p-3.5 sm:p-4 border-b border-line flex items-center gap-3 bg-surface-alt/50">
          <MagnifyingGlass size={20} className="text-ink-secondary shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search IPOs, members, PAN, applications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[15px] leading-6 font-normal tracking-tight text-ink placeholder:text-ink-muted focus:outline-none"
          />
          <button
            onClick={onClose}
            className="sm:hidden p-1.5 text-ink-muted hover:text-ink"
          >
            <X size={20} />
          </button>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-caption font-medium rounded bg-surface text-ink-secondary border border-line">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-[380px] overflow-y-auto space-y-3">
          {/* Quick Nav Section */}
          {!query && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-caption text-ink-tertiary uppercase tracking-wider">
                Quick Navigation
              </div>
              <button
                onClick={() => {
                  toggleTheme();
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-hover text-ink font-semibold text-body transition-colors cursor-pointer touch-target"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Sun size={16} weight="bold" /> : <Moon size={16} weight="bold" />}
                  <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                </div>
                <kbd className="hidden sm:inline-block text-caption font-medium text-ink-secondary">Ctrl+Shift+D</kbd>
              </button>
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-hover text-ink font-semibold text-body transition-colors cursor-pointer touch-target"
              >
                <span>Go to Dashboard</span>
                <kbd className="hidden sm:inline-block text-caption font-medium text-ink-secondary">⌘1</kbd>
              </button>
              <button
                onClick={() => {
                  setActiveTab("ipos");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-hover text-ink font-semibold text-body transition-colors cursor-pointer touch-target"
              >
                <span>Open IPO Workspace</span>
                <kbd className="hidden sm:inline-block text-caption font-medium text-ink-secondary">⌘2</kbd>
              </button>
              <button
                onClick={() => {
                  setActiveTab("portfolio");
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-hover text-ink font-semibold text-body transition-colors cursor-pointer touch-target"
              >
                <span>Open Portfolio</span>
                <kbd className="hidden sm:inline-block text-caption font-medium text-ink-secondary">⌘3</kbd>
              </button>
            </div>
          )}

          {/* IPO Matches */}
          {filteredIpos.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-caption text-ink-tertiary uppercase tracking-wider">
                IPOs ({filteredIpos.length})
              </div>
              {filteredIpos.map((ipo) => (
                <button
                  key={ipo.id}
                  onClick={() => {
                    openIpoDetail(ipo);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer text-left touch-target"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-accent-soft text-accent font-semibold text-xs flex items-center justify-center shrink-0">
                      {ipo.logo}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-ink text-body truncate">
                        {ipo.name}
                      </div>
                      <div className="text-small text-ink-tertiary truncate">
                        {ipo.company}
                      </div>
                    </div>
                  </div>
                  <span className="text-caption num-tabular font-semibold text-accent shrink-0">
                    {ipo.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Member Matches */}
          {filteredMembers.length > 0 && (
            <div className="space-y-1 pt-1">
              <div className="px-3 py-1 text-caption text-ink-tertiary uppercase tracking-wider">
                Members ({filteredMembers.length})
              </div>
              {filteredMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    setActiveTab("members");
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer text-left touch-target"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <div className="font-semibold text-ink text-body">
                        {member.name}
                      </div>
                      <div className="text-small text-ink-tertiary font-mono">
                        {member.panMasked}
                      </div>
                    </div>
                  </div>
                  <span className="text-caption font-medium text-ink-tertiary bg-surface-alt px-2 py-0.5 rounded-full">
                    {member.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
