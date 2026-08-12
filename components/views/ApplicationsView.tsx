"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { formatINR } from "@/lib/mockData";
import { AllotmentStatus } from "@/types/nexo";
import {
  LockKey,
  ArrowSquareOut,
  User,
  Users,
  PencilSimple,
  Trash,
  X,
  CheckCircle,
  FloppyDisk,
  ShieldCheck,
} from "@phosphor-icons/react";

export function ApplicationsView() {
  const {
    ipos,
    updateRegistrarUrl,
    selectedIpo,
    activeApplicationIpo,
    deleteApplication,
    updateApplication,
  } = useNexo();

  // Local Filter for selecting IPO / Company
  const [ipoFilter, setIpoFilter] = useState<string>(ipos[0]?.id || "ALL");
  const [viewScope, setViewScope] = useState<"ALL" | "MY">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ALLOTTED" | "AWAITING" | "NOT_ALLOTTED">("ALL");
  
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [customRegistrarUrl, setCustomRegistrarUrl] = useState("");

  // Edit Application Modal State
  const [editingApp, setEditingApp] = useState<{
    ipoId: string;
    appId: string;
    applicantName: string;
    lotCount: number;
  } | null>(null);

  // Sync filter when navigating from Home / applying for specific IPO
  useEffect(() => {
    const target = activeApplicationIpo || selectedIpo;
    if (target) {
      setIpoFilter(target.id);
    }
  }, [selectedIpo, activeApplicationIpo]);

  // Dynamically select the active IPO to display based on ipoFilter
  const selectedIpoList = useMemo(() => {
    if (!ipos || ipos.length === 0) return [];
    if (ipoFilter === "ALL") return [ipos[0]];
    const found = ipos.find((i) => i.id === ipoFilter);
    return found ? [found] : [ipos[0]];
  }, [ipos, ipoFilter]);

  // Selected active IPO object
  const activeIpo = selectedIpoList[0];

  // Calculate summary metrics for the selected active IPO
  const activeIpoMetrics = useMemo(() => {
    if (!activeIpo) return null;
    const totalApps = activeIpo.applications.length;
    let totalAmount = 0;
    let allottedAmount = 0;
    let awaitingAmount = 0;
    let notAllottedAmount = 0;

    activeIpo.applications.forEach((app) => {
      const amt = app.totalContribution || 0;
      totalAmount += amt;

      const st = app.allotmentStatus || app.status || "AWAITING";
      if (st === "ALLOTTED") allottedAmount += amt;
      else if (st === "AWAITING") awaitingAmount += amt;
      else if (st === "NOT_ALLOTTED") notAllottedAmount += amt;
    });

    return {
      totalApps,
      totalAmount,
      allottedAmount,
      awaitingAmount,
      notAllottedAmount,
    };
  }, [activeIpo]);

  // Helper renderer for read-only status pill
  const renderStatusControl = (currentStatus: AllotmentStatus) => {
    const status = currentStatus || "AWAITING";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
          status === "ALLOTTED"
            ? "bg-emerald-50 border-emerald-200/80 text-emerald-700"
            : status === "NOT_ALLOTTED"
            ? "bg-rose-50 border-rose-200/80 text-rose-700"
            : "bg-amber-50 border-amber-200/80 text-amber-700"
        }`}
      >
        {status === "ALLOTTED"
          ? "Allotted"
          : status === "NOT_ALLOTTED"
          ? "Not Allotted"
          : "Awaiting"}
      </span>
    );
  };

  const handleSaveRegistrarUrl = () => {
    if (activeIpo && customRegistrarUrl.trim()) {
      updateRegistrarUrl(activeIpo.id, customRegistrarUrl.trim());
      setIsUrlModalOpen(false);
    }
  };

  const handleSaveEditApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApp) {
      updateApplication(
        editingApp.ipoId,
        editingApp.appId,
        editingApp.applicantName,
        Math.max(1, editingApp.lotCount)
      );
      setEditingApp(null);
    }
  };

  const handleDeleteApp = (ipoId: string, appId: string, name: string) => {
    if (confirm(`Are you sure you want to delete application for ${name}?`)) {
      deleteApplication(ipoId, appId);
    }
  };

  // Sequential numbering counter
  let sequentialCounter = 0;

  return (
    <div className="space-y-5 pb-12 animate-fade-in max-w-6xl mx-auto font-sans">
      {/* TOP BAR: SELECT IPO, SCOPE TOGGLE (ALL VS MY), METRICS */}
      <div className="flex flex-wrap items-center justify-between gap-5 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-5">
          {/* Left: Select IPO / Company */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-slate-700">Select IPO:</span>
            <select
              value={ipoFilter}
              onChange={(e) => setIpoFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-900 focus:border-blue-600 focus:bg-white outline-none cursor-pointer min-w-[190px] shadow-2xs transition-all"
            >
              {ipos.map((ipo) => (
                <option key={ipo.id} value={ipo.id}>
                  {ipo.name} IPO
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-slate-200" />

          {/* SCOPE FILTER: ALL FRIENDS VS MY APPLICATIONS */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
            <button
              onClick={() => setViewScope("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewScope === "ALL"
                  ? "bg-white text-blue-600 shadow-2xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users size={14} weight="bold" />
              <span>All Friends' Applications</span>
            </button>

            <button
              onClick={() => setViewScope("MY")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewScope === "MY"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User size={14} weight="bold" />
              <span>My Applications</span>
            </button>
          </div>

          {/* Inline Summary Metrics */}
          {activeIpoMetrics && (
            <div className="flex flex-wrap items-center gap-5 text-xs">
              <div className="w-px h-6 bg-slate-200 hidden md:block" />

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Total Apps</span>
                <span className="text-sm font-extrabold text-slate-900 num-tabular">{activeIpoMetrics.totalApps}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Total Amount</span>
                <span className="text-sm font-extrabold text-slate-900 num-tabular">{formatINR(activeIpoMetrics.totalAmount)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Check Allotment Button */}
        {activeIpo && (
          <a
            href={activeIpo.registrarUrl || "https://ipostatus.kfintech.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
          >
            <span>Check Allotment</span>
            <ArrowSquareOut size={14} weight="bold" />
          </a>
        )}
      </div>

      {/* EDIT APPLICATION MODAL */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Edit Application
                </h3>
              </div>
              <button
                onClick={() => setEditingApp(null)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEditApp} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-800">
                  Applicant Name
                </label>
                <input
                  type="text"
                  required
                  value={editingApp.applicantName}
                  onChange={(e) =>
                    setEditingApp({ ...editingApp, applicantName: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-800">
                  Number of PAN Cards / Lots
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={editingApp.lotCount}
                  onChange={(e) =>
                    setEditingApp({
                      ...editingApp,
                      lotCount: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <FloppyDisk size={15} weight="bold" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN REGISTRAR URL EDIT MODAL */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Configure Registrar URL ({activeIpo?.name})
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the official IPO allotment status URL for this company's registrar.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registrar Webpage URL
              </label>
              <input
                type="url"
                value={customRegistrarUrl}
                onChange={(e) => setCustomRegistrarUrl(e.target.value)}
                placeholder="https://linkintime.co.in/initial_offer/public-issues.html"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium tracking-tight text-slate-900 focus:border-blue-600 focus:bg-white outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsUrlModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRegistrarUrl}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
              >
                Save URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE CLEAN FINTECH INVESTMENT LEDGER CONTAINER */}
      {selectedIpoList.map((ipo) => {
        const filteredApps = ipo.applications.filter((app) => {
          // Status filter
          if (statusFilter !== "ALL") {
            const st = app.allotmentStatus || app.status || "AWAITING";
            if (st !== statusFilter) return false;
          }

          // View scope filter (All vs My)
          if (viewScope === "MY") {
            const name = (app.applicantName || "").toLowerCase();
            const isMy =
              name.includes("ashay") ||
              name.includes("shivam") ||
              app.memberId === "mem_1" ||
              app.memberId === "mem_user";
            if (!isMy) return false;
          }

          return true;
        });

        return (
          <div
            key={ipo.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
          >
            {/* IPO HEADER WITH STATUS FILTER BUTTONS */}
            <div className="p-5 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {ipo.logo || ipo.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      {ipo.name} IPO
                    </h2>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      {viewScope === "MY" ? "My Submissions" : "Group Ledger"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Lot Price: {formatINR(ipo.metrics.minInvestment)} • {ipo.category || "Mainboard"}
                  </div>
                </div>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shrink-0">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === "ALL"
                      ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  All ({filteredApps.length})
                </button>
                <button
                  onClick={() => setStatusFilter("ALLOTTED")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === "ALLOTTED"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-emerald-600"
                  }`}
                >
                  Allotted
                </button>
                <button
                  onClick={() => setStatusFilter("AWAITING")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === "AWAITING"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-amber-600"
                  }`}
                >
                  Awaiting
                </button>
                <button
                  onClick={() => setStatusFilter("NOT_ALLOTTED")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === "NOT_ALLOTTED"
                      ? "bg-rose-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-rose-600"
                  }`}
                >
                  Not Allotted
                </button>
              </div>
            </div>

            {/* TABLE HEADER */}
            <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-slate-50/60 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Applicant / Contributors</div>
              <div className="col-span-2">PAN Card</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* APPLICATION LEDGER ROWS */}
            <div className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 font-medium space-y-1">
                  <div className="text-sm font-bold text-slate-700">No applications found</div>
                  <div>No applications match your scope or filter criteria.</div>
                </div>
              ) : (
                filteredApps.map((app) => {
                  sequentialCounter += 1;
                  const formattedSeq = String(sequentialCounter).padStart(2, "0");

                  const currentStatus =
                    (app.allotmentStatus as AllotmentStatus) ||
                    (app.status as AllotmentStatus) ||
                    "AWAITING";

                  const applicantName = app.applicantName || "Ashay";
                  const lotCount = app.lotCount || 1;

                  const displayNames =
                    app.participants && app.participants.length > 0
                      ? app.participants.map((p) => p.memberName).join(", ")
                      : applicantName;

                  return (
                    <React.Fragment key={app.id}>
                      {/* DESKTOP ROW (md and larger) */}
                      <div className="hidden md:grid md:grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/60 transition-colors">
                        {/* # SR No */}
                        <div className="col-span-1 font-mono text-xs font-bold text-slate-800">
                          {formattedSeq}
                        </div>

                        {/* Contributors List as name1, name2 */}
                        <div className="col-span-3">
                          <div className="text-sm font-bold text-slate-900 tracking-tight">
                            {displayNames}
                          </div>
                        </div>

                        {/* PAN Card Column */}
                        <div className="col-span-2 self-center">
                          <div className="text-xs font-semibold text-slate-700 font-mono">
                            {app.panMasked || "ABCDE2741D"}
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="col-span-2 text-right self-center font-mono text-sm font-bold text-slate-900 num-tabular">
                          {formatINR(app.totalContribution)}
                        </div>

                        {/* Status */}
                        <div className="col-span-2 text-center self-center">
                          {renderStatusControl(currentStatus)}
                        </div>

                        {/* ACTIONS: EDIT & DELETE */}
                        <div className="col-span-2 flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              setEditingApp({
                                ipoId: ipo.id,
                                appId: app.id,
                                applicantName: applicantName,
                                lotCount: lotCount,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Application"
                          >
                            <PencilSimple size={16} weight="bold" />
                          </button>
                          <button
                            onClick={() => handleDeleteApp(ipo.id, app.id, applicantName)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Application"
                          >
                            <Trash size={16} weight="bold" />
                          </button>
                        </div>
                      </div>

                      {/* MOBILE CARD VIEW (< md screens) */}
                      <div className="md:hidden p-4 border-b border-slate-100/80 flex flex-col gap-3 hover:bg-slate-50/50 transition-colors">
                        {/* Top: # SR + Names + Edit/Delete */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                              #{formattedSeq}
                            </span>
                            <span className="text-sm font-bold text-slate-900 tracking-tight truncate">
                              {displayNames}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() =>
                                setEditingApp({
                                  ipoId: ipo.id,
                                  appId: app.id,
                                  applicantName: applicantName,
                                  lotCount: lotCount,
                                })
                              }
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit Application"
                            >
                              <PencilSimple size={16} weight="bold" />
                            </button>
                            <button
                              onClick={() => handleDeleteApp(ipo.id, app.id, applicantName)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Application"
                            >
                              <Trash size={16} weight="bold" />
                            </button>
                          </div>
                        </div>

                        {/* Middle: PAN + Amount */}
                        <div className="flex items-center justify-between bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/60 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-medium">PAN</span>
                            <span className="font-mono font-bold text-slate-800">{app.panMasked || "ABCDE2741D"}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase font-medium">Total Amount</span>
                            <span className="font-mono font-bold text-slate-900 text-sm">{formatINR(app.totalContribution)}</span>
                          </div>
                        </div>

                        {/* Bottom: Status */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-semibold text-slate-500">Status</span>
                          <div>{renderStatusControl(currentStatus)}</div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* FOOTER NOTE */}
            <div className="px-6 py-3 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>Showing {filteredApps.length} application(s) for {ipo.name}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <LockKey size={12} />
                <span>Encrypted Group Ledger</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
