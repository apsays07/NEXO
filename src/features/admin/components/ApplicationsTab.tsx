"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { formatINR } from "@/lib/mockData";
import { MagnifyingGlass, Funnel, Download, CheckCircle, Clock, Warning } from "@phosphor-icons/react";

export function ApplicationsTab() {
  const { ipos } = useNexo();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INDIVIDUAL" | "COMBINED">("ALL");

  const visibleIpos = ipos.filter((i) => !i.isHidden);
  const allApps = visibleIpos.flatMap((ipo) =>
    (ipo.applications || []).map((app) => ({
      ...app,
      ipoName: ipo.name,
      ipoId: ipo.id,
    }))
  );

  const filteredApps = allApps.filter((app) => {
    const matchesSearch =
      !search ||
      app.ipoName.toLowerCase().includes(search.toLowerCase()) ||
      (app.applicantName && app.applicantName.toLowerCase().includes(search.toLowerCase())) ||
      (app.applicationNumber && app.applicationNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesType =
      filterType === "ALL" ||
      (filterType === "INDIVIDUAL" && app.type === "INDIVIDUAL") ||
      (filterType === "COMBINED" && (app.type === "COMBINED" || app.type === "COMBO"));

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-5 font-sans text-ink pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">Applications Ledger</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Review member solo & combo IPO application submissions and payment proofs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <MagnifyingGlass size={14} className="absolute left-2.5 top-2.5 text-ink-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter applications..."
              className="h-8.5 pl-8 pr-3 rounded-lg bg-surface border border-line text-xs text-ink focus:outline-hidden"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="h-8.5 px-2.5 rounded-lg bg-surface border border-line text-xs font-semibold text-ink cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="COMBINED">Combo Pool</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-line p-5 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold text-ink-tertiary uppercase tracking-wider">
                <th className="py-2.5 px-3">Applicant / Group</th>
                <th className="py-2.5 px-3">IPO Target</th>
                <th className="py-2.5 px-3">App #</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Contribution</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id} className="h-12 hover:bg-surface-hover transition-colors">
                    <td className="py-2 px-3 font-bold text-ink">
                      {app.applicantName || "Combo Group Pool"}
                    </td>
                    <td className="py-2 px-3 text-ink-secondary font-semibold">
                      {app.ipoName}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-ink-tertiary">
                      {app.applicationNumber || `#${app.id.slice(0, 8)}`}
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-alt border border-line">
                        {app.type}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-ink">
                      {formatINR(app.totalContribution)}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          app.allotmentStatus === "ALLOTTED"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {app.allotmentStatus || app.status || "SUBMITTED"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button className="text-xs font-semibold text-accent hover:underline cursor-pointer">
                        Verify →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-ink-tertiary">
                    No applications match the active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
