"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { X, CheckCircle, Warning } from "@phosphor-icons/react";

interface AddIPODrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export function AddIPODrawer({ isOpen, onClose, onSuccess }: AddIPODrawerProps) {
  const { createIPO } = useNexo();

  const [name, setName] = useState("");
  const [minInvestment, setMinInvestment] = useState<number | "">(15000);
  const [issueSize, setIssueSize] = useState<number | "">(2400);
  const [description, setDescription] = useState("");
  const [closeDate, setCloseDate] = useState("28 Aug 2026");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const numMinInvestment = typeof minInvestment === "number" ? minInvestment : 0;
  const numIssueSize = typeof issueSize === "number" ? issueSize : 0;

  // Validation Rules
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
      if (!isDateValid) {
        setErrorMsg("Please enter a valid close date.");
      } else {
        setErrorMsg("Please fill in all required fields accurately.");
      }
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
      // Reset form
      setName("");
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
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Right Drawer (Desktop: 440px width, Mobile: Full width) */}
      <aside className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col justify-between animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Add IPO
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Add an IPO to the user website.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-5 overflow-y-auto space-y-4 text-xs font-semibold text-slate-800">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
              <Warning size={16} className="shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. IPO Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              IPO Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ABC Industries IPO"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* 2. Minimum Investment & Issue Size Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Minimum Investment <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-mono font-bold">₹</span>
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-7 pr-3 py-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Issue Size <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 font-mono font-bold">₹</span>
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-7 pr-9 py-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all"
                />
                <span className="absolute right-3 text-xs font-mono font-bold text-slate-500">Cr</span>
              </div>
            </div>
          </div>

          {/* 3. Description / Group Decision */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Description / Group Decision <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Leading automotive component manufacturer with strong domestic and export presence..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all leading-relaxed placeholder:text-slate-400"
            />
          </div>

          {/* 4. Close Date */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Application Close Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 28 Aug 2026"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-all placeholder:text-slate-400"
            />
            {!isDateValid && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">
                Please enter a valid close date.
              </p>
            )}
          </div>

          {/* 5. Category (Mainboard Only) */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Category
            </label>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-black text-slate-700 flex items-center justify-between">
              <span>MAINBOARD</span>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-mono border border-blue-200">
                Default
              </span>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
              isValid
                ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Add IPO
          </button>
        </div>
      </aside>
    </div>
  );
}
