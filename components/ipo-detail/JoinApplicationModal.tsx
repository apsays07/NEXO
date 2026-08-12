"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity, ParticipationType } from "@/types/nexo";
import { X, UserPlus, Check } from "@phosphor-icons/react";

interface JoinApplicationModalProps {
  ipo: IPOOpportunity;
  isOpen: boolean;
  onClose: () => void;
  onJoin: (type: ParticipationType, contribution: number) => void;
}

export function JoinApplicationModal({
  ipo,
  isOpen,
  onClose,
  onJoin,
}: JoinApplicationModalProps) {
  const [type, setType] = useState<ParticipationType>("COMBO");
  const [contribution, setContribution] = useState<number>(30000);

  if (!isOpen) return null;

  const currentPool = ipo.combinedCapital || 120000;
  const newPool = currentPool + contribution;
  const calculatedShare = newPool > 0 ? (contribution / newPool) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoin(type, contribution);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-md bg-surface border border-line rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
        <div className="p-5 border-b border-line flex items-center justify-between bg-page">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center font-bold">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A]">
                Join Application
              </h3>
              <p className="text-xs text-[#64748B] font-medium">
                {ipo.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Participation Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("COMBO")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  type === "COMBO"
                    ? "bg-accent-soft border-[#2563EB] text-accent"
                    : "bg-page border-line text-[#64748B]"
                }`}
              >
                {type === "COMBO" && <Check size={14} />} Combo Pool
              </button>
              <button
                type="button"
                onClick={() => setType("SOLO")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  type === "SOLO"
                    ? "bg-accent-soft border-[#2563EB] text-accent"
                    : "bg-page border-line text-[#64748B]"
                }`}
              >
                {type === "SOLO" && <Check size={14} />} Solo Application
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Your Contribution Amount (₹) *
            </label>
            <input
              type="number"
              required
              min={ipo.metrics.minInvestment}
              step={1000}
              value={contribution}
              onChange={(e) => setContribution(Number(e.target.value))}
              className="w-full bg-page border border-[#CBD5E1] rounded-xl px-3 py-2.5 text-sm font-extrabold text-[#0F172A] focus:border-[#2563EB] focus:outline-none num-tabular"
            />
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Minimum lot investment: {formatINR(ipo.metrics.minInvestment)}
            </span>
          </div>

          {type === "COMBO" && (
            <div className="p-3.5 rounded-xl bg-page border border-line space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B] font-medium">New Total Pooled Capital:</span>
                <span className="font-extrabold text-[#0F172A] num-tabular">
                  {formatINR(newPool)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#64748B] font-medium">Auto-Calculated Share:</span>
                <span className="font-extrabold text-positive num-tabular">
                  {calculatedShare.toFixed(2)}%
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Confirm & Join Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
