"use client";

import React from "react";
import { X, Keyboard } from "@phosphor-icons/react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl + Shift + D", description: "Toggle Dark / Light mode" },
    { key: "⌘K / Ctrl + K", description: "Open Command Palette / Search" },
    { key: "C", description: "Create new IPO opportunity" },
    { key: "Esc", description: "Close modals, drawers, and popovers" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-md bg-surface border border-line rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-alt border border-line-strong text-ink flex items-center justify-center font-bold">
              <Keyboard size={18} />
            </div>
            <div>
              <h3 className="text-h4 font-semibold text-ink">Keyboard Shortcuts</h3>
              <p className="text-caption text-ink-tertiary font-medium">
                NEXO OS global shortcut reference
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-tertiary hover:text-ink hover:bg-surface-alt transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 text-small">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-surface-alt/60 border border-line-subtle flex items-center justify-between"
            >
              <span className="font-semibold text-ink-secondary">{sc.description}</span>
              <kbd className="px-2.5 py-1 text-caption font-sans font-semibold rounded-lg bg-surface text-ink border border-line shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white text-small font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
