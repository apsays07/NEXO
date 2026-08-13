"use client";

import React, { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { IPOOpportunity } from "../types/nexo";
import { X, Warning, PencilSimple, ArrowRight, ArrowLeft, FloppyDisk } from "@phosphor-icons/react";

interface EditIPODrawerProps {
  ipo: IPOOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export function EditIPODrawer({ ipo, isOpen, onClose, onSuccess }: EditIPODrawerProps) {
  const { updateIPO } = useAdmin();

  // Step State: 1 = Basic Details Page, 2 = Dates Page
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [name, setName] = useState("");
  const [minInvestment, setMinInvestment] = useState<number | "">(15000);
  const [issueSize, setIssueSize] = useState<number | "">(2400);
  const [gmpPercent, setGmpPercent] = useState<number | "">(18.5);
  const [description, setDescription] = useState("");

  // Date Fields
  const [openDate, setOpenDate] = useState("18 Aug 2026");
  const [closeDate, setCloseDate] = useState("28 Aug 2026");
  const [allotmentDate, setAllotmentDate] = useState("01 Sep 2026");
  const [listingDate, setListingDate] = useState("04 Sep 2026");
  const [fundUnblockDate, setFundUnblockDate] = useState("02 Sep 2026");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (ipo) {
      setName(ipo.name || "");
      setMinInvestment(ipo.metrics?.minInvestment ?? 15000);
      
      let rawIssueSize = 2400;
      if (ipo.metrics?.issueSize) {
        const parsed = parseInt(ipo.metrics.issueSize.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(parsed)) rawIssueSize = parsed;
      }
      setIssueSize(rawIssueSize);
      setGmpPercent(ipo.metrics?.gmpPercent !== undefined ? ipo.metrics.gmpPercent : 18.5);
      setDescription(ipo.thesis || "");
      setOpenDate(ipo.metrics?.openDate || "18 Aug 2026");
      setCloseDate(ipo.metrics?.closeDate || "28 Aug 2026");
      setAllotmentDate(ipo.metrics?.allotmentDate || "01 Sep 2026");
      setListingDate(ipo.metrics?.listingDate || "04 Sep 2026");
      setFundUnblockDate(ipo.metrics?.fundUnblockDate || "02 Sep 2026");
      setStep(1);
    }
  }, [ipo]);

  if (!isOpen || !ipo) return null;

  const numMinInvestment = typeof minInvestment === "number" ? minInvestment : 0;
  const numIssueSize = typeof issueSize === "number" ? issueSize : 0;
  const numGmpPercent = typeof gmpPercent === "number" ? gmpPercent : 0;

  // Validation
  const isNameValid = name.trim().length > 0;
  const isMinInvValid = numMinInvestment > 0;
  const isIssueSizeValid = numIssueSize > 0;
  const isDescriptionValid = description.trim().length > 0;
  const isStep1Valid = isNameValid && isMinInvValid && isIssueSizeValid && isDescriptionValid;

  const isOpenDateValid = openDate.trim().length > 0;
  const isCloseDateValid = closeDate.trim().length > 0;
  const isAllotmentDateValid = allotmentDate.trim().length > 0;
  const isListingDateValid = listingDate.trim().length > 0;
  const isFundUnblockDateValid = fundUnblockDate.trim().length > 0;
  const isStep2Valid =
    isOpenDateValid &&
    isCloseDateValid &&
    isAllotmentDateValid &&
    isListingDateValid &&
    isFundUnblockDateValid;

  const handleNextToDates = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isStep1Valid) {
      setErrorMsg("Please fill in all required basic fields before proceeding.");
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isStep1Valid || !isStep2Valid) {
      setErrorMsg("Please complete all required fields and valid dates.");
      return;
    }

    const res = await updateIPO(ipo.id, {
      name: name.trim(),
      minInvestment: numMinInvestment,
      issueSize: numIssueSize,
      gmpPercent: numGmpPercent,
      description: description.trim(),
      openDate: openDate.trim(),
      closeDate: closeDate.trim(),
      allotmentDate: allotmentDate.trim(),
      listingDate: listingDate.trim(),
      fundUnblockDate: fundUnblockDate.trim(),
    });

    if (res.success) {
      if (onSuccess) {
        onSuccess(res.message || `✓ IPO updated successfully.`);
      }
      onClose();
    } else {
      setErrorMsg(res.message || "Failed to update IPO.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
              <PencilSimple size={22} weight="bold" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 font-mono">
                  EDIT IPO • {step === 1 ? "STEP 1 OF 2" : "STEP 2 OF 2"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {step === 1 ? `Edit ${ipo.name}` : `Edit Schedule Dates`}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 p-6 sm:p-7 overflow-y-auto space-y-5 text-sm font-semibold text-slate-900">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fade-in">
              <Warning size={18} className="shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: DETAILS */}
          {step === 1 && (
            <form onSubmit={handleNextToDates} className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-900 font-extrabold text-sm mb-1.5">
                    IPO Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-900 font-extrabold text-sm mb-1.5">
                    Category
                  </label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-800 flex items-center justify-between shadow-2xs">
                    <span>{ipo.category || "MAINBOARD"}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-900 font-extrabold text-sm mb-1.5">
                    Minimum Investment <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 font-mono font-bold text-base">₹</span>
                    <input
                      type="number"
                      min={1}
                      required
                      value={minInvestment}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : Number(e.target.value);
                        setMinInvestment(val);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-3 text-sm font-mono font-extrabold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-900 font-extrabold text-sm mb-1.5">
                    Issue Size <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-400 font-mono font-bold text-base">₹</span>
                    <input
                      type="number"
                      min={1}
                      required
                      value={issueSize}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : Number(e.target.value);
                        setIssueSize(val);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-11 py-3 text-sm font-mono font-extrabold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all shadow-xs"
                    />
                    <span className="absolute right-4 text-sm font-mono font-bold text-slate-500">Cr</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-900 font-extrabold text-sm mb-1.5">
                    GMP Premium (%)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="18.5"
                      value={gmpPercent}
                      onChange={(e) => {
                        const val = e.target.value === "" ? "" : Number(e.target.value);
                        setGmpPercent(val);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-10 py-3 text-sm font-mono font-extrabold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all shadow-xs"
                    />
                    <span className="absolute right-4 text-sm font-mono font-extrabold text-emerald-600">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-900 font-extrabold text-sm mb-1.5">
                  Description / Group Decision <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all leading-relaxed shadow-xs"
                />
              </div>
            </form>
          )}

          {/* STEP 2: DATES */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-900 font-extrabold text-xs sm:text-sm mb-1.5">
                    Open Date
                  </label>
                  <input
                    type="text"
                    required
                    value={openDate}
                    onChange={(e) => setOpenDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-900 font-extrabold text-xs sm:text-sm mb-1.5">
                    Close Date
                  </label>
                  <input
                    type="text"
                    required
                    value={closeDate}
                    onChange={(e) => setCloseDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-900 font-extrabold text-xs sm:text-sm mb-1.5">
                    Allotment Date
                  </label>
                  <input
                    type="text"
                    required
                    value={allotmentDate}
                    onChange={(e) => setAllotmentDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-900 font-extrabold text-xs sm:text-sm mb-1.5">
                    Listing Date
                  </label>
                  <input
                    type="text"
                    required
                    value={listingDate}
                    onChange={(e) => setListingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-900 font-extrabold text-xs sm:text-sm mb-1.5">
                    Fund Unblock Date
                  </label>
                  <input
                    type="text"
                    required
                    value={fundUnblockDate}
                    onChange={(e) => setFundUnblockDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none shadow-xs"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextToDates}
                disabled={!isStep1Valid}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-extrabold text-xs sm:text-sm hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer shadow-md"
              >
                <span>Edit Dates</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} weight="bold" />
                <span>Back to Details</span>
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!isStep2Valid}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-extrabold text-xs sm:text-sm hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer shadow-md"
              >
                <FloppyDisk size={16} weight="bold" />
                <span>Save Changes</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
