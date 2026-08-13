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
  Funnel,
  Buildings,
  IdentificationCard,
  X,
} from "@phosphor-icons/react";

export function RegistrarCheckerTab() {
  const { ipos, refreshIpos } = useAdmin();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIpoId, setSelectedIpoId] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [revealedPans, setRevealedPans] = useState<Record<string, boolean>>({});

  // Real PAN Check Modal
  const [isRealPanModalOpen, setIsRealPanModalOpen] = useState(false);
  const [customPan, setCustomPan] = useState("");
  const [customRegistrar, setCustomRegistrar] = useState("Link Intime India");
  const [customIpoId, setCustomIpoId] = useState(ipos[0]?.id || "");
  const [checkResult, setCheckResult] = useState<{ success: boolean; status?: string; message?: string } | null>(null);
  const [isCheckingSingle, setIsCheckingSingle] = useState(false);

  // Loading states for row-level updates
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);

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
      status: string;
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
      apps.forEach((app: any) => {
        const rawStatus = app.allotmentStatus || app.status || "AWAITING";
        // Normalize: only ALLOTTED or REFUNDED are confirmed, everything else is AWAITING
        const normStatus =
          rawStatus === "ALLOTTED" ? "ALLOTTED"
          : rawStatus === "REFUNDED" || rawStatus === "NOT_ALLOTTED" ? "REFUNDED"
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

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    return allApplications.filter((item) => {
      if (selectedIpoId !== "ALL" && item.ipoId !== selectedIpoId) return false;
      if (statusFilter !== "ALL" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (
          !item.applicantName.toLowerCase().includes(q) &&
          !item.panMasked.toLowerCase().includes(q) &&
          !(item.panFull && item.panFull.toLowerCase().includes(q)) &&
          !item.applicationNumber.toLowerCase().includes(q) &&
          !item.ipoName.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [allApplications, selectedIpoId, statusFilter, searchQuery]);

  // Metrics
  const totalCount = allApplications.length;
  const allottedCount = allApplications.filter((a) => a.status === "ALLOTTED").length;
  const refundedCount = allApplications.filter((a) => a.status === "REFUNDED").length;
  const awaitingCount = allApplications.filter((a) => a.status === "AWAITING").length;
  const allotmentRate = totalCount > 0 ? Math.round((allottedCount / totalCount) * 100) : 0;

  const togglePan = (appId: string) => {
    setRevealedPans((prev) => ({ ...prev, [appId]: !prev[appId] }));
  };

  // ── Admin manually updates status (persists to shared_ipos.json → user side syncs) ──
  const handleManualStatusUpdate = async (ipoId: string, applicationId: string, newStatus: "ALLOTTED" | "REFUNDED" | "AWAITING") => {
    setUpdatingAppId(applicationId);
    try {
      await fetch("/api/registrar-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateStatus",
          ipoId,
          applicationId,
          newStatus,
        }),
      });
      window.dispatchEvent(new Event("storage"));
      await refreshIpos();
    } catch (err) {
      console.warn("Failed to update status:", err);
    } finally {
      setUpdatingAppId(null);
    }
  };

  // ── Admin checks a real PAN on registrar ──
  const handleCheckRealPanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPan.trim()) return;
    setIsCheckingSingle(true);
    setCheckResult(null);

    const targetIpo = ipos.find((i) => i.id === customIpoId) || ipos[0];
    try {
      const res = await fetch("/api/registrar-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkRealPan",
          pan: customPan.trim().toUpperCase(),
          registrar: customRegistrar,
          ipoName: targetIpo?.name || "IPO",
        }),
      });
      const data = await res.json();
      setCheckResult(data);
    } catch (err) {
      setCheckResult({ success: false, message: "Error connecting to registrar." });
    } finally {
      setIsCheckingSingle(false);
    }
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* ── HEADER ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider">
                Manual Registrar Check
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                <Hourglass size={12} weight="bold" />
                Default: Awaiting — Admin updates manually
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Registrar Allotment Checker
            </h1>
            <p className="text-xs text-slate-400 max-w-xl font-medium leading-relaxed">
              View all applicants, manually check PAN on registrar websites, and update allotment status. Status changes are reflected on the user side instantly.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => { setIsRealPanModalOpen(true); setCheckResult(null); }}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <IdentificationCard size={16} className="text-amber-400" />
              <span>Check Real PAN</span>
            </button>

            <button
              onClick={async () => { await refreshIpos(); }}
              className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <ArrowClockwise size={16} weight="bold" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── METRICS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Applicants</span>
            <IdentificationCard size={18} className="text-slate-400" />
          </div>
          <p className="text-xl font-black text-slate-900">{totalCount}</p>
          <p className="text-[10px] font-bold text-slate-400">across all IPOs</p>
        </div>

        <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Awaiting ⏳</span>
            <Hourglass size={18} className="text-amber-600" weight="bold" />
          </div>
          <p className="text-xl font-black text-amber-900">{awaitingCount}</p>
          <p className="text-[10px] font-bold text-amber-700">Pending admin check</p>
        </div>

        <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Allotted ✓</span>
            <CheckCircle size={18} className="text-emerald-600" weight="fill" />
          </div>
          <p className="text-xl font-black text-emerald-900">{allottedCount}</p>
          <p className="text-[10px] font-bold text-emerald-700">{allotmentRate}% success rate</p>
        </div>

        <div className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Not Allotted ✗</span>
            <XCircle size={18} className="text-rose-600" weight="fill" />
          </div>
          <p className="text-xl font-black text-rose-900">{refundedCount}</p>
          <p className="text-[10px] font-bold text-rose-700">Refunded / Not allotted</p>
        </div>
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name, PAN, or Application No..."
              className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">✕</button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Funnel size={16} className="text-slate-400 shrink-0" />
            <select value={selectedIpoId} onChange={(e) => setSelectedIpoId(e.target.value)} className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="ALL">All IPOs ({ipos.length})</option>
              {ipos.map((ipo) => (
                <option key={ipo.id} value={ipo.id}>{ipo.name} ({ipo.applications?.length || 0})</option>
              ))}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="ALL">All Statuses</option>
              <option value="AWAITING">Awaiting ⏳</option>
              <option value="ALLOTTED">Allotted ✓</option>
              <option value="REFUNDED">Not Allotted ✗</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── APPLICANTS TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            Applicant Records
            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{filteredApplicants.length} Listed</span>
          </h2>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Registrar Portals:</span>
            <a href="https://linkintime.co.in/initial_offer/public-issues.html" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Link Intime <ArrowSquareOut size={12} /></a>
            <span>•</span>
            <a href="https://ris.kfintech.com/ipostatus/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">KFintech <ArrowSquareOut size={12} /></a>
            <span>•</span>
            <a href="https://www.bigshareonline.com/ipo_status.html" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">Bigshare <ArrowSquareOut size={12} /></a>
          </div>
        </div>

        {filteredApplicants.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <IdentificationCard size={36} className="text-slate-300 mx-auto" />
            <h3 className="text-sm font-extrabold text-slate-800">No applicants found</h3>
            <p className="text-xs text-slate-500 font-medium">Adjust your search or filters above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">PAN Card</th>
                  <th className="py-3 px-4">IPO</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4">Registrar</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-semibold text-slate-800">
                {filteredApplicants.map((app) => {
                  const isRevealed = revealedPans[app.appId];
                  const isUpdating = updatingAppId === app.appId;

                  return (
                    <tr key={app.appId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200 uppercase shrink-0">
                            {app.applicantName.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{app.applicantName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{app.applicationNumber}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-900 font-bold">
                            {isRevealed ? app.panFull || app.panMasked : app.panMasked}
                          </span>
                          <button onClick={() => togglePan(app.appId)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                            {isRevealed ? <EyeSlash size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-extrabold text-slate-900">{app.ipoName}</p>
                        <span className="inline-block px-1.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold">{app.category}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <p className="font-extrabold text-slate-900">₹{app.totalContribution.toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{app.lotCount} Lot</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <a href={app.registrarUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline">
                          <Buildings size={14} />
                          <span>{app.registrarName}</span>
                          <ArrowSquareOut size={11} />
                        </a>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {app.status === "ALLOTTED" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold">
                            <CheckCircle size={14} weight="fill" className="text-emerald-600" /> Allotted
                          </span>
                        )}
                        {app.status === "REFUNDED" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-extrabold">
                            <XCircle size={14} weight="fill" className="text-rose-600" /> Not Allotted
                          </span>
                        )}
                        {app.status === "AWAITING" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold">
                            <Hourglass size={14} className="text-amber-600" /> Awaiting
                          </span>
                        )}
                      </td>

                      {/* Manual Status Update Buttons */}
                      <td className="py-3.5 px-4 text-center">
                        {isUpdating ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-bold">
                            <span className="w-3.5 h-3.5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleManualStatusUpdate(app.ipoId, app.appId, "ALLOTTED")}
                              disabled={app.status === "ALLOTTED"}
                              title="Set Allotted"
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-extrabold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              Allotted ✓
                            </button>
                            <button
                              onClick={() => handleManualStatusUpdate(app.ipoId, app.appId, "REFUNDED")}
                              disabled={app.status === "REFUNDED"}
                              title="Set Not Allotted"
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-extrabold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              Not Allotted ✗
                            </button>
                            <button
                              onClick={() => handleManualStatusUpdate(app.ipoId, app.appId, "AWAITING")}
                              disabled={app.status === "AWAITING"}
                              title="Reset to Awaiting"
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-[11px] font-extrabold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                              Awaiting ⏳
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── REAL PAN CHECK MODAL ── */}
      {isRealPanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative">
            <button onClick={() => setIsRealPanModalOpen(false)} className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
              <X size={18} />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <h3 className="text-lg font-black text-slate-900">Check Real PAN on Registrar</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Enter a real PAN card number to check allotment status on the registrar. You will still need to manually update the status based on the result.
              </p>
            </div>

            <form onSubmit={handleCheckRealPanSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  PAN Card Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={customPan}
                  onChange={(e) => setCustomPan(e.target.value.toUpperCase())}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                  Target Registrar <span className="text-rose-500">*</span>
                </label>
                <select value={customRegistrar} onChange={(e) => setCustomRegistrar(e.target.value)} className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer">
                  <option value="Link Intime India">Link Intime India Pvt Ltd</option>
                  <option value="KFin Technologies">KFin Technologies (KFintech)</option>
                  <option value="Bigshare Services">Bigshare Services Pvt Ltd</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Target IPO</label>
                <select value={customIpoId} onChange={(e) => setCustomIpoId(e.target.value)} className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer">
                  {ipos.map((ipo) => (
                    <option key={ipo.id} value={ipo.id}>{ipo.name}</option>
                  ))}
                </select>
              </div>

              {/* Result */}
              {checkResult && (
                <div className={`p-3.5 rounded-xl border text-xs font-bold space-y-1.5 ${
                  checkResult.status === "ALLOTTED" ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : checkResult.status === "REFUNDED" ? "bg-rose-50 border-rose-200 text-rose-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
                }`}>
                  <div className="flex items-center gap-2">
                    {checkResult.status === "ALLOTTED" ? <CheckCircle size={16} className="text-emerald-600" weight="fill" />
                    : checkResult.status === "REFUNDED" ? <XCircle size={16} className="text-rose-600" weight="fill" />
                    : <Hourglass size={16} className="text-amber-600" />}
                    <span className="font-extrabold uppercase">
                      {checkResult.status === "ALLOTTED" ? "ALLOTTED ✓"
                      : checkResult.status === "REFUNDED" ? "NOT ALLOTTED ✗"
                      : "AWAITING — Check registrar manually"}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium">{checkResult.message}</p>
                  <p className="text-[10px] text-slate-500 font-medium italic">
                    Go to the table above and click the correct status button to update. This result is for reference only.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isCheckingSingle || !customPan.trim()}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isCheckingSingle ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Querying Registrar...
                  </>
                ) : (
                  <>
                    <Sparkle size={16} />
                    <span>Check on Registrar</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
