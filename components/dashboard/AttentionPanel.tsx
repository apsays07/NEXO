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
      <Card className="p-6 bg-white border-[#E4E7EC] shadow-none rounded-xl flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
          <h3 className="text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle size={16} className="text-[#12B76A]" /> NEEDS ATTENTION
          </h3>
          <span className="text-[10px] text-[#98A2B3] font-bold">0 Pending</span>
        </div>

        <div className="py-8 text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#ECFDF3] border border-[#A6F4C5] text-[#12B76A] flex items-center justify-center mx-auto">
            <CheckCircle size={20} />
          </div>
          <div className="text-sm font-bold text-[#111827]">Everything is up to date</div>
          <p className="text-xs text-[#667085] font-medium max-w-xs mx-auto">
            All syndicate applications, proof screenshots, and contribution payments are verified.
          </p>
        </div>

        <div className="pt-3 border-t border-[#E4E7EC] text-[11px] text-[#98A2B3]">
          Automated Syndicate Audit Stream
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-[#E4E7EC] shadow-none rounded-xl flex flex-col justify-between h-full space-y-4">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
          <div className="flex items-center gap-2">
            <WarningCircle size={16} className="text-[#D98A16]" />
            <h3 className="text-xs font-extrabold text-[#111827] uppercase tracking-wider">
              NEEDS ATTENTION ({items.length})
            </h3>
          </div>
          <span className="text-[10px] text-[#98A2B3] font-mono font-bold">Actionable</span>
        </div>

        {/* Task List Rows */}
        <div className="space-y-2.5 pt-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-[#FFFAEB] border border-[#FEF0C7] hover:border-[#FDE68A] transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-extrabold text-[#B54708]">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-[#D98A16] font-medium line-clamp-1 mt-0.5">
                    {item.subtitle}
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(item.id)}
                  title="Dismiss alert"
                  className="text-[#D98A16] hover:text-[#B54708] transition-colors p-0.5"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#FEF0C7]/60">
                <span className="text-[10px] font-mono text-[#D98A16] font-bold">
                  {item.ipoName}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  className="h-7 px-2.5 text-[11px] bg-[#D98A16] hover:bg-[#B54708] border-none text-white shadow-2xs"
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
      <div className="pt-3 border-t border-[#E4E7EC] flex items-center justify-between text-[11px] text-[#667085]">
        <span>Action required for syndicate tracking</span>
        <span className="font-mono text-[#D98A16] font-bold">{items.length} Pending</span>
      </div>
    </Card>
  );
}
