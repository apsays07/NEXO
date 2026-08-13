"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { createIPO as createIPOApi } from "@/src/features/ipo/api";
import { X, Plus, CircleNotch, Warning } from "@phosphor-icons/react";

export function AddIPOModal() {
  const { isAddIpoModalOpen, closeAddIpoModal, refreshIpos } = useNexo();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState<"MAINBOARD" | "SME">("MAINBOARD");
  const [priceMin, setPriceMin] = useState<number>(245);
  const [priceMax, setPriceMax] = useState<number>(258);
  const [lotSize, setLotSize] = useState<number>(58);
  const [closeDate, setCloseDate] = useState("2026-08-14");
  const [decision, setDecision] = useState<"APPLY" | "WATCH" | "SKIP">("APPLY");
  const [gmpPercent, setGmpPercent] = useState<number>(18.5);
  const [thesis, setThesis] = useState("");

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (!isAddIpoModalOpen) {
      setIsSuccess(false);
      setIsSubmitting(false);
      setValidationError(null);
    }
  }, [isAddIpoModalOpen]);

  if (!isAddIpoModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Client-side validation
    if (!name.trim()) {
      setValidationError("IPO name is required.");
      return;
    }
    const finalCompany = company.trim() || `${name.trim()} Limited`;
    if (priceMin <= 0) {
      setValidationError("Price minimum must be greater than zero.");
      return;
    }
    if (priceMax < priceMin) {
      setValidationError("Price maximum must be greater than or equal to price minimum.");
      return;
    }
    if (lotSize <= 0) {
      setValidationError("Lot size must be greater than zero.");
      return;
    }
    if (!closeDate.trim()) {
      setValidationError("Close date is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createIPOApi({
        name: name.trim(),
        company: finalCompany,
        type,
        priceMin,
        priceMax,
        lotSize,
        minimumInvestment: priceMax * lotSize,
        closeDate: closeDate.trim(),
        decision,
        gmpPercent: Number(gmpPercent) || 0,
        status: "APPLYING",
        stage: "APPLICATION",
        thesis: thesis.trim(),
      });

      if (refreshIpos) {
        await refreshIpos();
      }

      // Reset form
      setName("");
      setCompany("");
      setThesis("");
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: any) {
      setValidationError(err.message || "Failed to create IPO opportunity");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    closeAddIpoModal();
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-xs p-4 animate-fade-in font-sans">
        <div className="w-full max-w-md bg-surface border border-line rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4 animate-modal-pop-in">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-positive-soft border border-positive/30 flex items-center justify-center text-positive shadow-md">
              <svg className="w-8 h-8 animate-check-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-h4 font-semibold text-ink tracking-tight">
              IPO Opportunity Created
            </h3>
            <p className="text-small text-ink-tertiary font-medium px-4 leading-relaxed">
              The new IPO opportunity has been successfully saved to MongoDB and published to your workspace.
            </p>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-small shadow-xs transition-all active:scale-98 cursor-pointer"
          >
            Okay, got it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-lg bg-surface border border-line rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-soft border border-accent/20 text-accent flex items-center justify-center font-bold">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-h4 font-semibold text-ink">
                Add IPO Opportunity
              </h3>
              <p className="text-caption text-ink-tertiary font-medium">
                Create a new opportunity saved directly to MongoDB
              </p>
            </div>
          </div>
          <button
            onClick={closeAddIpoModal}
            className="p-2 rounded-xl text-ink-tertiary hover:text-ink hover:bg-surface-alt transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-small font-medium">
          {validationError && (
            <div className="p-3 rounded-xl bg-negative-soft border border-negative/30 text-negative text-small font-semibold flex items-center gap-2">
              <Warning size={16} />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. IPO NAME & COMPANY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-caption font-semibold text-ink-secondary mb-1">
                IPO Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dhoot Transmission"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none"
              />
            </div>
            <div>
              <label className="block text-caption font-semibold text-ink-secondary mb-1">
                Company Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Dhoot Transmission Pvt Ltd"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none"
              />
            </div>
          </div>

          {/* 2. IPO TYPE & GMP PERCENTAGE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-caption font-semibold text-ink-secondary mb-1">
                IPO Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none cursor-pointer"
              >
                <option value="MAINBOARD">Mainboard</option>
                <option value="SME">SME</option>
              </select>
            </div>
            <div>
              <label className="block text-caption font-semibold text-ink-secondary mb-1">
                GMP Percentage (%) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="e.g. 18.5"
                value={gmpPercent}
                onChange={(e) => setGmpPercent(Number(e.target.value) || 0)}
                className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none"
              />
            </div>
          </div>

          {/* 3. PRICE BAND & LOT SIZE */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-caption font-semibold text-ink-secondary mb-1">
                Price Min (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="245"
                value={priceMin}
                onChange={(e) => setPriceMin(Number(e.target.value))}
                className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink num-tabular focus:border-accent focus:bg-surface outline-none"
              />
            </div>
            <div>
              <label className="block text-caption font-semibold text-ink-secondary mb-1">
                Price Max (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="258"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink num-tabular focus:border-accent focus:bg-surface outline-none"
              />
            </div>
            <div>
              <label className="block text-caption font-semibold text-ink-secondary mb-1">
                Lot Size *
              </label>
              <input
                type="number"
                required
                placeholder="58"
                value={lotSize}
                onChange={(e) => setLotSize(Number(e.target.value))}
                className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink num-tabular focus:border-accent focus:bg-surface outline-none"
              />
            </div>
          </div>

          {/* 4. CLOSE DATE */}
          <div>
            <label className="block text-caption font-semibold text-ink-secondary mb-1">
              Close Date *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 2026-08-14"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none"
            />
          </div>

          {/* 5. THESIS */}
          <div>
            <label className="block text-caption font-semibold text-ink-secondary mb-1">
              Investment Thesis
            </label>
            <textarea
              rows={3}
              placeholder="Add analysis, notes, valuation rationale, or comments..."
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              className="w-full bg-surface-alt border border-line-strong rounded-xl p-3 text-small text-ink font-normal focus:border-accent focus:bg-surface outline-none leading-relaxed"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={closeAddIpoModal}
              className="px-4 py-2 rounded-xl border border-line text-small font-semibold text-ink-secondary hover:bg-surface-alt transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-70 text-white font-semibold text-small shadow-xs transition-all active:scale-98 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <CircleNotch size={16} className="animate-spin text-white" />
                  <span>Saving to MongoDB...</span>
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

