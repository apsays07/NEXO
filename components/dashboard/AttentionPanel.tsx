"use client";

import React from "react";
import { Card } from "../ui/Card";
import { ActionItem, IPOOpportunity } from "@/types/nexo";
import { WarningCircle, CheckCircle, ArrowRight } from "@phosphor-icons/react";

interface AttentionPanelProps {
  items: ActionItem[];
  ipos: IPOOpportunity[];
  onActionClick: (item: ActionItem) => void;
  onDismiss: (id: string) => void;
}

export function AttentionPanel({
  items,
  ipos,
  onActionClick,
  onDismiss,
}: AttentionPanelProps) {
  return (
    <Card className="p-6 bg-white border-[#E2E8F0] shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <WarningCircle size={18} className="text-[#D97706]" />
            <h3 className="text-sm font-extrabold text-[#0F172A]">
              NEEDS ATTENTION ({items.length})
            </h3>
          </div>
          <span className="text-xs text-[#64748B] font-medium">Task List</span>
        </div>

        {items.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-2">
            <CheckCircle size={28} className="text-[#059669] mx-auto" />
            <div className="text-xs font-bold text-[#0F172A]">
              Everything is up to date.
            </div>
            <div className="text-[11px] text-[#047857] font-medium">
              No action is required right now.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-between gap-3 text-xs transition-colors hover:bg-[#FEF3C7]"
              >
                <div className="space-y-0.5 overflow-hidden">
                  <div className="font-extrabold text-[#92400E] flex items-center gap-1.5 truncate">
                    <span>{item.title}</span>
                    <span className="text-[10px] text-[#D97706] font-normal">
                      • {item.ipoName}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#78350F] font-medium line-clamp-1">
                    {item.subtitle}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onActionClick(item)}
                    className="px-2.5 py-1 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <span>{item.ctaLabel}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
        <span>Action required for accurate syndicate tracking</span>
        <span className="font-mono">{items.length} Pending</span>
      </div>
    </Card>
  );
}
