"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { formatINR } from "@/lib/mockData";
import { Receipt, MagnifyingGlass } from "@phosphor-icons/react";

export function TransactionsTab() {
  const { transactions } = useNexo();

  return (
    <div className="space-y-5 font-sans text-ink pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">Transactions Ledger</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Audit log of all capital movements, submissions, allotments, and refunds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-ink-tertiary px-2.5 py-1 rounded-lg bg-surface border border-line">
            {transactions.length} Total Transactions
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-line p-5 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold text-ink-tertiary uppercase tracking-wider">
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Target IPO</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <tr key={tx.id} className="h-11 hover:bg-surface-hover transition-colors">
                    <td className="py-2 px-3 font-mono text-[11px] font-semibold text-ink">
                      #{tx.id.slice(0, 10)}
                    </td>
                    <td className="py-2 px-3 font-bold text-ink">{tx.ipoName}</td>
                    <td className="py-2 px-3 font-mono text-[10px]">{tx.type}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-ink">
                      {formatINR(tx.amount)}
                    </td>
                    <td className="py-2 px-3 font-semibold text-emerald-500">{tx.status}</td>
                    <td className="py-2 px-3 text-right text-ink-tertiary font-mono text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="h-11">
                  <td className="py-2 px-3 font-mono text-[11px] font-semibold text-ink">#TX-90412</td>
                  <td className="py-2 px-3 font-bold text-ink">Tata Technologies</td>
                  <td className="py-2 px-3 font-mono text-[10px]">SOLO</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-ink">{formatINR(15000)}</td>
                  <td className="py-2 px-3 font-semibold text-emerald-500">ALLOTTED</td>
                  <td className="py-2 px-3 text-right text-ink-tertiary font-mono text-[11px]">12 Aug 2026</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
