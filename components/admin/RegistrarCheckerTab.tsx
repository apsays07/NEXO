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
  ArrowSquareOut,
  Sparkle,
  Funnel,
  Buildings,
  IdentificationCard,
  X,
  PencilSimple,
  PaperPlaneTilt,
  ArrowClockwise,
} from "@phosphor-icons/react";

export function RegistrarCheckerTab() {
  const { ipos, refreshIpos } = useAdmin();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIpoId, setSelectedIpoId] = useState<string>("ALL");
  const [revealedPans, setRevealedPans] = useState<Record<string, boolean>>({});

  // Local allotment marks (before publishing)
  // Key: appId, Value: true = marked as ALLOTTED
  const [localMarks, setLocalMarks] = useState<Record<string, boolean>>({});

  // Publishing state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<string | null>(null);

  // Real PAN Check Modal
  const [isRealPanModalOpen, setIsRealPanModalOpen] = useState(false);
  const [customPan, setCustomPan] = useState("");
  const [customRegistrar, setCustomRegistrar] = useState("Link Intime India");
  const [customIpoId, setCustomIpoId] = useState(ipos[0]?.id || "");
  const [checkResult, setCheckResult] = useState<any>(null);
  const [isCheckingSingle, setIsCheckingSingle] = useState(false);

  // Flatten all applications
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
      savedStatus: string; // status already saved in shared_ipos.json
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
        const normStatus =
          rawStatus === "ALLOTTED" ? "ALLOTTED"
          : rawStatus === "REFUNDED" || rawStatus === "NOT_ALLOTTED" ? "NOT_ALLOTTED"
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
          savedStatus: normStatus,
          registrarName: regName,
          registrarUrl: regUrl,
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

  // Get effective status for an applicant (local mark overrides saved)
  const getEffectiveStatus = (app: typeof allApplications[0]) => {
    if (localMarks[app.appId] === true) return "ALLOTTED";
    if (localMarks[app.appId] === false) return "AWAITING"; // edited back
    return app.savedStatus;
  };

  // Metrics
  const markedAllotted = filteredApplicants.filter((a) => getEffectiveStatus(a) === "ALLOTTED").length;
  const markedNotAllotted = filteredApplicants.filter((a) => getEffectiveStatus(a) === "NOT_ALLOTTED").length;
  const stillAwaiting = filteredApplicants.filter((a) => getEffectiveStatus(a) === "AWAITING").length;
  const hasUnpublishedChanges = Object.keys(localMarks).length > 0;

  const togglePan = (appId: string) => {
    setRevealedPans((prev) => ({ ...prev, [appId]: !prev[appId] }));
  };

  // Mark as allotted
  const markAllotted = (appId: string) => {
    setLocalMarks((prev) => ({ ...prev, [appId]: true }));
    setPublishResult(null);
  };

  // Edit (undo mark — set back to awaiting)
  const undoMark = (appId: string) => {
    setLocalMarks((prev) => {
      const copy = { ...prev };
      // If it was already saved as ALLOTTED in DB, set to false (awaiting)
      // Otherwise just remove the local mark
      copy[appId] = false;
      return copy;
    });
    setPublishResult(null);
  };

  // Remove local mark entirely (for items that were already saved)
  const removeMark = (appId: string) => {
    setLocalMarks((prev) => {
      const copy = { ...prev };
      delete copy[appId];
      return copy;
    });
    setPublishResult(null);
  };

  // ── PUBLISH ALL: marked = ALLOTTED, unmarked awaiting = NOT_ALLOTTED ──
  const publishAllResults = async () => {
    setIsPublishing(true);
    setPublishResult(null);

    let allottedCount = 0;
    let notAllottedCount = 0;

    try {
      // Process all visible applicants
      for (const app of filteredApplicants) {
        const effectiveStatus = getEffectiveStatus(app);
        let targetStatus: string;

        if (effectiveStatus === "ALLOTTED") {
          targetStatus = "ALLOTTED";
          allottedCount++;
        } else {
          // Everything not marked as ALLOTTED becomes NOT_ALLOTTED
          targetStatus = "REFUNDED";
          notAllottedCount++;
        }

        await fetch("/api/registrar-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateStatus",
            ipoId: app.ipoId,
            applicationId: app.appId,
            newStatus: targetStatus,
          }),
        });
      }

      window.dispatchEvent(new Event("storage"));
      await refreshIpos();
      setLocalMarks({});
      setPublishResult(`✓ Published! ${allottedCount} Allotted, ${notAllottedCount} Not Allotted — User side updated.`);
    } catch (err) {
      console.warn("Publish error:", err);
      setPublishResult("✗ Error publishing results. Try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Check real PAN
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
      setCheckResult(await res.json());
    } catch {
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
                Registrar Allotment Manager
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Allotment Status Manager
            </h1>
            <p className="text-xs text-slate-400 max-w-xl font-medium leading-relaxed">
              Mark applicants as <strong className="text-emerald-400">Allotted</strong>, then click <strong className="text-blue-400">Publish Results</strong> to send statuses to the user side. Unmarked applicants will be set as <strong className="text-rose-400">Not Allotted</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => { setIsRealPanModalOpen(true); setCheckResult(null); }}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <IdentificationCard size={16} className="text-amber-400" />
              <span>Check PAN</span>
            </button>

            <button
              onClick={publishAllResults}
              disabled={isPublishing || filteredApplicants.length === 0}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <PaperPlaneTilt size={16} weight="fill" />
              <span>{isPublishing ? "Publishing..." : "Publish Results to Users"}</span>
            </button>
          </div>
        </div>

        {/* Publish Result Banner */}
        {publishResult && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-bold ${
            publishResult.startsWith("✓")
              ? "bg-emerald-900/30 border-emerald-700/50 text-emerald-300"
              : "bg-rose-900/30 border-rose-700/50 text-rose-300"
          }`}>
            {publishResult}
          </div>
        )}
      </div>

      {/* ── METRICS ── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Marked Allotted ✓</span>
            <CheckCircle size={18} className="text-emerald-600" weight="fill" />
          </div>
          <p className="text-xl font-black text-emerald-900">{markedAllotted}</p>
          <p className="text-[10px] font-bold text-emerald-700">Will be published as Allotted</p>
        </div>

        <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Awaiting ⏳</span>
            <Hourglass size={18} className="text-amber-600" weight="bold" />
          </div>
          <p className="text-xl font-black text-amber-900">{stillAwaiting}</p>
          <p className="text-[10px] font-bold text-amber-700">Will become Not Allotted on publish</p>
        </div>

        <div className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">Not Allotted ✗</span>
            <XCircle size={18} className="text-rose-600" weight="fill" />
          </div>
          <p className="text-xl font-black text-rose-900">{markedNotAllotted}</p>
          <p className="text-[10px] font-bold text-rose-700">Already published as Not Allotted</p>
        </div>
      </div>

      {/* ── SEARCH & FILTER ── */}
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
          </div>
        </div>
      </div>

      {/* ── APPLICANTS TABLE ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            Applicant Records
            <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">{filteredApplicants.length}</span>
            {hasUnpublishedChanges && (
              <span className="text-xs font-bold text-amber-600 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full animate-pulse">
                Unpublished Changes
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
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
            <p className="text-xs text-slate-500 font-medium">Adjust your search or filters.</p>
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
                  <th className="py-3 px-4 text-center">Current Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-semibold text-slate-800">
                {filteredApplicants.map((app) => {
                  const isRevealed = revealedPans[app.appId];
                  const effectiveStatus = getEffectiveStatus(app);
                  const hasLocalMark = app.appId in localMarks;

                  return (
                    <tr
                      key={app.appId}
                      className={`transition-colors ${
                        effectiveStatus === "ALLOTTED"
                          ? "bg-emerald-50/40 hover:bg-emerald-50/70"
                          : effectiveStatus === "NOT_ALLOTTED"
                          ? "bg-rose-50/30 hover:bg-rose-50/50"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center border uppercase shrink-0 ${
                            effectiveStatus === "ALLOTTED"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}>
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

                      {/* Current Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {effectiveStatus === "ALLOTTED" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold">
                            <CheckCircle size={14} weight="fill" className="text-emerald-600" /> Allotted
                          </span>
                        )}
                        {effectiveStatus === "NOT_ALLOTTED" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-xs font-extrabold">
                            <XCircle size={14} weight="fill" className="text-rose-600" /> Not Allotted
                          </span>
                        )}
                        {effectiveStatus === "AWAITING" && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-extrabold">
                            <Hourglass size={14} className="text-amber-600" /> Awaiting
                          </span>
                        )}
                      </td>

                      {/* Action: One Allotted button OR Edit button */}
                      <td className="py-3.5 px-4 text-center">
                        {effectiveStatus === "ALLOTTED" ? (
                          /* Already marked — show Edit button to undo */
                          <button
                            onClick={() => {
                              // If it was a local mark, undo it
                              if (hasLocalMark) {
                                removeMark(app.appId);
                              } else {
                                // It was saved in DB as allotted, set local override to awaiting
                                undoMark(app.appId);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-extrabold transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                          >
                            <PencilSimple size={13} weight="bold" />
                            Edit
                          </button>
                        ) : effectiveStatus === "NOT_ALLOTTED" ? (
                          /* Already published as Not Allotted — show Edit to change */
                          <button
                            onClick={() => markAllotted(app.appId)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-extrabold transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                          >
                            <PencilSimple size={13} weight="bold" />
                            Edit
                          </button>
                        ) : (
                          /* Awaiting — show Allotted button */
                          <button
                            onClick={() => markAllotted(app.appId)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] text-white text-[11px] font-extrabold transition-all shadow-sm flex items-center gap-1.5 mx-auto cursor-pointer"
                          >
                            <CheckCircle size={14} weight="fill" />
                            Allotted ✓
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Publish Bar */}
        {filteredApplicants.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-600 space-x-3">
              <span className="text-emerald-700">✓ {markedAllotted} Allotted</span>
              <span className="text-amber-700">⏳ {stillAwaiting} Awaiting</span>
              <span className="text-rose-700">✗ {markedNotAllotted} Not Allotted</span>
            </div>
            <button
              onClick={publishAllResults}
              disabled={isPublishing || filteredApplicants.length === 0}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <PaperPlaneTilt size={14} weight="fill" />
              <span>{isPublishing ? "Publishing..." : "Publish All Results to Users"}</span>
            </button>
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
              <h3 className="text-lg font-black text-slate-900">Check PAN on Registrar</h3>
              <p className="text-xs text-slate-500 font-medium">
                Enter a real PAN card to check on registrar. Use the result to decide which applicants to mark as Allotted above.
              </p>
            </div>

            <form onSubmit={handleCheckRealPanSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">PAN Card Number <span className="text-rose-500">*</span></label>
                <input type="text" required maxLength={10} value={customPan} onChange={(e) => setCustomPan(e.target.value.toUpperCase())} placeholder="e.g. ABCDE1234F"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 uppercase placeholder:normal-case placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all" />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">Registrar <span className="text-rose-500">*</span></label>
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
                <div className={`p-3.5 rounded-xl border text-xs font-bold space-y-1 ${
                  checkResult.status === "ALLOTTED" ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : checkResult.status === "REFUNDED" ? "bg-rose-50 border-rose-200 text-rose-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
                }`}>
                  <div className="flex items-center gap-2">
                    {checkResult.status === "ALLOTTED" ? <CheckCircle size={16} className="text-emerald-600" weight="fill" />
                    : checkResult.status === "REFUNDED" ? <XCircle size={16} className="text-rose-600" weight="fill" />
                    : <Hourglass size={16} className="text-amber-600" />}
                    <span className="font-extrabold uppercase">
                      {checkResult.status === "ALLOTTED" ? "ALLOTTED ✓" : checkResult.status === "REFUNDED" ? "NOT ALLOTTED ✗" : "AWAITING — Check manually"}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium">{checkResult.message}</p>
                </div>
              )}

              <button type="submit" disabled={isCheckingSingle || !customPan.trim()}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer">
                {isCheckingSingle ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Checking...</>
                ) : (
                  <><Sparkle size={16} /> Check on Registrar</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
