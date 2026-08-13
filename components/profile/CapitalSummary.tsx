"use client";

import React from "react";
import { formatINR } from "@/lib/mockData";
import { Coins } from "@phosphor-icons/react";

interface CapitalSummaryProps {
  totalContributed?: number;
  currentlyBlocked?: number;
  currentlyInvested?: number;
  available?: number;
}

export function CapitalSummary({
  totalContributed = 120000,
  currentlyBlocked = 40000,
  currentlyInvested = 60000,
  available = 20000,
}: CapitalSummaryProps) {
  return (
    <div className="p-5 sm:p-6 bg-surface border border-line rounded-2xl space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center font-bold">
            <Coins size={18} />
          </div>
          <div>
            <h3 className="text-h4 font-semibold text-ink">My Capital</h3>
            <p className="text-caption text-ink-tertiary font-medium">
              Your personal allocation across group applications
            </p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-accent uppercase tracking-wider bg-accent-soft px-2 py-0.5 rounded border border-accent/20">
          Personal Capital
        </span>
      </div>

      <div className="space-y-2.5 text-small">
        <div className="p-3 rounded-xl bg-surface-alt/70 border border-line-subtle flex items-center justify-between">
          <span className="text-caption font-semibold text-ink-secondary">Total Contributed</span>
          <span className="font-semibold text-ink num-tabular">{formatINR(totalContributed)}</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-alt/70 border border-line-subtle flex items-center justify-between">
          <span className="text-caption font-semibold text-caution">Currently Blocked</span>
          <span className="font-semibold text-ink num-tabular">{formatINR(currentlyBlocked)}</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-alt/70 border border-line-subtle flex items-center justify-between">
          <span className="text-caption font-semibold text-accent">Currently Invested</span>
          <span className="font-semibold text-ink num-tabular">{formatINR(currentlyInvested)}</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-alt/70 border border-line-subtle flex items-center justify-between">
          <span className="text-caption font-semibold text-positive">Available Liquidity</span>
          <span className="font-semibold text-positive num-tabular">{formatINR(available)}</span>
        </div>
      </div>
    </div>
  );
}
