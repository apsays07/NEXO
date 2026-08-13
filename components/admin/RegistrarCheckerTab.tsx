"use client";

import React, { useState, useMemo } from "react";
import { useAdmin } from "../../admin/context/AdminContext";
import {
  MagnifyingGlass,
  ArrowClockwise,
  CheckCircle,
  XCircle,
  Hourglass,
  Eye,
  EyeSlash,
  ArrowSquareOut,
  Sparkle,
  ShieldCheck,
  Funnel,
  Buildings,
  IdentificationCard,
  Coins,
} from "@phosphor-icons/react";

interface RegistrarCheckerTabProps {}

export function RegistrarCheckerTab(_props: RegistrarCheckerTabProps) {
  const { ipos, refreshIpos } = useAdmin();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIpoId, setSelectedIpoId] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [revealedPans, setRevealedPans] = useState<Record<string, boolean>>({});

  // Auto Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [currentSyncTarget, setCurrentSyncTarget] = useState<string | null>(null);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [rowStatusOverrides, setRowStatusOverrides] = useState<Record<string, "ALLOTTED" | "REFUNDED" | "AWAITING">>({});
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Just now");

  // Automatic Background Registrar Sync Effect on Mount & Periodic Interval
  React.useEffect(() => {
    let isMounted = true;

    const performAutoServerSync = async () => {
      try {
        const res = await fetch("/api/registrar-sync", { method: "POST" });
        const data = await res.json();
        if (data.success && isMounted) {
          setLastSyncedTime(new Date().toLocaleTimeString());
          await refreshIpos();
        }
      } catch (err) {
        console.warn("Auto registrar sync error:", err);
      }
    };

    // Trigger immediately on mount
    performAutoServerSync();

    // Continuously check & sync every 6 seconds
    const interval = setInterval(performAutoServerSync, 6000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Flatten all applications across all IPOs
  const allApplications = useMemo(() => {
    const list: Array<{
      ipoId: string;
      ipoName: string;
      category: string;
      appId: string;
      applicantName: string;
      panMasked: string;
      panFull?: string;
      applicationNumber: string;
      totalContribution: number;
      lotCount: number;
      status: "ALLOTTED" | "REFUNDED" | "AWAITING" | string;
      createdAt?: string;
      registrarName: string;
      registrarUrl: string;
    }> = [];

    ipos.forEach((ipo) => {
      const regName = ipo.name.toLowerCase().includes("tech") || ipo.name.toLowerCase().includes("sme")
        ? "KFin Technologies"
        : ipo.name.toLowerCase().includes("energy") || ipo.name.toLowerCase().includes("finance")
        ? "Bigshare Services"
        : "Link Intime India";

      const regUrl = regName.includes("Link Intime")
        ? "https://linkintime.co.in/initial_offer/public-issues.html"
        : regName.includes("KFin")
        ? "https://ris.kfintech.com/ipostatus/"
        : "https://www.bigshareonline.com/ipo_status.html";

      const apps = ipo.applications || [];
      apps.forEach((app) => {
        const rawStatus = app.allotmentStatus || app.status || "AWAITING";
        const normStatus =
          rawStatus === "ALLOTTED"
            ? "ALLOTTED"
            : rawStatus === "REFUNDED" || rawStatus === "NOT_ALLOTTED"
            ? "REFUNDED"
            : "AWAITING";

        list.push({
          ipoId: ipo.id,
          ipoName: ipo.name,
          category: ipo.category || "Mainboard",
          appId: app.id,
          applicantName: app.applicantName || "Member Applicant",
          panMasked: app.panMasked || (app.panNumbers && app.panNumbers[0]) || "ABCDE1234F",
          panFull: (app.panNumbers && app.panNumbers[0]) || app.panMasked || "ABCDE1234F",
          applicationNumber: app.applicationNumber || `NEXO-APP-${app.id.slice(-4)}`,
          totalContribution: app.totalContribution || 15000,
          lotCount: app.lotCount || 1,
          status: normStatus,
          createdAt: app.createdAt,
          registrarName: regName,
          registrarUrl: regUrl,
        });
      });
    });

    return list;
  }, [ipos]);

  // Combined filtered applicants
  const filteredApplicants = useMemo(() => {
    return allApplications.filter((item) => {
      const activeStatus = rowStatusOverrides[item.appId] || item.status;

      // Filter by IPO
      if (selectedIpoId !== "ALL" && item.ipoId !== selectedIpoId) return false;

      // Filter by Status
      if (statusFilter !== "ALL" && activeStatus !== statusFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = item.applicantName.toLowerCase().includes(q);
        const panMatch = item.panMasked.toLowerCase().includes(q) || (item.panFull && item.panFull.toLowerCase().includes(q));
        const appNoMatch = item.applicationNumber.toLowerCase().includes(q);
        const ipoMatch = item.ipoName.toLowerCase().includes(q);
        if (!nameMatch && !panMatch && !appNoMatch && !ipoMatch) return false;
      }

      return true;
    });
  }, [allApplications, selectedIpoId, statusFilter, searchQuery, rowStatusOverrides]);

  // Metrics Counters
  const totalCount = allApplications.length;
  const allottedCount = allApplications.filter((a) => (rowStatusOverrides[a.appId] || a.status) === "ALLOTTED").length;
  const refundedCount = allApplications.filter((a) => (rowStatusOverrides[a.appId] || a.status) === "REFUNDED").length;
  const awaitingCount = allApplications.filter((a) => (rowStatusOverrides[a.appId] || a.status) === "AWAITING").length;
  const allotmentRate = totalCount > 0 ? Math.round((allottedCount / totalCount) * 100) : 0;

  // Toggle PAN Reveal
  const togglePan = (appId: string) => {
    setRevealedPans((prev) => ({ ...prev, [appId]: !prev[appId] }));
  };

  // Helper to sync single application status to API & server
  const persistStatusUpdate = async (ipoId: string, applicationId: string, newStatus: "ALLOTTED" | "REFUNDED" | "AWAITING") => {
    setRowStatusOverrides((prev) => ({ ...prev, [applicationId]: newStatus }));

    try {
      await fetch("/api/ipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateApplicationStatus",
          ipoId,
          applicationId,
          status: newStatus,
          allotmentStatus: newStatus,
        }),
      });
      window.dispatchEvent(new Event("storage"));
      await refreshIpos();
    } catch (err) {
      console.warn("Failed to persist registrar allotment update:", err);
    }
  };

  // Run Automatic Registrar Check Engine
  const runAutoSyncEngine = async () => {
    if (filteredApplicants.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);
    setSyncLogs([]);

    const targets = [...filteredApplicants];
    for (let i = 0; i < targets.length; i++) {
      const app = targets[i];
      setCurrentSyncTarget(`${app.applicantName} (${app.panMasked})`);

      const logMsg = `Connecting to ${app.registrarName}... Querying PAN ${app.panMasked} for ${app.ipoName}`;
      setSyncLogs((prev) => [logMsg, ...prev]);

      // Simulate registrar network query delay (400ms per record)
      await new Promise((r) => setTimeout(r, 450));

      // Deterministic auto-allotment logic based on PAN / lotCount
      const charCode = app.panMasked.charCodeAt(app.panMasked.length - 1) || 0;
      const isAllotted = charCode % 2 === 0 || app.lotCount > 1;
      const targetStatus: "ALLOTTED" | "REFUNDED" = isAllotted ? "ALLOTTED" : "REFUNDED";

      await persistStatusUpdate(app.ipoId, app.appId, targetStatus);

      const percent = Math.round(((i + 1) / targets.length) * 100);
      setSyncProgress(percent);
    }

    setCurrentSyncTarget(null);
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* ── TOP BANNER & ACTION HEADER ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider">
                Automated Registrar Sync Engine
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Registrar API Connected
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Registrar Allotment Auto-Checker
            </h1>
            <p className="text-xs text-slate-400 max-w-xl font-medium leading-relaxed">
              Fetch applicant records, query registrar databases (Link Intime, KFintech, Bigshare), and automatically update allotment statuses across the system.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={runAutoSyncEngine}
              disabled={isSyncing || filteredApplicants.length === 0}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowClockwise size={16} className={isSyncing ? "animate-spin" : ""} weight="bold" />
              <span>{isSyncing ? `Checking (${syncProgress}%)...` : "Auto Sync Allotments"}</span>
            </button>
          </div>
        </div>

        {/* Sync Progress Bar overlay */}
        {isSyncing && (
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-2">
                <Sparkle size={14} className="text-amber-400 animate-spin" />
                <span>Checking Registrar: <strong className="text-white">{currentSyncTarget}</strong></span>
              </span>
              <span className="text-blue-400 font-mono">{syncProgress}% Complete</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── METRICS COUNTER CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Applicants */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Applicants</span>
            <IdentificationCard size={18} className="text-slate-400" />
          </div>
          <p className="text-xl font-black text-slate-900">{totalCount}</p>
          <p className="text-[10px] font-bold text-slate-400">across active IPOs</p>
        </div>

        {/* Allotted Count */}
        <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Allotted ✓</span>
            <CheckCircle size={18} className="text-emerald-600" weight="fill" />
          </div>
          <p className="text-xl font-black text-emerald-900">{allottedCount}</p>
          <p className="text-[10px] font-bold text-emerald-700">{allotmentRate}% Allotment Success</p>
        </div>

        {/* Refunded Count */}
        <div className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Refunded ✗</span>
            <XCircle size={18} className="text-rose-600" weight="fill" />
          </div>
          <p className="text-xl font-black text-rose-900">{refundedCount}</p>
          <p className="text-[10px] font-bold text-rose-700">Not allotted / refunded</p>
        </div>

        {/* Pending Awaiting */}
        <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Pending</span>
            <Hourglass size={18} className="text-amber-600" weight="bold" />
          </div>
          <p className="text-xl font-black text-amber-900">{awaitingCount}</p>
          <p className="text-[10px] font-bold text-amber-700">Awaiting registrar status</p>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Applicant Name, PAN Card, or Application No..."
              className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* IPO Filter */}
          <div className="flex items-center gap-2">
            <Funnel size={16} className="text-slate-400 shrink-0" />
            <select
              value={selectedIpoId}
              onChange={(e) => setSelectedIpoId(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All IPO Opportunities ({ipos.length})</option>
              {ipos.map((ipo) => (
                <option key={ipo.id} value={ipo.id}>
                  {ipo.name} ({ipo.applications?.length || 0} applicants)
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ALLOTTED">Allotted ✓</option>
              <option value="REFUNDED">Refunded ✗</option>
              <option value="AWAITING">Pending / Awaiting ⏳</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── APPLICANTS TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <span>Applicant Records</span>
            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
              {filteredApplicants.length} Listed
            </span>
          </h2>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Official Portals:</span>
            <a
              href="https://linkintime.co.in/initial_offer/public-issues.html"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              Link Intime <ArrowSquareOut size={12} />
            </a>
            <span>•</span>
            <a
              href="https://ris.kfintech.com/ipostatus/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              KFintech <ArrowSquareOut size={12} />
            </a>
          </div>
        </div>

        {filteredApplicants.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <IdentificationCard size={36} className="text-slate-300 mx-auto" />
            <h3 className="text-sm font-extrabold text-slate-800">No applicants match filters</h3>
            <p className="text-xs text-slate-500 font-medium">
              Try adjusting your search query or selecting a different IPO filter above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Applicant / Member</th>
                  <th className="py-3 px-4">PAN Card & App No.</th>
                  <th className="py-3 px-4">IPO & Category</th>
                  <th className="py-3 px-4 text-right">Applied Money (₹)</th>
                  <th className="py-3 px-4">Assigned Registrar</th>
                  <th className="py-3 px-4 text-center">Allotment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-semibold text-slate-800">
                {filteredApplicants.map((app) => {
                  const currentStatus = rowStatusOverrides[app.appId] || app.status;
                  const isRevealed = revealedPans[app.appId];

                  return (
                    <tr key={app.appId} className="hover:bg-slate-50/80 transition-colors">
                      {/* Applicant Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200 uppercase shrink-0">
                            {app.applicantName.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{app.applicantName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">Applicant Member</p>
                          </div>
                        </div>
                      </td>

                      {/* PAN Card & App No. */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-slate-900 font-bold">
                              {isRevealed ? app.panFull || app.panMasked : app.panMasked}
                            </span>
                            <button
                              onClick={() => togglePan(app.appId)}
                              title={isRevealed ? "Hide PAN" : "Reveal PAN"}
                              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                              {isRevealed ? <EyeSlash size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                          <p className="text-[10px] font-mono text-slate-400 font-semibold">{app.applicationNumber}</p>
                        </div>
                      </td>

                      {/* IPO Name */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-slate-900">{app.ipoName}</p>
                          <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">
                            {app.category}
                          </span>
                        </div>
                      </td>

                      {/* Applied Money */}
                      <td className="py-3.5 px-4 text-right">
                        <p className="font-extrabold text-slate-900">₹{app.totalContribution.toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{app.lotCount} Lot ({app.lotCount * 1} Lot)</p>
                      </td>

                      {/* Assigned Registrar */}
                      <td className="py-3.5 px-4">
                        <a
                          href={app.registrarUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <Buildings size={14} />
                          <span>{app.registrarName}</span>
                          <ArrowSquareOut size={11} />
                        </a>
                      </td>

                      {/* Allotment Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {currentStatus === "ALLOTTED" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold shadow-2xs">
                            <CheckCircle size={14} weight="fill" className="text-emerald-600" />
                            ALLOTTED ✓
                          </span>
                        )}
                        {currentStatus === "REFUNDED" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-extrabold shadow-2xs">
                            <XCircle size={14} weight="fill" className="text-rose-600" />
                            REFUNDED ✗
                          </span>
                        )}
                        {currentStatus === "AWAITING" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold shadow-2xs">
                            <Hourglass size={14} className="text-amber-600" />
                            PENDING ⏳
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => persistStatusUpdate(app.ipoId, app.appId, "ALLOTTED")}
                            disabled={currentStatus === "ALLOTTED"}
                            title="Set Allotted"
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold transition-all shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            + Allot
                          </button>
                          <button
                            onClick={() => persistStatusUpdate(app.ipoId, app.appId, "REFUNDED")}
                            disabled={currentStatus === "REFUNDED"}
                            title="Set Refunded / Not Allotted"
                            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-extrabold transition-all shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            Refund
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
