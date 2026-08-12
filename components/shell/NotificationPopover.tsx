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
    <div className="relative inline-block font-sans" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Unread Action Items"
        className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100/90 text-slate-505 hover:text-slate-900 border border-slate-200/80 hover:border-slate-300 transition-all duration-150 relative cursor-pointer active:scale-[0.98] shadow-3xs"
      >
        <Bell size={18} className="transition-transform group-hover:rotate-12" />
        {actionItems.length > 0 && (
          <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-76 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-2xl p-4.5 z-40 space-y-3.5 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="font-extrabold text-slate-900 text-[13px]">Needs Attention ({actionItems.length})</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action</span>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-0.5 no-scrollbar">
            {actionItems.length === 0 ? (
              <p className="text-center py-4 text-slate-400 font-medium">All caught up! No actions required.</p>
            ) : (
              actionItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1.5 shadow-3xs"
                >
                  <div className="font-extrabold text-amber-800 flex items-center justify-between gap-2">
                    <span className="truncate">{item.title}</span>
                    <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200 shrink-0">
                      {item.ipoName}
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-700/90 font-medium leading-relaxed">
                    {item.subtitle}
                  </div>
                  <div className="pt-1 flex justify-end">
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
                      className="text-[11px] font-extrabold text-amber-700 hover:text-amber-900 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {item.ctaLabel} <ArrowRight size={12} weight="bold" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
