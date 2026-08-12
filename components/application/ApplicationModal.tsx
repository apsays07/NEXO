"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { Button } from "../ui/Button";
import { UploadZone } from "../ui/UploadZone";
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

  const [proofUrl, setProofUrl] = useState<string>("");

  if (!isApplicationModalOpen || !activeApplicationIpo) return null;

  const totalPooled = Object.values(contributions).reduce((a, b) => a + (b || 0), 0);

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

  const handleSubmit = () => {
    const list = Object.entries(contributions).map(([memberId, contribution]) => ({
      memberId,
      contribution,
    }));

    createApplication(activeApplicationIpo.id, participationType, list, proofUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              Step {step} of 4 • Progressive Data Entry
            </div>
            <h3 className="text-base font-extrabold text-[#0F172A]">
              Application for {activeApplicationIpo.name}
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

              {/* Members Checklist & Contribution Inputs */}
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
                                  handleContributionChange(
                                    member.id,
                                    Number(e.target.value)
                                  )
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

          {/* STEP 3: PROOF UPLOAD & PRIVATE VAULT */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-sm font-extrabold text-[#0F172A]">
                Upload Private Application Record
              </div>
              <p className="text-xs text-[#64748B] font-medium">
                Proof screenshots are encrypted and accessible only to participating syndicate members.
              </p>

              <UploadZone
                label="Application Screenshot / Payment Ref"
                existingUrl={proofUrl}
                onUploadComplete={(url) => setProofUrl(url)}
              />

              <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#047857] space-y-1">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <LockKey size={14} className="text-[#059669]" /> Group Vault Privacy Guarantee
                </div>
                <div className="text-[11px] text-[#047857] font-medium">
                  Full PAN and application reference numbers are never exposed outside your 5 trusted members.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUMMARY & CONFIRMATION */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-3">
                <CheckCircle size={28} className="text-[#059669]" />
                <div>
                  <div className="text-sm font-bold text-[#0F172A]">Ready for Group Vaulting</div>
                  <div className="text-xs text-[#059669] font-medium">
                    Pro-rata calculations and proof records prepared
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
                    Participant Breakdown & Share:
                  </span>
                  <div className="space-y-1.5">
                    {Object.entries(contributions).map(([memId, amount]) => {
                      const m = members.find((x) => x.id === memId);
                      const pct = ((amount / totalPooled) * 100).toFixed(1);
                      return (
                        <div
                          key={memId}
                          className="flex justify-between items-center bg-[#FFFFFF] border border-[#E2E8F0] p-2 rounded-lg"
                        >
                          <span className="text-[#0F172A] font-bold">{m?.name}</span>
                          <span className="text-[#475569] font-semibold num-tabular">
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
              disabled={totalPooled <= 0}
            >
              Continue <CaretRight size={14} />
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={handleSubmit}>
              Confirm & Save Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
