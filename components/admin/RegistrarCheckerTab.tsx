"use client";

import React, { useState, useMemo } from "react";
import { useAdmin } from "../../admin/context/AdminContext";
import {
  MagnifyingGlass,
  CheckCircle,
  XCircle,
  Hourglass,
  Eye,
  EyeSlash,
  Sparkle,
  Funnel,
  IdentificationCard,
  X,
  PaperPlaneTilt,
  ArrowSquareOut,
} from "@phosphor-icons/react";

const STATUS_CYCLE: Array<"AWAITING" | "ALLOTTED" | "NOT_ALLOTTED"> = ["AWAITING", "ALLOTTED", "NOT_ALLOTTED"];

export function RegistrarCheckerTab() {
  const { ipos, refreshIpos } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  // Default to most recent IPO (first item in ipos array)
  const mostRecentIpoId = ipos[0]?.id || "ALL";
  const [selectedIpoId, setSelectedIpoId] = useState<string>(mostRecentIpoId);
  const [revealedPans, setRevealedPans] = useState<Record<string, boolean>>({});

  // Local status overrides (before publishing)
  const [localStatuses, setLocalStatuses] = useState<Record<string, "AWAITING" | "ALLOTTED" | "NOT_ALLOTTED">>({});

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);

  // Real PAN Modal
  const [isRealPanModalOpen, setIsRealPanModalOpen] = useState(false);
  const [customPan, setCustomPan] = useState("");
  const [customRegistrar, setCustomRegistrar] = useState("Link Intime India");
  const [customIpoId, setCustomIpoId] = useState(ipos[0]?.id || "");
  const [checkResult, setCheckResult] = useState<any>(null);
  const [isCheckingSingle, setIsCheckingSingle] = useState(false);

  // Flatten applications
  const allApplications = useMemo(() => {
    const list: Array<{
      ipoId: string;
      ipoName: string;
      appId: string;
      applicantName: string;
      panMasked: string;
      panFull?: string;
      applicationNumber: string;
      totalContribution: number;
      lotCount: number;
      savedStatus: "AWAITING" | "ALLOTTED" | "NOT_ALLOTTED";
    }> = [];

    ipos.forEach((ipo) => {
      const apps = ipo.applications || [];
      apps.forEach((app: any) => {
        const raw = app.allotmentStatus || app.status || "AWAITING";
        const norm: "AWAITING" | "ALLOTTED" | "NOT_ALLOTTED" =
          raw === "ALLOTTED" ? "ALLOTTED"
          : raw === "REFUNDED" || raw === "NOT_ALLOTTED" ? "NOT_ALLOTTED"
          : "AWAITING";

        list.push({
          ipoId: ipo.id,
          ipoName: ipo.name,
          appId: app.id,
          applicantName: app.applicantName || "Member Applicant",
          panMasked: app.panMasked || (app.panNumbers && app.panNumbers[0]) || "ABCDE1234F",
          panFull: (app.panNumbers && app.panNumbers[0]) || app.panMasked || "ABCDE1234F",
          applicationNumber: app.applicationNumber || `NEXO-APP-${app.id.slice(-4)}`,
          totalContribution: app.totalContribution || 15000,
          lotCount: app.lotCount || 1,
          savedStatus: norm,
        });
      });
    });

    return list;
  }, [ipos]);

  // Filtered
  const filteredApplicants = useMemo(() => {
    return allApplications.filter((item) => {
      if (selectedIpoId !== "ALL" && item.ipoId !== selectedIpoId) return false;
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
  }, [allApplications, selectedIpoId, searchQuery]);

  // Get current status (local override or saved)
  const getStatus = (app: typeof allApplications[0]): "AWAITING" | "ALLOTTED" | "NOT_ALLOTTED" => {
    return localStatuses[app.appId] ?? app.savedStatus;
  };

  // Single click cycles: AWAITING → ALLOTTED → NOT_ALLOTTED → AWAITING
  const cycleStatus = (appId: string) => {
    setPublishResult(null);
    setLocalStatuses((prev) => {
      const current = prev[appId] ?? allApplications.find((a) => a.appId === appId)?.savedStatus ?? "AWAITING";
      const currentIdx = STATUS_CYCLE.indexOf(current);
      const nextIdx = (currentIdx + 1) % STATUS_CYCLE.length;
      return { ...prev, [appId]: STATUS_CYCLE[nextIdx] };
    });
  };

  // Metrics
  const allotted = filteredApplicants.filter((a) => getStatus(a) === "ALLOTTED").length;
  const notAllotted = filteredApplicants.filter((a) => getStatus(a) === "NOT_ALLOTTED").length;
  const awaiting = filteredApplicants.filter((a) => getStatus(a) === "AWAITING").length;
  const hasChanges = Object.keys(localStatuses).length > 0;

  const togglePan = (appId: string) => {
    setRevealedPans((prev) => ({ ...prev, [appId]: !prev[appId] }));
  };

  // Publish all to server → user side updates
  const publishAllResults = async () => {
    setIsPublishing(true);
    setPublishResult(null);
    let allottedCount = 0;
    let notAllottedCount = 0;

    try {
      for (const app of filteredApplicants) {
        const status = getStatus(app);
        const apiStatus = status === "ALLOTTED" ? "ALLOTTED" : status === "NOT_ALLOTTED" ? "REFUNDED" : "AWAITING";

        if (apiStatus === "ALLOTTED") allottedCount++;
        else if (apiStatus === "REFUNDED") notAllottedCount++;

        await fetch("/api/registrar-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "updateStatus", ipoId: app.ipoId, applicationId: app.appId, newStatus: apiStatus }),
        });
      }

      window.dispatchEvent(new Event("storage"));
      await refreshIpos();
      setLocalStatuses({});
      setPublishResult(`✓ Published! ${allottedCount} Allotted, ${notAllottedCount} Not Allotted — User side updated.`);
    } catch (err) {
      setPublishResult("✗ Error publishing. Try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Check real PAN
  const handleCheckRealPan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPan.trim()) return;
    setIsCheckingSingle(true);
    setCheckResult(null);
    const targetIpo = ipos.find((i) => i.id === customIpoId) || ipos[0];
    try {
      const res = await fetch("/api/registrar-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "checkRealPan", pan: customPan.trim().toUpperCase(), registrar: customRegistrar, ipoName: targetIpo?.name || "IPO" }),
      });
      setCheckResult(await res.json());
    } catch { setCheckResult({ success: false, message: "Connection error." }); }
    finally { setIsCheckingSingle(false); }
  };

  // Status badge component (clickable)
  const StatusBadge = ({ status, onClick }: { status: string; onClick: () => void }) => {
    if (status === "ALLOTTED") {
      return (
        <button onClick={onClick} title="Click to change status" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold cursor-pointer hover:bg-emerald-200 active:scale-95 transition-all select-none">
          <CheckCircle size={14} weight="fill" className="text-emerald-600" /> Allotted
        </button>
      );
    }
    if (status === "NOT_ALLOTTED") {
      return (
        <button onClick={onClick} title="Click to change status" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-extrabold cursor-pointer hover:bg-rose-200 active:scale-95 transition-all select-none">
          <XCircle size={14} weight="fill" className="text-rose-600" /> Not Allotted
        </button>
      );
    }
    return (
      <button onClick={onClick} title="Click to change status" className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold cursor-pointer hover:bg-amber-200 active:scale-95 transition-all select-none">
        <Hourglass size={14} className="text-amber-600" /> Awaiting
      </button>
    );
  };

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">IPO Allotment</h1>
        <div className="flex items-center gap-3">
          <button onClick={publishAllResults} disabled={isPublishing || filteredApplicants.length === 0}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            <PaperPlaneTilt size={14} weight="fill" />
            {isPublishing ? "Publishing..." : "Publish Results"}
          </button>
        </div>
      </div>

      {publishResult && (
        <div className={`p-3 rounded-xl border text-xs font-bold ${publishResult.startsWith("✓") ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
          {publishResult}
        </div>
      )}

      {/* ── METRICS ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Allotted ✓</span>
            <CheckCircle size={18} className="text-emerald-600" weight="fill" />
          </div>
          <p className="text-xl font-black text-emerald-900">{allotted}</p>
        </div>
        <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Awaiting ⏳</span>
            <Hourglass size={18} className="text-amber-600" weight="bold" />
          </div>
          <p className="text-xl font-black text-amber-900">{awaiting}</p>
        </div>
        <div className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Not Allotted ✗</span>
            <XCircle size={18} className="text-rose-600" weight="fill" />
          </div>
          <p className="text-xl font-black text-rose-900">{notAllotted}</p>
        </div>
      </div>

      {/* ── SEARCH & FILTER ── */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Name, PAN, or App No..."
              className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer">✕</button>}
          </div>
          <div className="flex items-center gap-2">
            <Funnel size={16} className="text-slate-400 shrink-0" />
            <select value={selectedIpoId} onChange={(e) => setSelectedIpoId(e.target.value)} className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer">
              <option value="ALL">All IPOs ({ipos.length})</option>
              {ipos.map((ipo) => (<option key={ipo.id} value={ipo.id}>{ipo.name} ({ipo.applications?.length || 0})</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            Applicants
            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{filteredApplicants.length}</span>
            {hasChanges && <span className="text-xs font-bold text-amber-600 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">Unpublished</span>}
          </h2>
          <p className="text-[10px] font-bold text-slate-400">Click status badge to cycle: Awaiting → Allotted → Not Allotted</p>
        </div>

        {filteredApplicants.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <IdentificationCard size={36} className="text-slate-300 mx-auto" />
            <h3 className="text-sm font-extrabold text-slate-800">No applicants found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">PAN Card</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Allotment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-semibold text-slate-800">
                {filteredApplicants.map((app) => {
                  const isRevealed = revealedPans[app.appId];
                  const status = getStatus(app);

                  return (
                    <tr key={app.appId} className={`transition-colors ${
                      status === "ALLOTTED" ? "bg-emerald-50/40 hover:bg-emerald-50/70"
                      : status === "NOT_ALLOTTED" ? "bg-rose-50/30 hover:bg-rose-50/50"
                      : "hover:bg-slate-50/80"
                    }`}>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center border uppercase shrink-0 ${
                            status === "ALLOTTED" ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : status === "NOT_ALLOTTED" ? "bg-rose-100 text-rose-700 border-rose-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}>
                            {app.applicantName.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{app.applicantName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{app.ipoName} • {app.applicationNumber}</p>
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

                      <td className="py-3.5 px-4 text-right">
                        <p className="font-extrabold text-slate-900">₹{app.totalContribution.toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{app.lotCount} Lot</p>
                      </td>

                      {/* Clickable Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={status} onClick={() => cycleStatus(app.appId)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── PAN CHECK MODAL ── */}
      {isRealPanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative">
            <button onClick={() => setIsRealPanModalOpen(false)} className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Check PAN on Registrar</h3>
              <p className="text-xs text-slate-500 font-medium">Check a PAN on registrar for reference. Update status by clicking the badge in the table.</p>
            </div>
            <form onSubmit={handleCheckRealPan} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">PAN Number <span className="text-rose-500">*</span></label>
                <input type="text" required maxLength={10} value={customPan} onChange={(e) => setCustomPan(e.target.value.toUpperCase())} placeholder="e.g. ABCDE1234F"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Registrar</label>
                <select value={customRegistrar} onChange={(e) => setCustomRegistrar(e.target.value)} className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer">
                  <option value="Link Intime India">Link Intime India</option>
                  <option value="KFin Technologies">KFin Technologies</option>
                  <option value="Bigshare Services">Bigshare Services</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">IPO</label>
                <select value={customIpoId} onChange={(e) => setCustomIpoId(e.target.value)} className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer">
                  {ipos.map((ipo) => (<option key={ipo.id} value={ipo.id}>{ipo.name}</option>))}
                </select>
              </div>
              {checkResult && (
                <div className={`p-3 rounded-xl border text-xs font-bold space-y-1 ${checkResult.status === "ALLOTTED" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : checkResult.status === "REFUNDED" ? "bg-rose-50 border-rose-200 text-rose-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                  <div className="flex items-center gap-2">
                    {checkResult.status === "ALLOTTED" ? <CheckCircle size={16} className="text-emerald-600" weight="fill" /> : checkResult.status === "REFUNDED" ? <XCircle size={16} className="text-rose-600" weight="fill" /> : <Hourglass size={16} className="text-amber-600" />}
                    <span className="font-extrabold uppercase">{checkResult.status === "ALLOTTED" ? "ALLOTTED ✓" : checkResult.status === "REFUNDED" ? "NOT ALLOTTED ✗" : "AWAITING"}</span>
                  </div>
                  <p className="text-[11px] font-medium">{checkResult.message}</p>
                </div>
              )}
              <button type="submit" disabled={isCheckingSingle || !customPan.trim()}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer">
                {isCheckingSingle ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Checking...</> : <><Sparkle size={16} /> Check on Registrar</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
