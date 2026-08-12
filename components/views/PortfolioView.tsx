"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { MetricCard, Card } from "../ui/Card";
import { StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { Wallet, FileText, TrendUp, PencilSimple, Plus, X, CheckCircle, ArrowCounterClockwise } from "@phosphor-icons/react";
import { IPOOpportunity } from "@/types/nexo";

export function PortfolioView() {
  const { ipos, individualSavings, updateIndividualSavings, userContributions, updateUserContribution } = useNexo();

  // Edit Savings Modal State
  const [isEditSavingsModalOpen, setIsEditSavingsModalOpen] = useState(false);
  const [savingsInput, setSavingsInput] = useState(individualSavings.toString());
  const [quickAddFeedback, setQuickAddFeedback] = useState("");

  // Edit IPO Contribution Modal State
  const [editingIpo, setEditingIpo] = useState<IPOOpportunity | null>(null);
  const [contributionInput, setContributionInput] = useState("");

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

  // Individual aggregated metrics (only sum of edited/added amounts)
  const myTotalApplied = myHoldings.reduce(
    (sum, h) => sum + h.myContribution,
    0
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

  const myProfitPercent =
    myTotalApplied > 0
      ? ((myTotalProfit / myTotalApplied) * 100).toFixed(1)
      : "0";

  const availableSavings = Math.max(0, individualSavings - myTotalApplied);

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
            variant="outline"
            size="sm"
            onClick={handleResetAllToNil}
            className="text-xs text-[#64748B] hover:text-[#DC2626]"
            title="Reset all savings and contributions to 0"
          >
            <ArrowCounterClockwise size={14} weight="bold" />
            Reset to 0
          </Button>

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
          subtitle={`Unallocated: ${formatINR(availableSavings)}`}
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
          subtitle={myTotalApplied > 0 ? `Across ${myHoldings.filter((h) => h.hasContribution).length} edited investments` : "No money added yet"}
          icon={<FileText size={20} className="text-[#D97706]" />}
        />

        <MetricCard
          label="Total Profit (My Return)"
          value={myTotalProfit !== 0 ? formatINR(myTotalProfit, true) : "₹0"}
          change={myTotalApplied > 0 ? `+${myProfitPercent}%` : undefined}
          changeType="positive"
          subtitle={myTotalProfit !== 0 ? `Realized: ${formatINR(myRealizedProfit, true)} | Unrealized: ${formatINR(myUnrealizedProfit, true)}` : "No returns accrued"}
          icon={<TrendUp size={20} className="text-[#059669]" />}
        />
      </div>

      {/* Detailed Holdings & History */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2">
              My Individual Portfolio Holdings
              <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-full">
                Strict Individual View
              </span>
            </h3>
            <p className="text-xs text-[#64748B] font-medium">
              Only displaying user-edited contributions. Unedited items default to ₹0.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-3">IPO / Asset</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">My Contribution</th>
                <th className="py-3 px-3">Issue Price</th>
                <th className="py-3 px-3">Current / Exit</th>
                <th className="py-3 px-3 text-right">My Net Return</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {myHoldings.map(({ ipo, myContribution, myProfit, myRealized }) => (
                <tr key={ipo.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-extrabold text-[#0F172A] text-sm">{ipo.name}</div>
                    <div className="text-[11px] text-[#64748B] font-medium">{ipo.company}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={ipo.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 font-bold num-tabular">
                    {myContribution > 0 ? (
                      <span className="text-[#0F172A]">{formatINR(myContribution)}</span>
                    ) : (
                      <span className="text-[#94A3B8] font-semibold bg-[#F1F5F9] px-2 py-0.5 rounded-md">₹0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-[#475569] num-tabular">
                    ₹{ipo.issuePrice || ipo.metrics.priceBand.max}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#0F172A] num-tabular">
                    ₹{ipo.currentPrice || "-"}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    {myProfit !== 0 ? (
                      <div>
                        <div className="text-[#059669] font-extrabold num-tabular">
                          {formatINR(myProfit, true)}
                        </div>
                        <div className="text-[10px] text-[#059669] font-bold">
                          {myRealized > 0 ? "Realized" : "Unrealized Gain"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#94A3B8] font-medium">₹0</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => {
                        setEditingIpo(ipo);
                        setContributionInput(myContribution > 0 ? myContribution.toString() : "");
                      }}
                      className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EFF6FF] hover:bg-[#DBEAFE] px-2.5 py-1 rounded-lg transition-all border border-[#BFDBFE] inline-flex items-center gap-1 active:scale-95"
                    >
                      <PencilSimple size={12} weight="bold" />
                      {myContribution > 0 ? "Edit Money" : "+ Add Money"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                <div className="flex justify-between">
                  <span>Unallocated Balance:</span>
                  <span className="font-bold text-[#059669]">
                    {formatINR(Math.max(0, (parseFloat(savingsInput) || 0) - myTotalApplied))}
                  </span>
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

