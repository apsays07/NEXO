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
      <Card className="p-6 bg-surface border-line shadow-2xs rounded-2xl flex flex-col justify-between h-full space-y-4 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <h3 className="text-xs font-semibold text-ink-secondary uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle size={16} className="text-positive" /> NEEDS ATTENTION
          </h3>
          <span className="text-[11px] text-ink-tertiary font-medium">0 Pending</span>
        </div>

        <div className="py-8 text-center space-y-2">
          <div className="p-4 rounded-xl bg-positive-soft border border-positive/30 space-y-1.5">
            <div className="flex items-center gap-2 text-positive font-bold text-xs">
              <CheckCircle size={18} />
              <span>All Systems Verified</span>
            </div>
            <p className="text-xs text-positive font-medium leading-relaxed">
              All group applications, proof screenshots, and contribution payments are verified.
            </p>
            <div className="pt-2 border-t border-positive/30 flex items-center justify-between text-[11px] text-positive font-medium">
              <span>Automated Audit Stream</span>
              <span className="font-mono">100% Validated</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-surface border-line shadow-2xs rounded-2xl flex flex-col justify-between h-full space-y-4 font-sans">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <WarningCircle size={16} className="text-caution" />
            <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">
              NEEDS ATTENTION ({items.length})
            </h3>
          </div>
          <span className="text-[11px] text-ink-tertiary font-mono font-medium">Actionable</span>
        </div>

        {/* Task List Rows */}
        <div className="space-y-2.5 pt-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-caution-soft border border-caution/30 hover:border-[#FDE68A] transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-caution">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-caution font-normal line-clamp-1 mt-0.5">
                    {item.subtitle}
                  </div>
                </div>

                <button
                  onClick={() => onDismiss(item.id)}
                  title="Dismiss alert"
                  className="text-caution hover:text-caution transition-colors p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-caution/30/60">
                <span className="text-[11px] font-mono text-caution font-semibold">
                  {item.ipoName}
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  className="h-7 px-2.5 text-[11px] bg-caution hover:bg-[#B54708] border-none text-white shadow-2xs"
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
      <div className="pt-3 border-t border-line flex items-center justify-between text-[11px] text-ink-secondary">
        <span>Action required for group tracking</span>
        <span className="font-mono text-caution font-semibold">{items.length} Pending</span>
      </div>
    </Card>
  );
}
