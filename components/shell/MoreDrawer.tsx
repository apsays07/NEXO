"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import {
  X,
  Users,
  Gear,
  SignOut,
  Lightning,
  Question,
  Headphones,
} from "@phosphor-icons/react";

interface MoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoreDrawer({ isOpen, onClose }: MoreDrawerProps) {
  const { setActiveTab, logout } = useNexo();

  if (!isOpen) return null;

  const handleNav = (tab: any) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden font-sans">
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 border-t border-slate-200 shadow-2xl space-y-4 animate-slide-up pb-safe">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">More Options</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => handleNav("members")}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-colors"
          >
            <Users size={20} className="text-blue-600" />
            <span>Group Members</span>
          </button>

          {logout && (
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-2xl transition-colors"
            >
              <SignOut size={20} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
