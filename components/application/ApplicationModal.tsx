"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { formatINR } from "@/lib/mockData";
import {
  X,
  CheckCircle,
  User,
  IdentificationCard,
  ShieldCheck,
  CircleNotch,
  UsersThree,
  Plus,
  Trash,
  Scales,
  Coins,
} from "@phosphor-icons/react";

import { ApplicationSuccessModal } from "./ApplicationSuccessModal";

interface ContributorEntry {
  memberId: string;
  memberName: string;
  amount: number | "";
}

// Color palette for friend progress bar segments
const BAR_COLORS = [
  "bg-blue-600",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-indigo-600",
  "bg-rose-500",
  "bg-violet-600",
];

export function ApplicationModal() {
  const {
    isApplicationModalOpen,
    activeApplicationIpo,
    closeApplicationModal,
    members,
    createApplication,
  } = useNexo();

  const [applicantMode, setApplicantMode] = useState<"SOLO" | "JOINT">("SOLO");
  const [applicantName, setApplicantName] = useState<string>("");

  const [numberOfIpos, setNumberOfIpos] = useState<number | "">(1);
  const effectiveIpos = Math.max(1, typeof numberOfIpos === "number" ? numberOfIpos : 1);
  const minInvest = activeApplicationIpo?.metrics?.minInvestment || 14964;
  const targetRequiredCapital = minInvest * effectiveIpos;

  // Dynamic Contributors State
  const [contributors, setContributors] = useState<ContributorEntry[]>([
    { memberId: members[0]?.id || "mem_1", memberName: "Ankit", amount: Math.floor(targetRequiredCapital / 2) },
    { memberId: members[1]?.id || "mem_2", memberName: "Ashay", amount: targetRequiredCapital - Math.floor(targetRequiredCapital / 2) },
  ]);

  const [panNumbers, setPanNumbers] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize default applicant name
  useEffect(() => {
    if (members.length > 0 && !applicantName) {
      setApplicantName(members[0].name);
    }
  }, [members, applicantName]);

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

  const handleEqualSplit = () => {
    const count = contributors.length || 1;
    const equalShare = Math.floor(targetRequiredCapital / count);
    const remainder = targetRequiredCapital - equalShare * count;

    setContributors((prev) =>
      prev.map((c, idx) => ({
        ...c,
        amount: idx === 0 ? equalShare + remainder : equalShare,
      }))
    );
  };

  // Sync initial equal split when target capital changes
  useEffect(() => {
    handleEqualSplit();
  }, [targetRequiredCapital]);

  if (!isApplicationModalOpen || !activeApplicationIpo) return null;

  const totalPooledCapital = contributors.reduce(
    (sum, c) => sum + (typeof c.amount === "number" ? c.amount : 0),
    0
  );

  const handleAddContributor = () => {
    const remainingNeeded = Math.max(0, targetRequiredCapital - totalPooledCapital);
    const nextIdx = contributors.length + 1;
    const defaultFriendName = members[contributors.length]?.name || `Friend #${nextIdx}`;

    setContributors((prev) => [
      ...prev,
      {
        memberId: `mem_custom_${Date.now()}`,
        memberName: defaultFriendName,
        amount: remainingNeeded > 0 ? remainingNeeded : 0,
      },
    ]);
  };

  const handleRemoveContributor = (index: number) => {
    if (contributors.length > 1) {
      setContributors((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const handleContributorNameChange = (index: number, name: string) => {
    setContributors((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], memberName: name };
      return updated;
    });
  };

  const handleContributorAmountChange = (index: number, valStr: string) => {
    setContributors((prev) => {
      const updated = [...prev];
      if (valStr === "") {
        updated[index] = { ...updated[index], amount: "" };
      } else {
        const parsed = parseInt(valStr, 10);
        updated[index] = { ...updated[index], amount: isNaN(parsed) ? "" : parsed };
      }
      return updated;
    });
  };

  const handlePanChange = (index: number, value: string) => {
    const updated = [...panNumbers];
    updated[index] = value.toUpperCase().slice(0, 10);
    setPanNumbers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const primaryMember =
        members.find((m) => m.name.toLowerCase() === applicantName.trim().toLowerCase()) ||
        members[0];

      let participantContributions;

      if (applicantMode === "JOINT") {
        participantContributions = contributors.map((c) => ({
          memberId: c.memberId,
          memberName: c.memberName.trim() || "Friend",
          contribution: typeof c.amount === "number" ? c.amount : 0,
        }));
      } else {
        participantContributions = Array.from({ length: effectiveIpos }).map(() => ({
          memberId: primaryMember.id,
          memberName: primaryMember.name,
          contribution: minInvest,
        }));
      }

      createApplication(
        activeApplicationIpo.id,
        applicantMode === "JOINT" ? "COMBO" : effectiveIpos > 1 ? "COMBO" : "SOLO",
        participantContributions,
        undefined,
        primaryMember.id
      );

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 400);
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    closeApplicationModal();
  };

  const isValidPan = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  if (isSuccess) {
    return (
      <ApplicationSuccessModal
        isOpen={true}
        onClose={handleCloseSuccess}
        ipoName={activeApplicationIpo.name}
        ipoLogo={activeApplicationIpo.logo}
        applicantName={
          applicantMode === "JOINT"
            ? contributors.map((c) => c.memberName).join(", ")
            : applicantName
        }
        panCount={panNumbers.length}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-md p-4 animate-fade-in font-sans">
      <div className="w-full max-w-[560px] bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[92vh] transition-all">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shadow-2xs shrink-0">
              {activeApplicationIpo.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Apply for {activeApplicationIpo.name}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full">
                  Open
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Official IPO Application Form
              </p>
            </div>
          </div>

          <button
            onClick={closeApplicationModal}
            className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(92vh-90px)]">
          {/* CAPITAL FUNDING STRUCTURE SWITCHER */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Capital Funding Structure
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setApplicantMode("SOLO")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  applicantMode === "SOLO"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <User size={15} className={applicantMode === "SOLO" ? "text-blue-600" : ""} />
                <span>Solo (100% Capital)</span>
              </button>

              <button
                type="button"
                onClick={() => setApplicantMode("JOINT")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  applicantMode === "JOINT"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <UsersThree size={16} />
                <span>Multi-Friend Split</span>
              </button>
            </div>
          </div>

          {/* 1. Primary Applicant Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <User size={15} className="text-blue-600" /> Primary Applicant Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ankit"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 tracking-tight focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* FRIEND NAME | AMOUNT TABLE WITH VISUAL PROGRESS BAR & SUM MATCHING */}
          {applicantMode === "JOINT" && (
            <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50/70 to-slate-50/70 border border-blue-200/80 space-y-3.5 animate-fade-in shadow-2xs">
              {/* Header Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Coins size={16} className="text-blue-600" /> Capital Allocation Pool
                </span>
                <button
                  type="button"
                  onClick={handleEqualSplit}
                  className="text-[11px] font-bold text-blue-700 bg-white border border-blue-200 hover:bg-blue-100 px-2.5 py-1 rounded-xl shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Scales size={13} /> Split Equally
                </button>
              </div>

              {/* Table Header: FRIEND NAME | AMOUNT (₹) */}
              <div className="grid grid-cols-12 gap-2 px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <div className="col-span-6">Friend Name</div>
                <div className="col-span-5 text-right">Amount (₹)</div>
                <div className="col-span-1"></div>
              </div>

              {/* Dynamic Clean Input Rows */}
              <div className="space-y-2">
                {contributors.map((c, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-center p-2 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-all"
                  >
                    {/* Clean Friend Name Input */}
                    <div className="col-span-6 flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-full ${BAR_COLORS[idx % BAR_COLORS.length]} text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-2xs`}>
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Friend #${idx + 1} Name`}
                        value={c.memberName}
                        onChange={(e) => handleContributorNameChange(idx, e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
                      />
                    </div>

                    {/* Clean Custom Amount Input */}
                    <div className="col-span-5 flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-400">₹</span>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={c.amount}
                        onChange={(e) => handleContributorAmountChange(idx, e.target.value)}
                        className="w-full bg-slate-50/80 border border-slate-200 focus:bg-white focus:border-blue-600 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 text-right outline-none transition-all"
                      />
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-1 flex justify-end">
                      {contributors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveContributor(idx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove Friend"
                        >
                          <Trash size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* VISUAL MULTI-COLOR CAPITAL SHARE PROGRESS BAR */}
              {totalPooledCapital > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/60 shadow-inner">
                    {contributors.map((c, idx) => {
                      const amt = typeof c.amount === "number" ? c.amount : 0;
                      const pct = Math.min(100, Math.max(0, (amt / totalPooledCapital) * 100));
                      if (pct === 0) return null;
                      return (
                        <div
                          key={idx}
                          style={{ width: `${pct}%` }}
                          className={`${BAR_COLORS[idx % BAR_COLORS.length]} transition-all duration-300 h-full`}
                          title={`${c.memberName}: ${formatINR(amt)} (${pct.toFixed(1)}%)`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Footer: Add Friend Button + Target Sum Validation */}
              <div className="flex items-center justify-between pt-2 border-t border-blue-200/60">
                <button
                  type="button"
                  onClick={handleAddContributor}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-blue-300 text-blue-700 hover:bg-blue-100 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus size={14} weight="bold" /> Add Friend
                </button>

                <div className="text-right text-xs">
                  <div className="font-mono font-bold text-slate-900">
                    Total:{" "}
                    <span
                      className={
                        totalPooledCapital === targetRequiredCapital
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }
                    >
                      {formatINR(totalPooledCapital)}
                    </span>{" "}
                    / {formatINR(targetRequiredCapital)}
                  </div>
                  {totalPooledCapital === targetRequiredCapital ? (
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                      <CheckCircle size={12} weight="fill" /> Matches Required Capital
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-600">
                      {totalPooledCapital < targetRequiredCapital
                        ? `Need ${formatINR(targetRequiredCapital - totalPooledCapital)} more`
                        : `Exceeds by ${formatINR(totalPooledCapital - targetRequiredCapital)}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. Number of PAN Cards */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
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
              className="w-full bg-slate-50/80 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 tracking-tight focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-slate-400"
              placeholder="Enter number of PAN cards (e.g. 5)"
            />
          </div>

          {/* 3. Dynamic PAN Card Inputs */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 animate-fade-in">
                          <CheckCircle size={16} weight="fill" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeApplicationModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 hover:from-slate-800 hover:to-blue-800 disabled:opacity-75 text-white font-bold text-xs shadow-lg shadow-blue-950/20 flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <CircleNotch size={18} className="animate-spin" /> Filing Application...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} weight="bold" /> Submit {applicantMode === "JOINT" ? `${contributors.length} Friends Split` : ""} {effectiveIpos} IPO Application(s)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
