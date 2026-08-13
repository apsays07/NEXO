"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { CheckCircle, WarningCircle, ArrowSquareOut, ArrowsClockwise } from "@phosphor-icons/react";

export function AllotmentsTab() {
  const { ipos, updateApplicationStatus } = useNexo();
  const [selectedIpoId, setSelectedIpoId] = useState<string>(ipos[0]?.id || "");
  const [updating, setUpdating] = useState(false);

  const selectedIpo = ipos.find((i) => i.id === selectedIpoId) || ipos[0];

  const handleUpdateStatus = (appId: string, status: "ALLOTTED" | "NOT_ALLOTTED") => {
    if (!selectedIpo) return;
    setUpdating(true);
    updateApplicationStatus(selectedIpo.id, appId, status);
    setTimeout(() => setUpdating(false), 300);
  };

  return (
    <div className="space-y-5 font-sans text-ink pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">Allotment Processor</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Process registrar allotment declarations and allocate shares/refunds to group members
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedIpoId}
            onChange={(e) => setSelectedIpoId(e.target.value)}
            className="h-9 px-3 rounded-lg bg-surface border border-line text-xs font-bold text-ink cursor-pointer"
          >
            {ipos.map((ipo) => (
              <option key={ipo.id} value={ipo.id}>
                {ipo.name} ({ipo.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedIpo && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 rounded-2xl bg-surface border border-line p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div>
                <h2 className="text-sm font-bold text-ink uppercase tracking-wider">{selectedIpo.name} Applications</h2>
                <p className="text-xs text-ink-tertiary">Registrar link: {selectedIpo.registrarUrl || "KFintech Portal"}</p>
              </div>

              {selectedIpo.registrarUrl && (
                <a
                  href={selectedIpo.registrarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-surface-alt border border-line text-xs font-semibold text-accent hover:bg-surface-hover flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Registrar Portal</span>
                  <ArrowSquareOut size={14} />
                </a>
              )}
            </div>

            <div className="space-y-3">
              {selectedIpo.applications?.length ? (
                selectedIpo.applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl bg-surface-alt/60 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-ink">{app.applicantName || "Combo Group Pool"}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-line">
                          App #{app.applicationNumber || app.id}
                        </span>
                      </div>
                      <p className="text-xs text-ink-secondary mt-0.5">
                        Contribution: ₹{app.totalContribution.toLocaleString("en-IN")} • Allotment Status:{" "}
                        <strong className="text-ink">{app.allotmentStatus}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(app.id, "ALLOTTED")}
                        disabled={updating}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        Mark Allotted
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, "NOT_ALLOTTED")}
                        disabled={updating}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer"
                      >
                        Not Allotted
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-ink-tertiary">
                  No applications recorded for this IPO yet.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl bg-surface border border-line p-5 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-line/60 pb-2">
              ALLOTMENT GUIDELINES
            </h2>
            <div className="space-y-2 text-xs text-ink-secondary leading-relaxed">
              <p>• Verify status on official registrar (KFintech / Link Intime) using PAN or Application #.</p>
              <p>• Marking as <strong>ALLOTTED</strong> updates group holdings and unrealized P&L.</p>
              <p>• Marking as <strong>NOT ALLOTTED</strong> releases blocked capital back into available pool.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
