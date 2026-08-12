"use client";

import React, { useState, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { updateIPO as updateIPOApi } from "@/src/features/ipo/api";
import { X, PencilSimple, CircleNotch, Warning } from "@phosphor-icons/react";
import { IPOOpportunity } from "@/types/nexo";

interface EditIPOModalProps {
  ipo: IPOOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditIPOModal({ ipo, isOpen, onClose }: EditIPOModalProps) {
  const { refreshIpos } = useNexo();

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState<"MAINBOARD" | "SME">("MAINBOARD");
  const [priceMin, setPriceMin] = useState<number>(245);
  const [priceMax, setPriceMax] = useState<number>(258);
  const [lotSize, setLotSize] = useState<number>(58);
  const [closeDate, setCloseDate] = useState("");
  const [decision, setDecision] = useState<"APPLY" | "WATCH" | "SKIP">("APPLY");
  const [thesis, setThesis] = useState("");

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ipo && isOpen) {
      setName(ipo.name || "");
      setCompany(ipo.company || "");
      setType(ipo.category === "SME" ? "SME" : "MAINBOARD");
      setPriceMin(ipo.metrics?.priceBand?.min || 100);
      setPriceMax(ipo.metrics?.priceBand?.max || 110);
      setLotSize(ipo.metrics?.lotSize || 50);
      setCloseDate(ipo.metrics?.closeDate || "");
      const rec = String(ipo.recommendation);
      setDecision(rec === "WATCH" ? "WATCH" : rec === "AVOID" || rec === "SKIP" ? "SKIP" : "APPLY");
      setThesis(ipo.thesis || "");
      setValidationError(null);
      setIsSubmitting(false);
    }
  }, [ipo, isOpen]);

  if (!isOpen || !ipo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError("IPO name is required.");
      return;
    }
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
      await updateIPOApi(ipo.id, {
        name: name.trim(),
        company: company.trim() || ipo.company,
        type,
        priceMin,
        priceMax,
        lotSize,
        minimumInvestment: priceMax * lotSize,
        closeDate: closeDate.trim(),
        decision,
        thesis: thesis.trim(),
      });

      if (refreshIpos) {
        await refreshIpos();
      }

      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setValidationError(err.message || "Failed to update IPO opportunity");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-lg bg-surface border border-line rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-soft border border-accent/20 text-accent flex items-center justify-center font-bold">
              <PencilSimple size={18} />
            </div>
            <div>
              <h3 className="text-h4 font-semibold text-ink">
                Edit IPO Opportunity
              </h3>
              <p className="text-caption text-ink-tertiary font-medium">
                Update parameters saved in MongoDB
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
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
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none"
              />
            </div>
          </div>

          {/* 2. IPO TYPE & DECISION */}
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
                Group Decision
              </label>
              <select
                value={decision}
                onChange={(e) => setDecision(e.target.value as any)}
                className="w-full bg-surface-alt border border-line-strong rounded-xl px-3 py-2 text-small font-semibold text-ink focus:border-accent focus:bg-surface outline-none cursor-pointer"
              >
                <option value="APPLY">APPLY</option>
                <option value="WATCH">WATCH</option>
                <option value="SKIP">SKIP</option>
              </select>
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
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              className="w-full bg-surface-alt border border-line-strong rounded-xl p-3 text-small text-ink font-normal focus:border-accent focus:bg-surface outline-none leading-relaxed"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-line flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
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
                  <span>Updating...</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
