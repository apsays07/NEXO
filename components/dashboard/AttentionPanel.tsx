"use client";

import React from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { ActionItem, IPOOpportunity } from "@/types/nexo";
import { WarningCircle, CheckCircle, ArrowRight, X } from "@phosphor-icons/react";

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
  if (items.length === 0) {
    return (
      <Card className="p-6 bg-white border-[#E2E8F0] shadow-2xs rounded-2xl flex flex-col justify-between h-full space-y-4 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <h3 className="text-xs font-semibold text-[#5F6673] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle size={16} className="text-[#12B76A]" /> NEEDS ATTENTION
          </h3>
          <span className="text-[11px] text-[#7B8491] font-medium">0 Pending</span>
        </div>

        <div className="py-8 text-center space-y-2">
          <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] space-y-1.5">
            <div className="flex items-center gap-2 text-[#027A48] font-bold text-xs">
              <CheckCircle size={18} />
              <span>All Systems Verified</span>
            </div>
            <p className="text-xs text-[#027A48] font-medium leading-relaxed">
              All group applications, proof screenshots, and contribution payments are verified.
            </p>
            <div className="pt-2 border-t border-[#A6F4C5]/60 flex items-center justify-between text-[11px] text-[#059669] font-medium">
              <span>Automated Audit Stream</span>
              <span className="font-mono">100% Validated</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-[#E2E8F0] shadow-2xs rounded-2xl flex flex-col justify-between h-full space-y-4 font-sans">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <WarningCircle size={16} className="text-[#D97706]" />
            <h3 className="text-xs font-semibold text-[#111318] uppercase tracking-wider">
              NEEDS ATTENTION ({items.length})
            </h3>
          </div>
          <span className="text-[11px] text-[#7B8491] font-mono font-medium">Actionable</span>
        </div>

        {/* Task List Rows */}
        <div className="space-y-2.5 pt-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-[#FFFAEB] border border-[#FEF0C7] hover:border-[#FDE68A] transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-[#B54708]">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#D97706] font-normal line-clamp-1 mt-0.5">
                    {item.subtitle}
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(item.id)}
                  title="Dismiss alert"
                  className="text-[#D97706] hover:text-[#B54708] transition-colors p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#FEF0C7]/60">
                <span className="text-[11px] font-mono text-[#D97706] font-semibold">
                  {item.ipoName}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  className="h-7 px-2.5 text-[11px] bg-[#D97706] hover:bg-[#B54708] border-none text-white shadow-2xs"
                  onClick={() => onActionClick(item)}
                >
                  {item.ctaLabel} <ArrowRight size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#5F6673]">
        <span>Action required for group tracking</span>
        <span className="font-mono text-[#D97706] font-semibold">{items.length} Pending</span>
      </div>
    </Card>
  );
}
