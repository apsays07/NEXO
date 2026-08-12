"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { X, Check, CheckCircle, User, IdentificationCard, ShieldCheck } from "@phosphor-icons/react";

interface ApplyIPOModalProps {
  ipo: IPOOpportunity;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyIPOModal({ ipo, isOpen, onClose }: ApplyIPOModalProps) {
  const { members, createApplication, setActiveTab } = useNexo();

  const [applicantName, setApplicantName] = useState("Ashay");
  const [numberOfIpos, setNumberOfIpos] = useState<number>(1);
  const [panNumbers, setPanNumbers] = useState<string[]>(["ABCDE2741D"]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Synchronize array length: no of ipo = no of pan card numbers
  useEffect(() => {
    setPanNumbers((prev) => {
      const updated = [...prev];
      if (numberOfIpos > updated.length) {
        while (updated.length < numberOfIpos) {
          updated.push("");
        }
      } else if (numberOfIpos < updated.length) {
        return updated.slice(0, numberOfIpos);
      }
      return updated;
    });
  }, [numberOfIpos]);

  if (!isOpen) return null;

  const minInvest = ipo.metrics?.minInvestment || 14964;
  const totalAmount = numberOfIpos * minInvest;

  const handlePanChange = (index: number, value: string) => {
    const updated = [...panNumbers];
    updated[index] = value.toUpperCase();
    setPanNumbers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const member = members.find(
      (m) => m.name.toLowerCase() === applicantName.toLowerCase()
    ) || members[0];

    createApplication(
      ipo.id,
      numberOfIpos > 1 ? "COMBO" : "SOLO",
      [
        {
          memberId: member.id,
          contribution: totalAmount,
        },
      ]
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setActiveTab("applications");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-[520px] bg-white border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] border border-[#D0E1FF] text-[#2F6BFF] flex items-center justify-center font-black text-base">
              {ipo.logo}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111827] tracking-tight">
                Apply for {ipo.name}
              </h3>
              <p className="text-xs text-[#667085] font-medium">
                Syndicate IPO Application Form
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#667085] hover:text-[#111827] hover:bg-[#F4F6F8] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#ECFDF3] border border-[#A6F4C5] text-[#12B76A] flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h4 className="text-lg font-extrabold text-[#111827]">
              Application Filed Successfully!
            </h4>
            <p className="text-xs text-[#667085]">
              Registered {numberOfIpos} IPO application(s) with {panNumbers.length} PAN card(s) for {applicantName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            {/* 1. Applicant Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#111827] flex items-center gap-1.5">
                <User size={14} className="text-[#2F6BFF]" /> Applicant Name *
              </label>
              <select
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full bg-[#F7F8FA] border border-[#E4E7EC] hover:border-[#D0D5DD] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#111827] focus:border-[#2F6BFF] focus:outline-none transition-colors"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.panMasked})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Number of IPOs */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#111827] flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[#2F6BFF]" /> Number of IPOs (Lots) *
                </label>
                <span className="text-[10px] text-[#667085] font-mono">
                  1 PAN per IPO
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNumberOfIpos(num)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      numberOfIpos === num
                        ? "bg-[#EEF4FF] border-[#2F6BFF] text-[#2F6BFF] shadow-2xs"
                        : "bg-[#F7F8FA] border-[#E4E7EC] text-[#667085] hover:bg-[#F4F6F8] hover:text-[#111827]"
                    }`}
                  >
                    {num} {num === 1 ? "IPO" : "IPOs"}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Dynamic PAN Inputs */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#111827] flex items-center gap-1.5">
                <IdentificationCard size={14} className="text-[#2F6BFF]" /> PAN Card Numbers ({panNumbers.length} Required) *
              </label>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {panNumbers.map((pan, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#667085] w-14 shrink-0 font-mono">
                      PAN #{idx + 1}:
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder={`e.g. ABCDE274${idx + 1}D`}
                      value={pan}
                      onChange={(e) => handlePanChange(idx, e.target.value)}
                      className="flex-1 bg-[#F7F8FA] border border-[#E4E7EC] hover:border-[#D0D5DD] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#111827] tracking-widest uppercase focus:border-[#2F6BFF] focus:outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Summary Box */}
            <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#027A48] font-bold block">
                  Total Investment Required
                </span>
                <span className="text-[11px] text-[#059669] font-medium">
                  {numberOfIpos} IPO(s) × {formatINR(minInvest)} per lot
                </span>
              </div>
              <span className="text-lg font-black text-[#12B76A] num-tabular">
                {formatINR(totalAmount)}
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-[#E4E7EC] flex items-center justify-end gap-3">
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
