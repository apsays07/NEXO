"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { Button } from "../ui/Button";
import { MaskedPAN } from "../ui/MaskedPAN";
import { formatINR } from "@/lib/mockData";
import { ParticipationType } from "@/types/nexo";
import {
  X,
  User,
  Users,
  CheckCircle,
  LockKey,
  CaretRight,
  IdentificationCard,
  Eye,
  EyeSlash,
} from "@phosphor-icons/react";

export function ApplicationModal() {
  const {
    isApplicationModalOpen,
    activeApplicationIpo,
    closeApplicationModal,
    members,
    createApplication,
  } = useNexo();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [participationType, setParticipationType] = useState<ParticipationType>("COMBO");

  const oneLotValue = activeApplicationIpo
    ? activeApplicationIpo.metrics.minInvestment ||
      activeApplicationIpo.metrics.lotSize * activeApplicationIpo.metrics.priceBand.max
    : 14900;

  const [contributions, setContributions] = useState<Record<string, number>>({
    mem_1: oneLotValue,
  });

  // PAN entries: memberId -> PAN string entered by user
  const [panEntries, setPanEntries] = useState<Record<string, string>>({});
  // Which PANs are visible (revealed)
  const [panVisible, setPanVisible] = useState<Record<string, boolean>>({});

  if (!isApplicationModalOpen || !activeApplicationIpo) return null;

  const totalPooled = Object.values(contributions).reduce((a, b) => a + (b || 0), 0);

  const selectedMemberIds = Object.keys(contributions);
  const selectedMembers = members.filter((m) => selectedMemberIds.includes(m.id));

  // Check all selected members have a valid PAN entered (10 chars, alphanumeric)
  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const allPansValid = selectedMembers.every(
    (m) => PAN_REGEX.test((panEntries[m.id] || "").toUpperCase())
  );

  const handleContributionChange = (memberId: string, val: number) => {
    setContributions((prev) => ({
      ...prev,
      [memberId]: val,
    }));
  };

  const toggleMemberSelection = (memberId: string) => {
    setContributions((prev) => {
      const copy = { ...prev };
      if (copy[memberId] !== undefined) {
        delete copy[memberId];
      } else {
        copy[memberId] = oneLotValue;
      }
      return copy;
    });
  };

  const handlePanChange = (memberId: string, value: string) => {
    setPanEntries((prev) => ({ ...prev, [memberId]: value.toUpperCase() }));
  };

  const togglePanVisible = (memberId: string) => {
    setPanVisible((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
  };

  const handleSubmit = () => {
    const list = Object.entries(contributions).map(([memberId, contribution]) => ({
      memberId,
      contribution,
    }));
    createApplication(activeApplicationIpo.id, participationType, list, undefined);
  };

  const stepLabels = ["Mode", "Capital", "PAN", "Confirm"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">

        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            {/* Step progress pills */}
            <div className="flex items-center gap-1.5 mb-1.5">
              {stepLabels.map((label, idx) => {
                const s = idx + 1;
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        step === s
                          ? "bg-[#2563EB] text-white border-[#2563EB]"
                          : step > s
                          ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                          : "bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]"
                      }`}
                    >
                      {step > s ? "✓" : s} {label}
                    </span>
                    {idx < stepLabels.length - 1 && (
                      <span className="text-[#CBD5E1] text-[10px]">›</span>
                    )}
                  </div>
                );
              })}
            </div>
            <h3 className="text-base font-extrabold text-[#0F172A]">
              Application — {activeApplicationIpo.name}
            </h3>
          </div>
          <button
            onClick={closeApplicationModal}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* STEP 1: PARTICIPATION MODE */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-sm font-extrabold text-[#0F172A]">
                Select Participation Structure
              </div>
              <p className="text-xs text-[#64748B] font-medium">
                Choose whether you are applying independently or pooling capital with syndicate members.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setParticipationType("SOLO");
                    setContributions({ mem_1: oneLotValue });
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    participationType === "SOLO"
                      ? "bg-[#EFF6FF] border-[#2563EB] text-[#0F172A] shadow-xs"
                      : "bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] mb-3 shadow-2xs">
                    <User size={22} />
                  </div>
                  <div className="font-bold text-sm text-[#0F172A]">SOLO Application</div>
                  <div className="text-xs text-[#64748B] mt-1 font-medium">
                    1 Lot value: {formatINR(oneLotValue)} under your own PAN.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setParticipationType("COMBO");
                    setContributions({ mem_1: oneLotValue, mem_2: oneLotValue });
                  }}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    participationType === "COMBO"
                      ? "bg-[#ECFDF5] border-[#059669] text-[#0F172A] shadow-xs"
                      : "bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] hover:border-[#CBD5E1]"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#A7F3D0] flex items-center justify-center text-[#059669] mb-3 shadow-2xs">
                    <Users size={22} />
                  </div>
                  <div className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
                    COMBO Syndicate
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#059669] text-white font-bold">
                      Recommended
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B] mt-1 font-medium">
                    Pool capital starting at 1 Lot ({formatINR(oneLotValue)}) per member.
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CONTRIBUTIONS & PRO-RATA SPLITS */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-[#0F172A]">
                    Member Capital Allocations
                  </div>
                  <div className="text-xs text-[#64748B] font-medium">
                    Percentages auto-calculated in real time
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#64748B] font-medium">Total Pooled Capital</div>
                  <div className="text-base font-extrabold text-[#059669] num-tabular">
                    {formatINR(totalPooled)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {members.map((member) => {
                  const isSelected = contributions[member.id] !== undefined;
                  const contrib = contributions[member.id] || 0;
                  const percentage =
                    totalPooled > 0 ? ((contrib / totalPooled) * 100).toFixed(1) : "0.0";

                  return (
                    <div
                      key={member.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isSelected
                          ? "bg-[#FFFFFF] border-[#E2E8F0] shadow-2xs"
                          : "bg-[#F8FAFC] border-[#E2E8F0] opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleMemberSelection(member.id)}
                            className="w-4 h-4 rounded border-[#CBD5E1] accent-[#2563EB]"
                          />
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E2E8F0]"
                          />
                          <div>
                            <div className="text-xs font-bold text-[#0F172A]">
                              {member.name}
                            </div>
                            <MaskedPAN panMasked={member.panMasked} />
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <span className="text-[10px] text-[#64748B] block font-medium">
                                Contribution (₹)
                              </span>
                              <input
                                type="number"
                                step={5000}
                                value={contrib}
                                onChange={(e) =>
                                  handleContributionChange(member.id, Number(e.target.value))
                                }
                                className="w-28 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2.5 py-1 text-xs text-right text-[#0F172A] font-bold num-tabular focus:border-[#2563EB] focus:outline-none"
                              />
                            </div>
                            <div className="w-16 text-right">
                              <span className="text-[10px] text-[#64748B] block font-medium">Share</span>
                              <span className="text-xs font-bold text-[#2563EB] num-tabular">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-[#94A3B8] font-medium">Not Participating</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: PAN VERIFICATION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <IdentificationCard size={20} className="text-[#2563EB]" />
                <div className="text-sm font-extrabold text-[#0F172A]">PAN Verification</div>
              </div>
              <p className="text-xs text-[#64748B] font-medium">
                Enter the PAN for each participant applying for this IPO. This is required for every application.
              </p>

              <div className="space-y-3">
                {selectedMembers.map((member) => {
                  const pan = panEntries[member.id] || "";
                  const isValid = PAN_REGEX.test(pan.toUpperCase());
                  const visible = panVisible[member.id];

                  return (
                    <div
                      key={member.id}
                      className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-2xs space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E2E8F0]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#0F172A]">{member.name}</div>
                          <div className="text-[11px] text-[#64748B] font-medium">
                            Contribution: <span className="font-bold text-[#0F172A]">{formatINR(contributions[member.id] || 0)}</span>
                          </div>
                        </div>
                        {isValid && (
                          <CheckCircle size={18} weight="fill" className="text-[#059669] ml-auto" />
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                          PAN Number
                        </label>
                        <div className="relative">
                          <input
                            type={visible ? "text" : "password"}
                            value={pan}
                            onChange={(e) => handlePanChange(member.id, e.target.value)}
                            placeholder="e.g. ABCDE1234F"
                            maxLength={10}
                            className={`w-full pr-10 pl-3 py-2.5 rounded-xl border text-sm font-bold tracking-widest outline-none transition-all font-mono ${
                              pan.length > 0
                                ? isValid
                                  ? "border-[#059669] bg-[#ECFDF5] text-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                                  : "border-[#DC2626] bg-[#FEF2F2] text-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20"
                                : "border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => togglePanVisible(member.id)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
                          >
                            {visible ? <EyeSlash size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                        {pan.length > 0 && !isValid && (
                          <p className="text-[11px] text-[#DC2626] font-medium mt-1">
                            Invalid PAN format. Must be 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F)
                          </p>
                        )}
                        {isValid && (
                          <p className="text-[11px] text-[#059669] font-medium mt-1">
                            ✓ Valid PAN
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E3A8A] flex items-start gap-2">
                <LockKey size={14} className="text-[#2563EB] mt-0.5 shrink-0" />
                <span className="font-medium">
                  PAN details are encrypted and only visible to verified syndicate members. Never shared outside the group.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: SUMMARY & CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-3">
                <CheckCircle size={28} className="text-[#059669]" />
                <div>
                  <div className="text-sm font-bold text-[#0F172A]">Ready to Submit</div>
                  <div className="text-xs text-[#059669] font-medium">
                    All PANs verified · Pro-rata splits calculated
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B] font-medium">IPO Target</span>
                  <span className="font-bold text-[#0F172A]">{activeApplicationIpo.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B] font-medium">Structure</span>
                  <span className="font-bold text-[#2563EB]">{participationType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
                  <span className="text-[#64748B] font-medium">Total Pooled Amount</span>
                  <span className="font-bold text-[#0F172A] num-tabular">
                    {formatINR(totalPooled)}
                  </span>
                </div>

                <div className="pt-2">
                  <span className="text-[#64748B] block mb-2 font-bold">
                    Participant Breakdown & PAN:
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(contributions).map(([memId, amount]) => {
                      const m = members.find((x) => x.id === memId);
                      const pct = ((amount / totalPooled) * 100).toFixed(1);
                      const pan = panEntries[memId] || "";
                      const maskedPan = pan.length === 10
                        ? pan.substring(0, 2) + "XXXXX" + pan.substring(7)
                        : "—";
                      return (
                        <div
                          key={memId}
                          className="flex justify-between items-center bg-[#FFFFFF] border border-[#E2E8F0] p-2.5 rounded-xl gap-2"
                        >
                          <div>
                            <span className="text-[#0F172A] font-bold block">{m?.name}</span>
                            <span className="text-[10px] font-mono text-[#64748B]">{maskedPan}</span>
                          </div>
                          <span className="text-[#475569] font-semibold num-tabular text-right">
                            {formatINR(amount)} ({pct}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStep((s) => (s - 1) as any)}
            >
              Back
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={closeApplicationModal}>
              Cancel
            </Button>
          )}

          {step < 4 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStep((s) => (s + 1) as any)}
              disabled={step === 2 ? totalPooled <= 0 : step === 3 ? !allPansValid : false}
            >
              Continue <CaretRight size={14} />
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={handleSubmit}>
              Confirm & Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
