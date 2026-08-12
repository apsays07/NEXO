"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { Bell, WarningCircle, ArrowRight } from "@phosphor-icons/react";

export function NotificationPopover() {
  const { actionItems, ipos, openApplicationModal, openIpoDetail } = useNexo();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Unread Action Items"
        className="p-2 rounded-lg bg-[#F7F8FA] text-[#667085] hover:text-[#111827] border border-[#E4E7EC] hover:bg-[#F4F6F8] transition-colors relative cursor-pointer"
      >
        <Bell size={16} />
        {actionItems.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#2F6BFF]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-[#E4E7EC] shadow-xl p-4 z-40 space-y-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-2 font-bold text-[#111827]">
            <span>Needs Attention ({actionItems.length})</span>
            <span className="text-[10px] text-[#98A2B3] uppercase">Actionable</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg bg-[#FFFAEB] border border-[#FEF0C7] space-y-1"
              >
                <div className="font-bold text-[#B54708] flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-[10px] text-[#D98A16] font-normal">{item.ipoName}</span>
                </div>
                <div className="text-[11px] text-[#B54708] font-medium leading-tight">
                  {item.subtitle}
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    const targetIpo = ipos.find((i) => i.id === item.ipoId);
                    if (targetIpo) {
                      if (item.type === "PROOF_MISSING") {
                        openApplicationModal(targetIpo);
                      } else {
                        openIpoDetail(targetIpo);
                      }
                    }
                  }}
                  className="text-[11px] font-bold text-[#D98A16] hover:underline flex items-center gap-1 mt-1"
                >
                  {item.ctaLabel} <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
