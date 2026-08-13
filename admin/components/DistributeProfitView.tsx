"use client";

import React, { useState } from "react";
import { Coins, CheckCircle, ArrowRight, User } from "@phosphor-icons/react";
import { useAdmin } from "../context/AdminContext";

export function DistributeProfitView() {
  const { ipos, publishProfitDistribution } = useAdmin();

  // Filter visible IPOs
  const activeIpos = ipos.filter((ipo) => !ipo.isHidden);

  const [selectedIpoId, setSelectedIpoId] = useState(activeIpos[0]?.id || "");
  const [totalProfit, setTotalProfit] = useState<number | "">(150000);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const selectedIpo = activeIpos.find((ipo) => ipo.id === selectedIpoId) || activeIpos[0];

  const numProfit = typeof totalProfit === "number" ? totalProfit : 0;

  // Extract all applicants and participants from the selected IPO (single and combined applications)
  const memberApplications = React.useMemo(() => {
    if (!selectedIpo || !selectedIpo.applications || selectedIpo.applications.length === 0) {
      return [
        { id: "mem_1", name: "Ashay (Member)", lots: 2, pan: "ABCDE1234F" },
        { id: "mem_2", name: "Niranjan", lots: 2, pan: "BCDEF2345G" },
        { id: "mem_3", name: "Rohan Verma", lots: 1, pan: "CDEFG3456H" },
        { id: "mem_4", name: "Priya Patel", lots: 3, pan: "DEFGH4567I" },
        { id: "mem_5", name: "Vikram Malhotra", lots: 2, pan: "EFGHI5678J" },
      ];
    }

    const membersMap = new Map<string, { id: string; name: string; lots: number; pan: string }>();

    selectedIpo.applications.forEach((app: any) => {
      // If application is a Combined pool with multiple participants
      if (Array.isArray(app.participants) && app.participants.length > 0) {
        app.participants.forEach((p: any) => {
          const pName = p.memberName || p.name || app.applicantName || "Member Participant";
          const pKey = (p.memberId || pName).toLowerCase();
          const pPan = p.panMasked || app.panMasked || "XXXXXXXX41";
          const minInv = selectedIpo.metrics?.minInvestment || 15000;
          const lotVal = p.contribution ? Math.max(1, Math.round(p.contribution / minInv)) : (app.lotCount || 1);

          if (membersMap.has(pKey)) {
            const existing = membersMap.get(pKey)!;
            existing.lots += lotVal;
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
        // Single applicant application
        const aName = app.applicantName || "Member Applicant";
        const aKey = (app.memberId || aName).toLowerCase();
        const aPan = app.panMasked || "XXXXXXXX41";
        const lotVal = app.lotCount || 1;

        if (membersMap.has(aKey)) {
          const existing = membersMap.get(aKey)!;
          existing.lots += lotVal;
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

  const totalApplicants = memberApplications.length;
  const totalLots = memberApplications.reduce((acc, m) => acc + m.lots, 0);
  const oneLotProfit = totalLots > 0 ? Math.round(numProfit / totalLots) : 0;

  const handlePublish = async () => {
    if (!selectedIpo) return;

    if (publishProfitDistribution) {
      await publishProfitDistribution(selectedIpo.id, numProfit, totalLots);
    }

    setIsSuccessToast(true);
    setTimeout(() => {
      setIsSuccessToast(false);
    }, 5000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {isSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-extrabold flex items-center gap-3 animate-fade-in shadow-md">
          <CheckCircle size={22} weight="fill" className="text-emerald-600 shrink-0" />
          <span>
            ✓ Profit distribution published for <strong className="underline">{selectedIpo?.name}</strong>! It is now visible on the user-side IPO workspace.
          </span>
        </div>
      )}

      {/* Main Top Control Box: Select IPO, Total Profit, Total Applicants & Right Side Publish Button */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
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

          {/* Right Side Publish Button */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={!selectedIpo || numProfit <= 0}
            className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-md ${
              selectedIpo && numProfit > 0
                ? "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Coins size={18} weight="bold" />
            <span>Publish Profit to Workspace</span>
            <ArrowRight size={16} weight="bold" />
          </button>
        </div>

        {/* Inputs Grid: Select IPO, Total Profit, Total Applicants */}
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
              {activeIpos.map((ipo) => (
                <option key={ipo.id} value={ipo.id}>
                  {ipo.name} ({ipo.metrics.issueSize})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Total Profit */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-900 mb-2">
              Total Realized Profit (₹)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-slate-400 font-mono font-bold text-base">₹</span>
              <input
                type="number"
                min={0}
                placeholder="150000"
                value={totalProfit}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  setTotalProfit(val);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-3 text-xs sm:text-sm font-mono font-black text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none shadow-xs"
              />
            </div>
          </div>

          {/* 3. Total Applicants & Calculated 1 Lot Profit Badge */}
          <div>
            <label className="block text-xs sm:text-sm font-extrabold text-slate-900 mb-2">
              Total Applicants & 1 Lot Profit
            </label>
            <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Applicants</span>
                <span className="text-sm font-black text-slate-900">{totalApplicants} Members ({totalLots} Lots)</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 block">1 Lot Profit</span>
                <span className="text-sm font-mono font-black text-emerald-700">₹{oneLotProfit.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Payouts Table (Fetched from User-side Applications) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Member Payout Breakdown
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Fetched from user-side website applications submitted for <strong className="text-slate-800">{selectedIpo?.name}</strong>.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Total Distributed: <strong className="font-mono text-emerald-600 font-extrabold">₹{numProfit.toLocaleString("en-IN")}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider">
                <th className="p-3.5 rounded-l-xl">Member Name</th>
                <th className="p-3.5">PAN</th>
                <th className="p-3.5 text-center">Applied Lots</th>
                <th className="p-3.5 text-right">1 Lot Profit</th>
                <th className="p-3.5 text-right rounded-r-xl">Calculated Member Profit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {memberApplications.map((m, idx) => {
                const memberProfit = m.lots * oneLotProfit;
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
                        {m.lots} Lot{m.lots > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-slate-600">
                      ₹{oneLotProfit.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-emerald-600 text-sm sm:text-base">
                      ₹{memberProfit.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
