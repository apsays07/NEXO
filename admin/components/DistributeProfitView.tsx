"use client";

import React, { useState, useMemo } from "react";
import { Coins, CheckCircle, ArrowRight, User, Users, Calculator, Package } from "@phosphor-icons/react";
import { useAdmin } from "../context/AdminContext";

export function DistributeProfitView() {
  const { ipos, publishProfitDistribution } = useAdmin();

  // Filter visible IPOs
  const activeIpos = ipos.filter((ipo) => !ipo.isHidden);

  const [selectedIpoId, setSelectedIpoId] = useState(activeIpos[0]?.id || "");
  const [allottedLots, setAllottedLots] = useState<number | "">(1);
  const [totalProfit, setTotalProfit] = useState<number | "">("");
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const selectedIpo = activeIpos.find((ipo) => ipo.id === selectedIpoId) || activeIpos[0];

  const numProfit = typeof totalProfit === "number" ? totalProfit : 0;
  const numAllottedLots = typeof allottedLots === "number" ? allottedLots : 0;

  // ── Auto-fetch all applicants from user-side applications ──
  const memberApplications = useMemo(() => {
    if (!selectedIpo?.applications || selectedIpo.applications.length === 0) {
      return [];
    }

    const membersMap = new Map<string, { id: string; name: string; lots: number; pan: string }>();

    selectedIpo.applications.forEach((app: any) => {
      // Combined pool application with multiple participants
      if (Array.isArray(app.participants) && app.participants.length > 0) {
        app.participants.forEach((p: any) => {
          const pName = p.memberName || p.name || app.applicantName || "Member";
          const pKey = (p.memberId || pName).toLowerCase();
          const pPan = p.panMasked || app.panMasked || "XXXXXXXX41";
          const minInv = selectedIpo.metrics?.minInvestment || 15000;
          const lotVal = p.contribution ? p.contribution / minInv : (app.lotCount || 1);

          if (membersMap.has(pKey)) {
            membersMap.get(pKey)!.lots += lotVal;
          } else {
            membersMap.set(pKey, {
              id: p.memberId || `mem_${Date.now()}_${Math.random()}`,
              name: pName,
              lots: lotVal,
              pan: pPan,
            });
          }
        });
      } else {
        // Single applicant
        const aName = app.applicantName || "Member";
        const aKey = (app.memberId || aName).toLowerCase();
        const aPan = app.panMasked || "XXXXXXXX41";
        const lotVal = app.lotCount || 1;

        if (membersMap.has(aKey)) {
          membersMap.get(aKey)!.lots += lotVal;
        } else {
          membersMap.set(aKey, {
            id: app.memberId || app.id,
            name: aName,
            lots: lotVal,
            pan: aPan,
          });
        }
      }
    });

    return Array.from(membersMap.values());
  }, [selectedIpo]);

  // ── Auto-calculated values ──
  const totalApplicants = memberApplications.length;
  const totalApplications = selectedIpo?.applications?.length || 0;
  const totalAppliedLots = memberApplications.reduce((acc, m) => acc + m.lots, 0);
  const perApplicationProfit = totalApplications > 0 ? Math.round(numProfit / totalApplications) : 0;

  const handlePublish = async () => {
    if (!selectedIpo || numProfit <= 0 || !hasApplicants) return;

    if (publishProfitDistribution) {
      await publishProfitDistribution(selectedIpo.id, numProfit, numAllottedLots);
    }

    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 5000);
  };

  const hasApplicants = memberApplications.length > 0;

  return (
    <div className="space-y-6 font-sans">
      {/* Toast */}
      {isSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-extrabold flex items-center gap-3 animate-fade-in shadow-md">
          <CheckCircle size={22} weight="fill" className="text-emerald-600 shrink-0" />
          <span>
            ✓ Profit distribution published for <strong className="underline">{selectedIpo?.name}</strong>! It is now visible on the user-side IPO workspace.
          </span>
        </div>
      )}

      {/* ═══ SECTION 1: Controls ═══ */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <Coins size={24} weight="bold" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 font-mono">
                  PROFIT DISTRIBUTION
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Distribute Profit
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePublish}
            disabled={!selectedIpo || numProfit <= 0 || !hasApplicants}
            className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-md ${
              selectedIpo && numProfit > 0 && hasApplicants
                ? "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Coins size={18} weight="bold" />
            <span>Publish Profit to Workspace</span>
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>

        {/* ── Row 1: Select IPO + Allotted Lots (Admin input) + Total Profit (Admin input) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* 1. Select IPO */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-900 mb-2">
              Select IPO
            </label>
            <select
              value={selectedIpoId}
              onChange={(e) => setSelectedIpoId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs sm:text-sm font-extrabold text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none shadow-xs"
            >
              {activeIpos.length === 0 && (
                <option value="">No active IPOs</option>
              )}
              {activeIpos.map((ipo) => (
                <option key={ipo.id} value={ipo.id}>
                  {ipo.name} ({ipo.metrics.issueSize})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Number of Allotted Lots (Admin enters) */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-900 mb-2">
              Number of Allotted Lots
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400">
                <Package size={18} weight="bold" />
              </span>
              <input
                type="number"
                min={0}
                step="0.5"
                placeholder="e.g. 3"
                value={allottedLots}
                onChange={(e) => {
                  const raw = e.target.value === "" ? "" : Number(e.target.value);
                  if (typeof raw === "number" && raw > totalApplications) {
                    setAllottedLots(totalApplications);
                  } else {
                    setAllottedLots(raw);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm font-mono font-black text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* 3. Total Realized Profit (Admin enters) */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-900 mb-2">
              Total Realized Profit (₹)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 font-mono font-bold text-base">₹</span>
              <input
                type="number"
                min={0}
                placeholder="e.g. 150000"
                value={totalProfit}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  setTotalProfit(val);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-3 text-xs sm:text-sm font-mono font-black text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* ── Row 2: Auto-calculated summary ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          {/* Total Applications (auto) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Users size={16} weight="bold" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Applications</span>
            </div>
            <div className="text-xl font-black text-slate-900">
              {totalApplications}
              <span className="text-xs font-bold text-slate-400 ml-1">Applications</span>
            </div>
          </div>

          {/* Per Application Profit (auto) */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1 shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-600">
              <Calculator size={16} weight="bold" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Per Application Profit</span>
            </div>
            <div className="text-xl font-mono font-black text-emerald-700">
              ₹{perApplicationProfit.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 2: Member Payout Table (auto-fetched) ═══ */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Applicant Breakdown
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Auto-fetched from user-side applications for <strong className="text-slate-800">{selectedIpo?.name || "—"}</strong>.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-500">
              Total Profit: <strong className="font-mono text-emerald-600 font-extrabold">₹{numProfit.toLocaleString("en-IN")}</strong>
            </span>
            <span className="text-xs font-bold text-slate-500">
              Per Application: <strong className="font-mono text-blue-600 font-extrabold">₹{perApplicationProfit.toLocaleString("en-IN")}</strong>
            </span>
          </div>
        </div>

        {!hasApplicants ? (
          <div className="p-10 text-center space-y-2">
            <Users size={36} className="text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Applicants Found</h4>
            <p className="text-xs text-slate-500">
              No applications have been submitted for this IPO yet on the user-side website.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                  <th className="p-3.5 rounded-l-xl">Member Name</th>
                  <th className="p-3.5">PAN</th>
                  <th className="p-3.5 text-center">Applied Lots</th>
                  <th className="p-3.5 text-right">Per Application Profit</th>
                  <th className="p-3.5 text-right rounded-r-xl">Individual Profit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {memberApplications.map((m, idx) => {
                  const individualProfit = perApplicationProfit;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs shrink-0 font-bold">
                          <User size={16} />
                        </div>
                        <span>{m.name}</span>
                      </td>
                      <td className="p-3.5 font-mono text-xs text-slate-500">{m.pan}</td>
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold font-mono text-xs border border-blue-200">
                          {m.lots % 1 === 0 ? m.lots : m.lots.toFixed(1)} Lot{m.lots > 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-600">
                        ₹{perApplicationProfit.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3.5 text-right font-mono font-black text-emerald-600 text-sm sm:text-base">
                        ₹{individualProfit.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Totals Row */}
              <tfoot>
                <tr className="border-t-2 border-slate-300 bg-slate-50/70 font-extrabold text-slate-900">
                  <td className="p-3.5" colSpan={2}>
                    TOTAL
                  </td>
                  <td className="p-3.5 text-center font-mono">
                    {totalAppliedLots % 1 === 0 ? totalAppliedLots : totalAppliedLots.toFixed(1)} Lots
                  </td>
                  <td className="p-3.5 text-right font-mono">—</td>
                  <td className="p-3.5 text-right font-mono text-emerald-700 text-sm sm:text-base">
                    ₹{numProfit.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
