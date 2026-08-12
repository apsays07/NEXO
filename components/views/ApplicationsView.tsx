"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { formatINR } from "@/lib/mockData";
import { AllotmentStatus, Application } from "@/types/nexo";
import {
  CheckCircle,
  LockKey,
  ArrowSquareOut,
  Gear,
  PencilSimple,
  Trash,
  X,
} from "@phosphor-icons/react";

export function ApplicationsView() {
  const {
    ipos,
    currentUserRole,
    updateRegistrarUrl,
    selectedIpo,
    activeApplicationIpo,
    currentMember,
    updateApplication,
    deleteApplication,
  } = useNexo();

  // Local Filter for selecting IPO / Company
  const [ipoFilter, setIpoFilter] = useState<string>(ipos[0]?.id || "ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ALLOTTED" | "AWAITING" | "NOT_ALLOTTED">("ALL");
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [customRegistrarUrl, setCustomRegistrarUrl] = useState("");

  // Self Edit Modal state
  const [editAppModalOpen, setEditAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [editingIpoId, setEditingIpoId] = useState<string>("");
  const [editName, setEditName] = useState("");
  const [editPan, setEditPan] = useState("");
  const [editAmount, setEditAmount] = useState<number>(15000);

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

  // Calculate sequential numbering across displayed applications
  let sequentialCounter = 0;

  // Helper renderer for read-only status pill
  const renderStatusControl = (
    _ipoId: string,
    _appId: string,
    currentStatus: AllotmentStatus
  ) => {
    const status = currentStatus || "AWAITING";

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold border ${
          status === "ALLOTTED"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : status === "NOT_ALLOTTED"
            ? "bg-rose-50 border-rose-200 text-rose-700"
            : "bg-amber-50 border-amber-200 text-amber-700"
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

  const handleOpenEditSelfModal = (ipoId: string, app: Application) => {
    setEditingIpoId(ipoId);
    setEditingApp(app);
    setEditName(app.applicantName || currentMember?.name || "Niranjan");
    setEditPan(app.panMasked || currentMember?.panMasked || "XXXXXXXX41");
    setEditAmount(app.totalContribution || 15000);
    setEditAppModalOpen(true);
  };

  const handleSaveSelfEdit = () => {
    if (editingIpoId && editingApp) {
      updateApplication(editingIpoId, editingApp.id, {
        applicantName: editName.trim(),
        panMasked: editPan.trim(),
        totalContribution: Number(editAmount) || 0,
      });
      setEditAppModalOpen(false);
      setEditingApp(null);
    }
  };

  const handleDeleteSelfApp = (ipoId: string, appId: string) => {
    if (window.confirm("Are you sure you want to delete your application?")) {
      deleteApplication(ipoId, appId);
    }
  };

  return (
    <div className="w-full max-w-full space-y-6 pb-12 animate-fade-in">
      {/* TOP BAR: ALL IN ONE LINE (FULL WIDTH & PROMINENT SPACING) */}
      <div className="flex flex-wrap items-center justify-between gap-6 p-6 md:p-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-8 lg:gap-10">
          {/* Left: Select IPO / Company */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-sm font-extrabold text-slate-700">Select IPO / Company:</span>
            <select
              value={ipoFilter}
              onChange={(e) => setIpoFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-extrabold text-slate-900 focus:border-blue-600 focus:bg-white outline-none cursor-pointer min-w-[230px] shadow-2xs transition-all"
            >
              {ipos.map((ipo) => (
                <option key={ipo.id} value={ipo.id}>
                  {ipo.name} IPO
                </option>
              ))}
            </select>
          </div>

          {/* Vertical Divider */}
          <div className="hidden sm:block w-px h-10 bg-slate-200" />

          {/* Inline Summary Metrics (Prominent Font Sizes) */}
          {activeIpoMetrics && (
            <div className="flex flex-wrap items-center gap-8 text-xs">
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">Applications</span>
                <span className="text-xl md:text-2xl font-black text-slate-900 num-tabular">{activeIpoMetrics.totalApps}</span>
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">Total Amount</span>
                <span className="text-xl md:text-2xl font-black text-slate-900 num-tabular">{formatINR(activeIpoMetrics.totalAmount)}</span>
              </div>

              <div className="w-px h-8 bg-slate-200 hidden sm:block mx-1" />

              <div>
                <span className="text-[11px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">Allotted</span>
                <span className="text-xl md:text-2xl font-black text-emerald-600 num-tabular">{formatINR(activeIpoMetrics.allottedAmount)}</span>
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">Awaiting</span>
                <span className="text-xl md:text-2xl font-black text-amber-600 num-tabular">{formatINR(activeIpoMetrics.awaitingAmount)}</span>
              </div>
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 block mb-1 uppercase tracking-wider">Not Allotted</span>
                <span className="text-xl md:text-2xl font-black text-rose-600 num-tabular">{formatINR(activeIpoMetrics.notAllottedAmount)}</span>
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
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm shadow-sm transition-all cursor-pointer shrink-0"
          >
            <span>Check Allotment</span>
            <ArrowSquareOut size={16} weight="bold" />
          </a>
        )}
      </div>

      {/* EDIT SELF APPLICATION MODAL */}
      {editAppModalOpen && editingApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Edit My Application ({editingApp.applicationNumber || "Self"})
              </h3>
              <button
                onClick={() => setEditAppModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Applicant Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-medium focus:border-blue-600 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  PAN Card Number
                </label>
                <input
                  type="text"
                  value={editPan}
                  onChange={(e) => setEditPan(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-medium focus:border-blue-600 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contribution Amount (₹)
                </label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 font-mono font-medium focus:border-blue-600 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditAppModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSelfEdit}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-extrabold hover:bg-blue-700 shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL WIDTH FINTECH INVESTMENT LEDGER CONTAINER */}
      {selectedIpoList.map((ipo) => {
        const filteredApps = ipo.applications.filter((app) => {
          if (statusFilter === "ALL") return true;
          const st = app.allotmentStatus || app.status || "AWAITING";
          return st === statusFilter;
        });

        return (
          <div
            key={ipo.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden w-full"
          >
            {/* IPO HEADER WITH ALLOTTED / NOT ALLOTTED STATUS FILTER */}
            <div className="p-6 md:p-7 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {ipo.logo || ipo.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-extrabold text-slate-900 tracking-tight">
                    {ipo.name} IPO
                  </h2>
                  <div className="text-xs md:text-sm text-slate-500 font-semibold mt-0.5">
                    Lot Price: {formatINR(ipo.metrics.minInvestment)} • {ipo.category || "Mainboard"}
                  </div>
                </div>
              </div>

              {/* Status Filter Buttons at company name line */}
              <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 shrink-0">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    statusFilter === "ALL"
                      ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  All ({ipo.applications.length})
                </button>
                <button
                  onClick={() => setStatusFilter("ALLOTTED")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    statusFilter === "ALLOTTED"
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-emerald-600"
                  }`}
                >
                  Allotted
                </button>
                <button
                  onClick={() => setStatusFilter("AWAITING")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    statusFilter === "AWAITING"
                      ? "bg-amber-600 text-white shadow-2xs"
                      : "text-slate-600 hover:text-amber-600"
                  }`}
                >
                  Awaiting
                </button>
                <button
                  onClick={() => setStatusFilter("NOT_ALLOTTED")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
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
            <div className="hidden md:grid grid-cols-12 px-8 py-4 bg-slate-50/70 border-b border-slate-100 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-3">Applicant / Contributors</div>
              <div className="col-span-3">PAN Card</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right">Status / Actions</div>
            </div>

            {/* APPLICATION LEDGER ROWS */}
            <div className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400 font-medium">
                  No applications match your filter criteria.
                </div>
              ) : (
                filteredApps.map((app) => {
                  sequentialCounter += 1;
                  const formattedSeq = String(sequentialCounter).padStart(2, "0");
                  const canonicalType =
                    app.type === "SOLO" || app.type === "INDIVIDUAL"
                      ? "INDIVIDUAL"
                      : "COMBINED";

                  const currentStatus =
                    (app.allotmentStatus as AllotmentStatus) ||
                    (app.status as AllotmentStatus) ||
                    "AWAITING";

                  // Determine if this application belongs strictly to self (Niranjan)
                  const selfId = currentMember?.id || "mem_1";
                  const selfName = currentMember?.name || "Niranjan";

                  const isSelf =
                    app.memberId === selfId ||
                    app.applicantName?.toLowerCase() === selfName.toLowerCase() ||
                    app.participants?.some(
                      (p) =>
                        p.memberId === selfId ||
                        p.memberName?.toLowerCase() === selfName.toLowerCase()
                    );

                  if (canonicalType === "INDIVIDUAL") {
                    // INDIVIDUAL APPLICATION ROW
                    return (
                      <div
                        key={app.id}
                        className="px-8 py-6 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 md:gap-0 hover:bg-slate-50/50 transition-colors"
                      >
                        {/* # SR No (Dark Font) */}
                        <div className="col-span-1 font-mono text-sm font-black text-slate-800">
                          {formattedSeq}
                        </div>

                        {/* Applicant Name */}
                        <div className="col-span-3">
                          <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <span>{app.applicantName || "Niranjan"}</span>
                            {isSelf && (
                              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                                You
                              </span>
                            )}
                          </div>
                        </div>

                        {/* PAN Card Column (Medium Dark) */}
                        <div className="col-span-3">
                          <div className="text-sm font-bold text-slate-700 font-mono">
                            {app.panMasked || "XXXXXXXX41"}
                          </div>
                        </div>

                        {/* Type Badge */}
                        <div className="col-span-1">
                          <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                            Individual
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="col-span-2 text-right font-mono text-base font-extrabold text-slate-900 num-tabular">
                          {formatINR(app.totalContribution)}
                        </div>

                        {/* Status + Edit & Delete Actions */}
                        <div className="col-span-2 text-right flex items-center justify-end gap-2.5">
                          {renderStatusControl(ipo.id, app.id, currentStatus)}

                          <div className="flex items-center gap-1.5 ml-1">
                            {isSelf && (
                              <button
                                onClick={() => handleOpenEditSelfModal(ipo.id, app)}
                                title="Edit My Application"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                              >
                                <PencilSimple size={16} />
                              </button>
                            )}
                            {currentUserRole === "ADMIN" && (
                              <button
                                onClick={() => handleDeleteSelfApp(ipo.id, app.id)}
                                title="Delete Application (Admin)"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                              >
                                <Trash size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // COMBINED APPLICATION ROW
                    return (
                      <div
                        key={app.id}
                        className="px-8 py-6 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 md:gap-0 hover:bg-slate-50/50 transition-colors"
                      >
                        {/* # SR No (Dark Font) */}
                        <div className="col-span-1 font-mono text-sm font-black text-slate-800 self-start pt-0.5">
                          {formattedSeq}
                        </div>

                        {/* Contributors List */}
                        <div className="col-span-3 space-y-2">
                          {app.participants.map((p, idx) => {
                            const isPartSelf =
                              p.memberId === selfId ||
                              p.memberName?.toLowerCase() === selfName.toLowerCase();

                            return (
                              <div key={idx} className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <span>{p.memberName}</span>
                                {isPartSelf && (
                                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                                    You
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* PAN Card Column (Medium Dark) */}
                        <div className="col-span-3 self-center">
                          <div className="text-sm font-bold text-slate-700 font-mono">
                            {app.panMasked || "XXXXXXXX41"}
                          </div>
                        </div>

                        {/* Type Badge */}
                        <div className="col-span-1 self-center">
                          <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                            Combined
                          </span>
                        </div>

                        {/* Individual Contribution Amounts in AMOUNT Column */}
                        <div className="col-span-2 text-right space-y-2 self-center font-mono text-base font-extrabold text-slate-900 num-tabular">
                          {app.participants.map((p, idx) => (
                            <div key={idx}>{formatINR(p.contribution)}</div>
                          ))}
                        </div>

                        {/* Single Combined Status + Edit & Delete Actions */}
                        <div className="col-span-2 text-right self-center flex items-center justify-end gap-2.5">
                          {renderStatusControl(ipo.id, app.id, currentStatus)}

                          <div className="flex items-center gap-1.5 ml-1">
                            {isSelf && (
                              <button
                                onClick={() => handleOpenEditSelfModal(ipo.id, app)}
                                title="Edit My Application"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                              >
                                <PencilSimple size={16} />
                              </button>
                            )}
                            {currentUserRole === "ADMIN" && (
                              <button
                                onClick={() => handleDeleteSelfApp(ipo.id, app.id)}
                                title="Delete Application (Admin)"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                              >
                                <Trash size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                })
              )}
            </div>

            {/* SUBTLE FOOTER NOTE */}
            <div className="px-8 py-4 bg-slate-50/40 border-t border-slate-100 flex items-center justify-center text-xs font-semibold text-slate-400 gap-2">
              <LockKey size={14} className="text-slate-400" />
              <span>You can edit your own applications. Applications can only be deleted and allotment status updated by admins.</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
