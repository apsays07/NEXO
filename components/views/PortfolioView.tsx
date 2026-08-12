"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { MetricCard, Card } from "../ui/Card";
import { StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { Wallet, FileText, TrendUp, PencilSimple, Plus, X, CheckCircle, ArrowCounterClockwise, Receipt, Users, Trash } from "@phosphor-icons/react";
import { IPOOpportunity } from "@/types/nexo";

export function PortfolioView() {
  const { ipos, individualSavings, updateIndividualSavings, userContributions, updateUserContribution, transactions, clearTransactions, deleteTransaction } = useNexo();

  // Edit Savings Modal State
  const [isEditSavingsModalOpen, setIsEditSavingsModalOpen] = useState(false);
  const [savingsInput, setSavingsInput] = useState(individualSavings.toString());
  const [quickAddFeedback, setQuickAddFeedback] = useState("");

  // Edit IPO Contribution Modal State
  const [editingIpo, setEditingIpo] = useState<IPOOpportunity | null>(null);
  const [contributionInput, setContributionInput] = useState("");

  // Delete confirmation: which txn ID is pending confirm
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Calculate individual holdings strictly from user-added/edited contributions
  const myHoldings = ipos.map((ipo) => {
    // If user has explicitly edited/added contribution for this IPO, use it; otherwise 0 (NIL)
    const myContribution = userContributions[ipo.id] ?? 0;

    let myRealized = 0;
    let myUnrealized = 0;

    if (myContribution > 0) {
      if (ipo.status === "SOLD" && ipo.listingGainPercent) {
        myRealized = Math.round((myContribution * ipo.listingGainPercent) / 100);
      } else if (ipo.status === "HOLDING" && ipo.listingGainPercent) {
        myUnrealized = Math.round((myContribution * ipo.listingGainPercent) / 100);
      } else if (ipo.status === "HOLDING" && ipo.issuePrice && ipo.currentPrice) {
        const gainRatio = (ipo.currentPrice - ipo.issuePrice) / ipo.issuePrice;
        myUnrealized = Math.round(myContribution * gainRatio);
      }
    }

    return {
      ipo,
      myContribution,
      myRealized,
      myUnrealized,
      myProfit: myRealized + myUnrealized,
      hasContribution: myContribution > 0,
    };
  });

  // Sum applied from transactions (all types)
  const txnTotalApplied = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Individual aggregated metrics (only sum of edited/added amounts)
  const myTotalApplied = Math.max(txnTotalApplied,
    myHoldings.reduce((sum, h) => sum + h.myContribution, 0)
  );
  const myRealizedProfit = myHoldings.reduce(
    (sum, h) => sum + h.myRealized,
    0
  );
  const myUnrealizedProfit = myHoldings.reduce(
    (sum, h) => sum + h.myUnrealized,
    0
  );
  const myTotalProfit = myRealizedProfit + myUnrealizedProfit;

  const handleSaveSavings = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(savingsInput);
    if (!isNaN(val) && val >= 0) {
      updateIndividualSavings(val);
      setIsEditSavingsModalOpen(false);
      setQuickAddFeedback("");
    }
  };

  const handleQuickAddSavings = (amountToAdd: number) => {
    const currentVal = parseFloat(savingsInput) || 0;
    const newVal = currentVal + amountToAdd;
    setSavingsInput(newVal.toString());
    setQuickAddFeedback(`+ ₹${amountToAdd.toLocaleString("en-IN")} added! Click Save to apply.`);
    setTimeout(() => setQuickAddFeedback(""), 3000);
  };

  const handleSaveContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIpo) return;
    const val = parseFloat(contributionInput);
    if (!isNaN(val) && val >= 0) {
      updateUserContribution(editingIpo.id, val);
      setEditingIpo(null);
      setContributionInput("");
    }
  };

  const handleResetAllToNil = () => {
    updateIndividualSavings(0);
    ipos.forEach((ipo) => updateUserContribution(ipo.id, 0));
    clearTransactions();
    try {
      localStorage.removeItem("nexo_individualSavings");
      localStorage.removeItem("nexo_userContributions");
      localStorage.removeItem("nexo_transactions");
    } catch {}
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Portfolio Mode Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-[#EFF6FF] via-[#F0F9FF] to-[#ECFDF5] border border-[#BFDBFE] p-4 rounded-2xl gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#2563EB] text-white rounded-xl shadow-xs">
            <Wallet size={20} weight="bold" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#1E3A8A]">
              My Individual Management
            </h2>
            <p className="text-xs text-[#3B82F6] font-medium">
              Only displaying values you explicitly edit or add. All other values remain 0.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSavingsInput(individualSavings.toString());
              setIsEditSavingsModalOpen(true);
            }}
            className="shadow-sm"
          >
            <PencilSimple size={15} weight="bold" />
            Edit / Add Savings
          </Button>
        </div>
      </div>

      {/* Individual Overview Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Total Balance (My Savings)"
          value={individualSavings > 0 ? formatINR(individualSavings) : "₹0"}
          icon={<Wallet size={20} className="text-[#2563EB]" />}
          action={
            <button
              onClick={() => {
                setSavingsInput(individualSavings.toString());
                setIsEditSavingsModalOpen(true);
              }}
              className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-2 py-1 rounded-lg transition-colors flex items-center gap-1 border border-[#BFDBFE]"
              title="Edit or add savings"
            >
              <PencilSimple size={13} weight="bold" />
              Edit
            </button>
          }
        />

        <MetricCard
          label="Total Applied (My Capital)"
          value={myTotalApplied > 0 ? formatINR(myTotalApplied) : "₹0"}
          icon={<FileText size={20} className="text-[#D97706]" />}
        />

        <MetricCard
          label="Total Profit (My Return)"
          value={myTotalProfit !== 0 ? formatINR(myTotalProfit, true) : "₹0"}
          icon={<TrendUp size={20} className="text-[#059669]" />}
        />
      </div>

      {/* Transactions Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-[#2563EB]" />
            <h3 className="text-base font-extrabold text-[#0F172A]">My Transactions</h3>
            {transactions.length > 0 && (
              <span className="text-[10px] font-bold text-white bg-[#2563EB] px-2 py-0.5 rounded-full">
                {transactions.length}
              </span>
            )}
          </div>
          <span className="text-xs text-[#64748B] font-medium">All IPO applications — Solo &amp; Group</span>
        </div>

        {transactions.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
              <Receipt size={24} className="text-[#94A3B8]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#64748B]">No transactions yet</p>
              <p className="text-xs text-[#94A3B8] mt-1">Apply to an IPO (solo or group) to see it here</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-3">IPO</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Participants</th>
                  <th className="py-3 px-3">Amount Applied</th>
                  <th className="py-3 px-3">App No.</th>
                  <th className="py-3 px-3">Date &amp; Time</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {transactions.map((txn) => {
                  const d = new Date(txn.createdAt);
                  const dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                  const timeStr = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
                  return (
                    <tr key={txn.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-extrabold text-[#0F172A] text-sm">{txn.ipoName}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        {txn.type === "SOLO" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-full">
                            <Wallet size={10} weight="bold" /> Solo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] bg-[#F5F3FF] border border-[#DDD6FE] px-2 py-0.5 rounded-full">
                            <Users size={10} weight="bold" /> Group
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-[#475569] font-medium">
                        {txn.participants.join(", ") || "—"}
                      </td>
                      <td className="py-3.5 px-3 font-extrabold text-[#0F172A] num-tabular">
                        {formatINR(txn.amount)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-[#64748B]">
                        {txn.applicationNumber}
                      </td>
                      <td className="py-3.5 px-3 text-[#64748B]">
                        <div className="font-medium">{dateStr}</div>
                        <div className="text-[10px] font-mono text-[#94A3B8]">{timeStr}</div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {txn.status === "SUBMITTED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 rounded-full">
                            <CheckCircle size={10} weight="fill" /> Submitted
                          </span>
                        )}
                        {txn.status === "ALLOTTED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                            <CheckCircle size={10} weight="fill" /> Allotted
                          </span>
                        )}
                        {txn.status === "REFUNDED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B] bg-[#F1F5F9] border border-[#CBD5E1] px-2 py-0.5 rounded-full">
                            Refunded
                          </span>
                        )}
                        {txn.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-2 py-0.5 rounded-full">
                            Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {confirmDeleteId === txn.id ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                deleteTransaction(txn.id);
                                setConfirmDeleteId(null);
                              }}
                              className="text-[11px] font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] px-2 py-1 rounded-lg transition-all active:scale-95"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-[11px] font-bold text-[#64748B] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-2 py-1 rounded-lg transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(txn.id)}
                            title="Delete this application"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] px-2.5 py-1 rounded-lg transition-all active:scale-95"
                          >
                            <Trash size={12} weight="bold" />
                            Delete
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
      </Card>

      {/* EDIT / ADD SAVINGS MODAL */}
      {isEditSavingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2E8F0] relative">
            <button
              onClick={() => {
                setIsEditSavingsModalOpen(false);
                setQuickAddFeedback("");
              }}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              <X size={18} weight="bold" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-[#EFF6FF] text-[#2563EB] rounded-xl border border-[#BFDBFE]">
                <Wallet size={24} weight="bold" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#0F172A]">
                  Edit Individual Savings Balance
                </h3>
                <p className="text-xs text-[#64748B]">
                  Enter your individual savings capital pool. Unedited values remain NIL (₹0).
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSavings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                  Total Individual Savings (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-extrabold text-[#64748B]">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={savingsInput}
                    onChange={(e) => setSavingsInput(e.target.value)}
                    placeholder="Enter total savings amount"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-base font-bold text-[#0F172A] outline-none transition-all"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div>
                <span className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                  Quick Add Funds
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[10000, 25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickAddSavings(amt)}
                      className="py-1.5 px-2 bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#BFDBFE] rounded-lg text-xs font-bold text-[#1E3A8A] transition-all flex items-center justify-center gap-0.5 active:scale-95"
                    >
                      <Plus size={12} weight="bold" />₹{amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {quickAddFeedback && (
                <div className="p-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-lg text-xs text-[#059669] font-bold flex items-center gap-1.5">
                  <CheckCircle size={14} weight="fill" />
                  {quickAddFeedback}
                </div>
              )}

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs space-y-1 text-[#64748B]">
                <div className="flex justify-between">
                  <span>Total Applied Capital:</span>
                  <span className="font-bold text-[#0F172A]">{formatINR(myTotalApplied)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsEditSavingsModalOpen(false);
                    setQuickAddFeedback("");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Balance
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT IPO CONTRIBUTION MODAL */}
      {editingIpo && (() => {
        const ipoLotVal = editingIpo.metrics.minInvestment ||
          (editingIpo.metrics.lotSize * editingIpo.metrics.priceBand.max);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E2E8F0] relative">
              <button
                onClick={() => {
                  setEditingIpo(null);
                  setContributionInput("");
                }}
                className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <X size={18} weight="bold" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-[#FEF3C7] text-[#D97706] rounded-xl border border-[#FDE68A]">
                  <FileText size={24} weight="bold" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F172A]">
                    Edit Contribution: {editingIpo.name}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    1 Lot minimum investment = <span className="font-bold text-[#0F172A]">{formatINR(ipoLotVal)}</span> ({editingIpo.metrics.lotSize} shares @ ₹{editingIpo.metrics.priceBand.max})
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveContribution} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                    My Individual Contribution Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-extrabold text-[#64748B]">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={contributionInput}
                      onChange={(e) => setContributionInput(e.target.value)}
                      placeholder={`Enter amount (1 Lot = ₹${ipoLotVal})`}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-base font-bold text-[#0F172A] outline-none transition-all"
                      required
                      min="0"
                    />
                  </div>
                </div>

                {/* Preset Contribution Pills */}
                <div>
                  <span className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">
                    Quick Lot Presets
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "₹0", val: 0 },
                      { label: "1 Lot", val: ipoLotVal },
                      { label: "2 Lots", val: ipoLotVal * 2 },
                      { label: "3 Lots", val: ipoLotVal * 3 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setContributionInput(item.val.toString())}
                        className="py-1.5 px-2 bg-[#F8FAFC] hover:bg-[#FEF3C7] border border-[#E2E8F0] hover:border-[#FDE68A] rounded-lg text-xs font-bold text-[#D97706] transition-all flex flex-col items-center justify-center active:scale-95"
                      >
                        <span>{item.label}</span>
                        {item.val > 0 && (
                          <span className="text-[10px] text-[#64748B] font-semibold">
                            ₹{(item.val / 1000).toFixed(1)}k
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingIpo(null);
                      setContributionInput("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm">
                    Save Contribution
                  </Button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

