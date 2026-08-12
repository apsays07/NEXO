"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import {
  X,
  User,
  IdentificationCard,
  CheckCircle,
  ShieldCheck,
  Check,
} from "@phosphor-icons/react";

export function ApplicationModal() {
  const {
    isApplicationModalOpen,
    activeApplicationIpo,
    closeApplicationModal,
    members,
    createApplication,
  } = useNexo();

  const [applicantName, setApplicantName] = useState<string>("");
  const [numberOfIpos, setNumberOfIpos] = useState<number | "">(1);
  const [panNumbers, setPanNumbers] = useState<string[]>([""]);
  const [isSuccess, setIsSuccess] = useState(false);

  const effectiveIpos = typeof numberOfIpos === "number" && numberOfIpos > 0 ? numberOfIpos : 1;

  // Initialize default applicant name
  useEffect(() => {
    if (members.length > 0 && !applicantName) {
      setApplicantName(members[0].name);
    }
  }, [members, applicantName]);

  // Synchronize array length: no of IPOs = no of PAN card inputs
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

  if (!isApplicationModalOpen || !activeApplicationIpo) return null;

  const minInvest = activeApplicationIpo.metrics?.minInvestment || 14964;
  const totalAmount = effectiveIpos * minInvest;

  const handlePanChange = (index: number, value: string) => {
    const updated = [...panNumbers];
    updated[index] = value.toUpperCase();
    setPanNumbers(updated);
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
      activeApplicationIpo.id,
      effectiveIpos > 1 ? "COMBO" : "SOLO",
      participantContributions,
      undefined,
      member.id
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      closeApplicationModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-[520px] bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              Application Form
            </div>
            <h3 className="text-base font-extrabold text-[#0F172A]">
              Apply for {activeApplicationIpo.name}
            </h3>
          </div>
          <button
            onClick={closeApplicationModal}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h4 className="text-base font-extrabold text-[#0F172A]">
              Application Submitted Successfully!
            </h4>
            <p className="text-xs text-[#64748B] font-medium">
              Registered {numberOfIpos} IPO application(s) with {panNumbers.length} PAN card(s) for {applicantName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs overflow-y-auto">
            {/* 1. Applicant Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                <User size={14} className="text-[#2563EB]" /> Applicant Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ankit Sharma"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] focus:border-[#2563EB] focus:outline-none transition-colors placeholder:text-[#94A3B8] placeholder:font-normal placeholder:tracking-normal"
              />
            </div>

            {/* 2. Number of IPOs */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-[#2563EB]" /> Number of IPOs *
                </label>
                <span className="text-[11px] text-[#64748B] font-mono">
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
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0F172A] focus:border-[#2563EB] focus:outline-none transition-colors placeholder:text-[#94A3B8] placeholder:font-normal placeholder:tracking-normal"
                placeholder="Enter number of IPOs (Min: 1)"
              />
            </div>

            {/* 3. PAN Card Inputs (Equal to number of IPOs) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                <IdentificationCard size={14} className="text-[#2563EB]" /> PAN Card Numbers ({panNumbers.length} Required) *
              </label>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {panNumbers.map((pan, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#64748B] w-14 shrink-0 font-mono">
                      PAN #{idx + 1}:
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder={`e.g. ABCDE274${idx + 1}D`}
                      value={pan}
                      onChange={(e) => handlePanChange(idx, e.target.value)}
                      className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[#0F172A] tracking-widest uppercase focus:border-[#2563EB] focus:outline-none transition-colors placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-[#94A3B8]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Summary */}
            <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#047857] font-bold block">
                  Total Investment Required
                </span>
                <span className="text-[11px] text-[#059669] font-medium">
                  {numberOfIpos} IPO(s) × {formatINR(minInvest)} per lot
                </span>
              </div>
              <span className="text-lg font-extrabold text-[#059669] num-tabular">
                {formatINR(totalAmount)}
              </span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
              <Button variant="secondary" size="md" type="button" onClick={closeApplicationModal}>
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

