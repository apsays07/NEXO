"use client";

import React, { useState, useMemo } from "react";
import { useNexo } from "@/context/NexoContext";
import { formatINR } from "@/lib/mockData";
import { AllotmentStatus } from "@/types/nexo";
import { CheckCircle, LockKey, ArrowSquareOut, Gear } from "@phosphor-icons/react";

export function ApplicationsView() {
  const { ipos, currentUserRole, updateRegistrarUrl } = useNexo();

  // Local Filter for selecting IPO / Company
  const [ipoFilter, setIpoFilter] = useState<string>(ipos[0]?.id || "ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ALLOTTED" | "AWAITING" | "NOT_ALLOTTED">("ALL");
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [customRegistrarUrl, setCustomRegistrarUrl] = useState("");

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
        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
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

  return (
    <div className="space-y-5 pb-12 animate-fade-in max-w-6xl mx-auto">
      {/* TOP BAR: ALL IN ONE LINE (NO GEAR BUTTON) */}
      <div className="flex flex-wrap items-center justify-between gap-5 p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-6">
          {/* Left: Select IPO / Company */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-extrabold text-slate-600">Select IPO / Company:</span>
            <select
              value={ipoFilter}
              onChange={(e) => setIpoFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-1.5 text-xs font-extrabold text-slate-900 focus:border-blue-600 focus:bg-white outline-none cursor-pointer min-w-[190px] shadow-2xs transition-all"
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

          {/* Inline Summary Metrics */}
          {activeIpoMetrics && (
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Applications</span>
                <span className="text-base font-extrabold text-slate-900 num-tabular">{activeIpoMetrics.totalApps}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Total Amount</span>
                <span className="text-base font-extrabold text-slate-900 num-tabular">{formatINR(activeIpoMetrics.totalAmount)}</span>
              </div>

              <div className="w-px h-6 bg-slate-200 hidden sm:block" />

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Allotted</span>
                <span className="text-base font-extrabold text-emerald-600 num-tabular">{formatINR(activeIpoMetrics.allottedAmount)}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Awaiting</span>
                <span className="text-base font-extrabold text-amber-600 num-tabular">{formatINR(activeIpoMetrics.awaitingAmount)}</span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Not Allotted</span>
                <span className="text-base font-extrabold text-rose-600 num-tabular">{formatINR(activeIpoMetrics.notAllottedAmount)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Check Allotment Button (In Same Line, No Gear Button) */}
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

      {/* ADMIN REGISTRAR URL EDIT MODAL */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4 animate-fade-in">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Configure Registrar URL ({activeIpo?.name})
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the official IPO allotment status URL for this company's registrar (Link Intime, KFintech, Bigshare, etc.).
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:bg-white outline-none"
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
          if (statusFilter === "ALL") return true;
          const st = app.allotmentStatus || app.status || "AWAITING";
          return st === statusFilter;
        });

        return (
          <div
            key={ipo.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden"
          >
            {/* IPO HEADER WITH ALLOTTED / NOT ALLOTTED STATUS FILTER */}
            <div className="p-5 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {ipo.logo || ipo.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    {ipo.name} IPO
                  </h2>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Lot Price: {formatINR(ipo.metrics.minInvestment)} • {ipo.category || "Mainboard"}
                  </div>
                </div>
              </div>

              {/* Status Filter Buttons at company name line */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shrink-0">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === "ALL"
                      ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  All ({ipo.applications.length})
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
              <div className="col-span-3">PAN Card</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            {/* APPLICATION LEDGER ROWS */}
            <div className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-medium">
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

                  if (canonicalType === "INDIVIDUAL") {
                    // INDIVIDUAL APPLICATION ROW
                    return (
                      <div
                        key={app.id}
                        className="px-6 py-5 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 md:gap-0 hover:bg-slate-50/40 transition-colors"
                      >
                        {/* # SR No (Dark Font) */}
                        <div className="col-span-1 font-mono text-xs font-bold text-slate-800">
                          {formattedSeq}
                        </div>

                        {/* Applicant Name */}
                        <div className="col-span-3">
                          <div className="text-sm font-semibold text-slate-900">
                            {app.applicantName || "Shivam Prasad"}
                          </div>
                        </div>

                        {/* PAN Card Column (Medium Dark) */}
                        <div className="col-span-3">
                          <div className="text-xs font-semibold text-slate-700 font-mono">
                            {app.panMasked || "XXXXX1234X"}
                          </div>
                        </div>

                        {/* Type Badge */}
                        <div className="col-span-1">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                            Individual
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="col-span-2 text-right font-mono text-sm font-semibold text-slate-900 num-tabular">
                          {formatINR(app.totalContribution)}
                        </div>

                        {/* Status */}
                        <div className="col-span-2 text-right">
                          {renderStatusControl(ipo.id, app.id, currentStatus)}
                        </div>
                      </div>
                    );
                  } else {
                    // COMBINED APPLICATION ROW
                    return (
                      <div
                        key={app.id}
                        className="px-6 py-5 flex flex-col md:grid md:grid-cols-12 items-start md:items-center gap-3 md:gap-0 hover:bg-slate-50/40 transition-colors"
                      >
                        {/* # SR No (Dark Font) */}
                        <div className="col-span-1 font-mono text-xs font-bold text-slate-800 self-start pt-0.5">
                          {formattedSeq}
                        </div>

                        {/* Contributors List */}
                        <div className="col-span-3 space-y-1.5">
                          {app.participants.map((p, idx) => (
                            <div key={idx} className="text-sm font-semibold text-slate-900">
                              {p.memberName}
                            </div>
                          ))}
                        </div>

                        {/* PAN Card Column (Medium Dark) */}
                        <div className="col-span-3 self-center">
                          <div className="text-xs font-semibold text-slate-700 font-mono">
                            {app.panMasked || "XXXXX1234X"}
                          </div>
                        </div>

                        {/* Type Badge */}
                        <div className="col-span-1 self-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200/60">
                            Combined
                          </span>
                        </div>

                        {/* Individual Contribution Amounts in AMOUNT Column */}
                        <div className="col-span-2 text-right space-y-1.5 self-center font-mono text-sm font-semibold text-slate-900 num-tabular">
                          {app.participants.map((p, idx) => (
                            <div key={idx}>{formatINR(p.contribution)}</div>
                          ))}
                        </div>

                        {/* Single Combined Status */}
                        <div className="col-span-2 text-right self-center">
                          {renderStatusControl(ipo.id, app.id, currentStatus)}
                        </div>
                      </div>
                    );
                  }
                })
              )}
            </div>

            {/* SUBTLE ADMIN FOOTER NOTE */}
            <div className="px-6 py-3.5 bg-slate-50/40 border-t border-slate-100 flex items-center justify-center text-[11px] font-medium text-slate-400 gap-1.5">
              <LockKey size={13} className="text-slate-400" />
              <span>Only admins can update allotment status.</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
