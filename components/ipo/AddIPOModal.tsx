"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { Button } from "../ui/Button";
import { X, Plus, CircleNotch } from "@phosphor-icons/react";

export function AddIPOModal() {
  const { isAddIpoModalOpen, closeAddIpoModal, addNewIpo } = useNexo();

  const [name, setName] = useState("");
  const [priceMax, setPriceMax] = useState<number>(270);
  const [lotSize, setLotSize] = useState<number>(50);
  const [closeDate, setCloseDate] = useState("20 Aug 2026");
  const [thesis, setThesis] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (!isAddIpoModalOpen) {
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isAddIpoModalOpen]);

  if (!isAddIpoModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);

    setTimeout(() => {
      addNewIpo({
        name,
        company: `${name} Limited`,
        priceMin: Math.max(1, Math.round(priceMax * 0.9)),
        priceMax: priceMax || 270,
        lotSize: lotSize || 50,
        openDate: "18 Aug 2026",
        closeDate: closeDate || "20 Aug 2026",
        recommendation: "APPLY",
        thesis: thesis || "Primary analysis for group participation.",
      });

      // Reset form
      setName("");
      setThesis("");
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleClose = () => {
    setIsSuccess(false);
    closeAddIpoModal();
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4 animate-modal-pop-in">
          {/* Success Check Ring */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 animate-pulse-glow shadow-md">
              <svg className="w-8 h-8 animate-check-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              IPO Opportunity Created
            </h3>
            <p className="text-xs text-slate-500 font-medium px-4 leading-relaxed">
              The new IPO opportunity has been successfully published to the group's active watchlist.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Okay, got it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0F172A]">
                Add IPO Opportunity
              </h3>
              <p className="text-xs text-[#64748B] font-medium">
                Create a new opportunity for group evaluation
              </p>
            </div>
          </div>
          <button
            onClick={closeAddIpoModal}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* 1. IPO NAME */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              IPO Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dhoot Transmission"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-none font-bold"
            />
          </div>

          {/* 2. PRICE & LOT SIZE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Offer Price (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="258"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-none font-bold num-tabular"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Lot Size (Shares) *
              </label>
              <input
                type="number"
                required
                placeholder="58"
                value={lotSize}
                onChange={(e) => setLotSize(Number(e.target.value))}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-none font-bold num-tabular"
              />
            </div>
          </div>

          {/* 3. LAST DATE */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Last Date to Apply *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 20 Aug 2026"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2.5 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-none font-bold"
            />
          </div>

          {/* 4. COMMENT BOX */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] mb-1">
              Comments / Investment Rationale
            </label>
            <textarea
              rows={4}
              placeholder="Add analysis, notes, valuation rationale, or comments..."
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0F172A] focus:border-[#2563EB] focus:outline-none font-medium leading-relaxed"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={closeAddIpoModal}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <CircleNotch size={14} className="animate-spin text-white" />
                  <span>Creating Opportunity...</span>
                </>
              ) : (
                "Create IPO Opportunity"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
