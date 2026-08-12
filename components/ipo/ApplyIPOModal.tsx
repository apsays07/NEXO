"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { X, Check, CheckCircle, User, IdentificationCard, ShieldCheck, Crown, Sparkle } from "@phosphor-icons/react";

interface ApplyIPOModalProps {
  ipo: IPOOpportunity;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyIPOModal({ ipo, isOpen, onClose }: ApplyIPOModalProps) {
  const { members, createApplication, openPremiumModal, isPremiumUser } = useNexo();

  const [applicantName, setApplicantName] = useState("Ashay");
  const [numberOfIpos, setNumberOfIpos] = useState<number | "">(1);
  const [panNumbers, setPanNumbers] = useState<string[]>(["ABCDE2741D"]);
  const [isSuccess, setIsSuccess] = useState(false);

  const effectiveIpos = typeof numberOfIpos === "number" && numberOfIpos > 0 ? numberOfIpos : 1;

  // Synchronize array length: no of ipo = no of pan card numbers
  useEffect(() => {
    setPanNumbers((prev) => {
      const updated = [...prev];
      if (effectiveIpos > updated.length) {
        while (updated.length < effectiveIpos) {
          updated.push("");
        }
      } else if (effectiveIpos < updated.length) {
        return updated.slice(0, effectiveIpos);
      }
      return updated;
    });
  }, [effectiveIpos]);

  if (!isOpen) return null;

  const minInvest = ipo.metrics?.minInvestment || 14964;
  const totalAmount = effectiveIpos * minInvest;

  const handlePanChange = (index: number, value: string) => {
    const updated = [...panNumbers];
    updated[index] = value.toUpperCase();
    setPanNumbers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const member = members.find(
      (m) => m.name.toLowerCase() === applicantName.trim().toLowerCase()
    ) || members[0];

    const participantContributions = Array.from({ length: effectiveIpos }).map(() => ({
      memberId: member.id,
      contribution: minInvest,
    }));

    createApplication(
      ipo.id,
      effectiveIpos > 1 ? "COMBO" : "SOLO",
      participantContributions,
      undefined,
      member.id
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-[520px] bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-bold text-base">
              {ipo.logo}
            </div>
            <div>
              <h3 className="nexo-h4 text-[#111318]">
                Apply for {ipo.name}
              </h3>
              <p className="text-xs text-[#5F6673] font-normal">
                Syndicate IPO Application Form
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5F6673] hover:text-[#111318] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#ECFDF3] border border-[#A6F4C5] text-[#12B76A] flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h4 className="nexo-h4 text-[#111318]">
              Application Filed Successfully!
            </h4>
            <p className="text-xs text-[#5F6673] font-normal">
              Registered {numberOfIpos} IPO application(s) with {panNumbers.length} PAN card(s) for {applicantName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            {/* VIP Premium Boost Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-amber-500/40 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Crown size={18} weight="fill" />
                </div>
                <div>
                  <span className="font-semibold text-amber-300 block text-xs flex items-center gap-1">
                    <Sparkle size={12} weight="fill" /> Nexo Pro VIP Allotment Boost
                  </span>
                  <span className="text-[11px] text-slate-300 font-normal">
                    {isPremiumUser ? "4.8x Allotment Boost Unlocked" : "Boost allotment probability from 18% → 88%"}
                  </span>
                </div>
              </div>

              {!isPremiumUser && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openPremiumModal(ipo);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-[11px] hover:from-amber-400 hover:to-yellow-300 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                >
                  Upgrade →
                </button>
              )}
            </div>

            {/* 1. Applicant Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#111318] flex items-center gap-1.5">
                <User size={14} className="text-[#2563EB]" /> Applicant Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ankit Sharma"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#111318] tracking-tight focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none transition-all placeholder:text-[#94A3B8] placeholder:font-normal placeholder:tracking-normal"
              />
            </div>

            {/* 2. Number of IPOs */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#111318] flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[#2563EB]" /> Number of IPOs (Lots) *
                </label>
                <span className="text-[11px] text-[#5F6673] font-mono">
                  1 PAN per IPO
                </span>
              </div>
              <input
                type="number"
                min={1}
                required
                value={numberOfIpos}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setNumberOfIpos("");
                  } else {
                    const parsed = parseInt(val, 10);
                    setNumberOfIpos(isNaN(parsed) ? "" : parsed);
                  }
                }}
                onBlur={() => {
                  if (numberOfIpos === "" || numberOfIpos < 1) {
                    setNumberOfIpos(1);
                  }
                }}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#111318] tracking-tight focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 focus:outline-none transition-all placeholder:text-[#94A3B8] placeholder:font-normal placeholder:tracking-normal"
                placeholder="Enter number of IPOs (Min: 1)"
              />
            </div>

            {/* 3. Dynamic PAN Inputs */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#111318] flex items-center gap-1.5">
                <IdentificationCard size={14} className="text-[#2563EB]" /> PAN Card Numbers ({panNumbers.length} Required) *
              </label>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {panNumbers.map((pan, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#5F6673] w-14 shrink-0 font-mono">
                      PAN #{idx + 1}:
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder={`e.g. ABCDE274${idx + 1}D`}
                      value={pan}
                      onChange={(e) => handlePanChange(idx, e.target.value)}
                      className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-mono font-semibold text-[#111318] tracking-widest uppercase focus:border-[#2563EB] focus:outline-none transition-colors placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-[#94A3B8]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Summary Box */}
            <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#027A48] font-semibold block">
                  Total Investment Required
                </span>
                <span className="text-[11px] text-[#059669] font-medium">
                  {numberOfIpos} IPO(s) × {formatINR(minInvest)} per lot
                </span>
              </div>
              <span className="text-lg font-bold text-[#12B76A] num-tabular">
                {formatINR(totalAmount)}
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
              <Button variant="secondary" size="md" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="success" size="md" type="submit">
                <ShieldCheck size={16} /> Submit {numberOfIpos} IPO Application(s)
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
