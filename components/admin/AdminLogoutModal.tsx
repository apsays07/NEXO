"use client";

import React, { useState } from "react";
import { SignOut, X, WarningCircle } from "@phosphor-icons/react";

interface AdminLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminLogoutModal({ isOpen, onClose }: AdminLogoutModalProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = React.useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      window.location.href = "/admin/login";
    }
  }, []);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in select-none font-sans">
      <div
        className="w-full max-w-md bg-[#11141E] border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/90 text-white relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          disabled={isLoggingOut}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-xl bg-rose-950/70 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-inner mb-4">
          <WarningCircle size={26} weight="bold" />
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 mb-6">
          <h3 className="text-lg font-black text-white tracking-tight">
            Sign Out of Admin Console?
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            Are you sure you want to log out? You will need to re-authenticate with your administrator credentials to access the NEXO Admin Console.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
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
