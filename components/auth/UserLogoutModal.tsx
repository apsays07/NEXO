"use client";

import React, { useState } from "react";
import { SignOut, X, WarningCircle } from "@phosphor-icons/react";
import { useNexo } from "@/context/NexoContext";

interface UserLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserLogoutModal({ isOpen, onClose }: UserLogoutModalProps) {
  const { logout } = useNexo();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = React.useCallback(async () => {
    setIsLoggingOut(true);
    try {
      if (logout) {
        logout();
      } else {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
      }
    } catch {
      window.location.href = "/login";
    }
  }, [logout]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleConfirmLogout();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleConfirmLogout]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in select-none font-sans">
      <div
        className="w-full max-w-md bg-surface border border-line rounded-2xl p-6 shadow-2xl text-ink relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoggingOut}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-ink-tertiary hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shadow-inner mb-4">
          <WarningCircle size={26} weight="bold" />
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 mb-6">
          <h3 className="text-lg font-black text-ink tracking-tight">
            Sign Out of NEXO?
          </h3>
          <p className="text-xs text-ink-secondary leading-relaxed font-medium">
            Are you sure you want to sign out of your account? You will need to enter your username and password to log back into your NEXO private workspace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="px-4 py-2.5 rounded-xl bg-surface-alt hover:bg-surface-hover border border-line text-ink-secondary font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <SignOut size={16} weight="bold" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
