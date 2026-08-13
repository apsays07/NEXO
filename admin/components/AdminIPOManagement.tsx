"use client";

import React, { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { IPOOpportunity } from "../types/nexo";
import { Plus, Trash, CheckCircle, Buildings, PencilSimple } from "@phosphor-icons/react";
import { AddIPODrawer } from "./AddIPODrawer";
import { EditIPODrawer } from "./EditIPODrawer";

export function AdminIPOManagement() {
  const { ipos, removeIPO } = useAdmin();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIpo, setEditingIpo] = useState<IPOOpportunity | null>(null);
  const [selectedIpoToRemove, setSelectedIpoToRemove] = useState<IPOOpportunity | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Filter visible IPOs for management list
  const visibleIpos = ipos.filter((ipo) => !ipo.isHidden);

  const handleConfirmRemove = async () => {
    if (!selectedIpoToRemove) return;

    const res = await removeIPO(selectedIpoToRemove.id);
    if (res.success) {
      setFeedbackMsg(res.message || `✓ IPO removed. ${selectedIpoToRemove.name} is no longer visible on the user website.`);
    } else {
      setFeedbackMsg(`❌ ${res.message || "Failed to remove IPO."}`);
    }

    setSelectedIpoToRemove(null);

    // Auto-clear toast after 5 seconds
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 5000);
  };

  const handleAddSuccess = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 5000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 p-4 sm:p-6 md:p-8 pb-16 font-sans">
      {/* Toast Feedback Alert */}
      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle size={18} className="text-emerald-600 shrink-0" weight="fill" />
            <span>{feedbackMsg}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-emerald-600 hover:text-emerald-800 font-extrabold text-sm ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              ADMIN
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-500">Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            IPO MANAGEMENT
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Manage IPOs displayed on the user website.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} weight="bold" />
          <span>+ Add IPO</span>
        </button>
      </div>

      {/* ACTIVE IPO LIST TABLE / ROW CARDS */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Active User Website IPOs ({visibleIpos.length})
          </h3>
        </div>

        {visibleIpos.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Buildings size={36} className="text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Active IPOs</h4>
            <p className="text-xs text-slate-500">
              Click "+ Add IPO" to publish an IPO to the user website.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleIpos.map((ipo) => (
              <div
                key={ipo.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-extrabold text-slate-900 truncate">
                      {ipo.name}
                    </h4>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {ipo.category || "MAINBOARD"}
                    </span>
                    {ipo.metrics?.gmpPercent !== undefined && (
                      <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        GMP +{ipo.metrics.gmpPercent}%
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                    <div>
                      Minimum Investment:{" "}
                      <span className="font-bold font-mono text-slate-900">
                        ₹{ipo.metrics.minInvestment.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {ipo.metrics.issueSize && (
                      <div>
                        Issue Size:{" "}
                        <span className="font-bold text-slate-900">{ipo.metrics.issueSize}</span>
                      </div>
                    )}
                    <div>
                      Closes:{" "}
                      <span className="font-bold text-slate-900">
                        {ipo.metrics.closeDate || "Soon"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => setEditingIpo(ipo)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                  >
                    <PencilSimple size={15} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setSelectedIpoToRemove(ipo)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash size={15} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REMOVE CONFIRMATION MODAL */}
      {selectedIpoToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash size={24} />
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">Remove IPO?</h3>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-slate-900">{selectedIpoToRemove.name}</span> from the user website?
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                This will hide the IPO from members while keeping application references safe.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedIpoToRemove(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
              >
                Remove IPO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD IPO DRAWER */}
      <AddIPODrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* EDIT IPO DRAWER */}
      <EditIPODrawer
        ipo={editingIpo}
        isOpen={!!editingIpo}
        onClose={() => setEditingIpo(null)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
