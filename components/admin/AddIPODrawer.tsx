"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { X, Warning } from "@phosphor-icons/react";

interface AddIPODrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export function AddIPODrawer({ isOpen, onClose, onSuccess }: AddIPODrawerProps) {
  const { createIPO } = useNexo();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Mainboard" | "SME">("Mainboard");
  const [minInvestment, setMinInvestment] = useState<number | "">(15000);
  const [issueSize, setIssueSize] = useState<number | "">(2400);
  const [description, setDescription] = useState("");
  const [closeDate, setCloseDate] = useState("28 Aug 2026");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const numMinInvestment = typeof minInvestment === "number" ? minInvestment : 0;
  const numIssueSize = typeof issueSize === "number" ? issueSize : 0;

  const isNameValid = name.trim().length > 0;
  const isMinInvValid = numMinInvestment > 0;
  const isIssueSizeValid = numIssueSize > 0;
  const isDescriptionValid = description.trim().length > 0;
  const isDateValid = closeDate.trim().length > 0;

  const isValid =
    isNameValid &&
    isMinInvValid &&
    isIssueSizeValid &&
    isDescriptionValid &&
    isDateValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isValid) {
      setErrorMsg("Please fill in all required fields accurately.");
      return;
    }

    const res = createIPO({
      name: name.trim(),
      minInvestment: numMinInvestment,
      issueSize: numIssueSize,
      description: description.trim(),
      closeDate: closeDate.trim(),
    });

    if (res.success) {
      if (onSuccess) {
        onSuccess(res.message || `✓ IPO added successfully. ${name} is now visible on the user website.`);
      }
      setName("");
      setCategory("Mainboard");
      setMinInvestment(15000);
      setIssueSize(2400);
      setDescription("");
      setCloseDate("28 Aug 2026");
      onClose();
    } else {
      setErrorMsg(res.message || "Failed to create IPO.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Right Drawer */}
      <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-surface border-l border-line shadow-2xl z-50 flex flex-col justify-between animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-line bg-surface-alt/70 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-ink tracking-tight">
              Add New IPO Opportunity
            </h2>
            <p className="text-xs font-medium text-ink-secondary">
              Publish a new IPO opportunity for group members to evaluate and apply.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-tertiary hover:text-ink hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-5 overflow-y-auto space-y-4 text-xs font-semibold text-ink">
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
              <Warning size={16} className="shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. IPO Name */}
          <div>
            <label className="block text-ink font-bold mb-1">
              IPO Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ABC Industries IPO"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-alt border border-line rounded-xl px-3.5 py-2.5 text-xs font-bold text-ink focus:bg-surface focus:border-accent focus:outline-none transition-all"
            />
          </div>

          {/* 2. Category Selector */}
          <div>
            <label className="block text-ink font-bold mb-1">Category</label>
            <div className="grid grid-cols-2 gap-2">
              {(["Mainboard", "SME"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    category === cat
                      ? "bg-accent/10 border-accent text-accent"
                      : "bg-surface-alt border-line text-ink-secondary hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Minimum Investment & Issue Size Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ink font-bold mb-1">
                Minimum Investment <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-ink-tertiary font-mono font-bold">₹</span>
                <input
                  type="number"
                  min={1}
                  required
                  placeholder="15000"
                  value={minInvestment}
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : Number(e.target.value);
                    setMinInvestment(val);
                  }}
                  className="w-full bg-surface-alt border border-line rounded-xl pl-7 pr-3 py-2.5 text-xs font-mono font-bold text-ink focus:bg-surface focus:border-accent focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-ink font-bold mb-1">
                Issue Size <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-ink-tertiary font-mono font-bold">₹</span>
                <input
                  type="number"
                  min={1}
                  required
                  placeholder="2400"
                  value={issueSize}
                  onChange={(e) => {
                    const val = e.target.value === "" ? "" : Number(e.target.value);
                    setIssueSize(val);
                  }}
                  className="w-full bg-surface-alt border border-line rounded-xl pl-7 pr-9 py-2.5 text-xs font-mono font-bold text-ink focus:bg-surface focus:border-accent focus:outline-none transition-all"
                />
                <span className="absolute right-3 text-xs font-mono font-bold text-ink-tertiary">Cr</span>
              </div>
            </div>
          </div>

          {/* 4. Description / Group Decision */}
          <div>
            <label className="block text-ink font-bold mb-1">
              Description / Thesis <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Leading manufacturer with strong domestic market share and robust financials..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-alt border border-line rounded-xl p-3 text-xs font-medium text-ink focus:bg-surface focus:border-accent focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* 5. Close Date */}
          <div>
            <label className="block text-ink font-bold mb-1">
              Application Close Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 28 Aug 2026"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              className="w-full bg-surface-alt border border-line rounded-xl px-3.5 py-2.5 text-xs font-bold text-ink focus:bg-surface focus:border-accent focus:outline-none transition-all"
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-line bg-surface-alt/70 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-line text-xs font-bold text-ink-secondary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
              isValid
                ? "bg-accent text-white hover:bg-accent-hover active:scale-[0.98]"
                : "bg-surface-alt text-ink-tertiary cursor-not-allowed border border-line"
            }`}
          >
            Add IPO Opportunity
          </button>
        </div>
      </aside>
    </div>
  );
}

