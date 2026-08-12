"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { IPOOpportunity } from "@/types/nexo";
import {
  X,
  Check,
  CheckCircle,
  User,
  IdentificationCard,
  ShieldCheck,
  Crown,
  Sparkle,
  Plus,
  Minus,
  CaretRight,
} from "@phosphor-icons/react";

interface ApplyIPOModalProps {
  ipo: IPOOpportunity;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyIPOModal({ ipo, isOpen, onClose }: ApplyIPOModalProps) {
  const { members, createApplication, openPremiumModal, isPremiumUser } = useNexo();

  const [applicantName, setApplicantName] = useState("Ashay");
  const [numberOfIpos, setNumberOfIpos] = useState<number>(1);
  const [panNumbers, setPanNumbers] = useState<string[]>(["ABCDE2741D"]);
  const [isSuccess, setIsSuccess] = useState(false);

  const effectiveIpos = Math.max(1, numberOfIpos || 1);

  // Synchronize array length: 1 PAN per IPO
  useEffect(() => {
    setPanNumbers((prev) => {
      const updated = [...prev];
      if (effectiveIpos > updated.length) {
        while (updated.length < effectiveIpos) {
          const defaultPan = members[updated.length]?.panFull || "";
          updated.push(defaultPan);
        }
      } else if (effectiveIpos < updated.length) {
        return updated.slice(0, effectiveIpos);
      }
      return updated;
    });
  }, [effectiveIpos, members]);

  if (!isOpen) return null;

  const minInvest = ipo.metrics?.minInvestment || 14964;

  const handlePanChange = (index: number, value: string) => {
    const updated = [...panNumbers];
    updated[index] = value.toUpperCase().slice(0, 10);
    setPanNumbers(updated);
  };

  const handleStepper = (delta: number) => {
    setNumberOfIpos((prev) => Math.max(1, Math.min(20, (prev || 1) + delta)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const member =
      members.find((m) => m.name.toLowerCase() === applicantName.trim().toLowerCase()) ||
      members[0];

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

  const isValidPan = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-fade-in font-sans">
      <div className="w-full max-w-[540px] bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[92vh] transition-all">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              {ipo.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Apply for {ipo.name}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
                  Open
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Official Syndicate IPO Application Form
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs animate-bounce">
              <Check size={28} weight="bold" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                Application Filed Successfully!
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Registered {effectiveIpos} IPO application(s) with {panNumbers.length} PAN card(s) for {applicantName}.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(92vh-90px)]">
            {/* VIP Premium Boost Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Crown size={20} weight="fill" />
                </div>
                <div>
                  <span className="font-bold text-amber-300 block text-xs flex items-center gap-1">
                    <Sparkle size={13} weight="fill" className="text-amber-400" /> Nexo Pro VIP Allotment Boost
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">
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
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-[11px] hover:from-amber-300 hover:to-amber-400 transition-all shadow-xs cursor-pointer whitespace-nowrap flex items-center gap-1"
                >
                  Upgrade <CaretRight size={12} weight="bold" />
                </button>
              )}
            </div>

            {/* 1. Applicant Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <User size={15} className="text-blue-600" /> Applicant Primary Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Ankit Sharma"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 tracking-tight focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* 2. Number of PAN Cards */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle size={15} className="text-blue-600" /> Number of PAN Cards <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  1 PAN per Application
                </span>
              </div>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={numberOfIpos}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setNumberOfIpos("");
                  } else {
                    const parsed = parseInt(val, 10);
                    setNumberOfIpos(isNaN(parsed) ? "" : Math.max(1, parsed));
                  }
                }}
                onBlur={() => {
                  if (numberOfIpos === "" || numberOfIpos < 1) {
                    setNumberOfIpos(1);
                  }
                }}
                className="w-full bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 tracking-tight focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
                placeholder="Enter number of PAN cards (e.g. 5)"
              />
            </div>

            {/* 3. Dynamic PAN Inputs with status indicators */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  <IdentificationCard size={15} className="text-blue-600" /> PAN Card Numbers ({panNumbers.length} Required) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  Auto-formatted Uppercase
                </span>
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {panNumbers.map((pan, idx) => {
                  const valid = isValidPan(pan);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2 bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 rounded-2xl transition-all"
                    >
                      <span className="text-[11px] font-bold text-slate-500 w-16 shrink-0 font-mono text-center bg-white py-1.5 px-2 rounded-xl border border-slate-200 shadow-2xs">
                        PAN #{idx + 1}
                      </span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          required
                          maxLength={10}
                          placeholder={`e.g. ABCDE274${(idx % 9) + 1}D`}
                          value={pan}
                          onChange={(e) => handlePanChange(idx, e.target.value)}
                          className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 tracking-widest uppercase focus:border-blue-600 focus:ring-3 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                        />
                        {valid && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600">
                            <CheckCircle size={16} weight="fill" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <ShieldCheck size={18} weight="bold" /> Submit {effectiveIpos} IPO Application(s)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
