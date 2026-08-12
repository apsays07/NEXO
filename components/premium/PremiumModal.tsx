"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { IPOOpportunity } from "@/types/nexo";
import { formatINR } from "@/lib/mockData";
import {
  X,
  Crown,
  Lightning,
  Sparkle,
  ShieldCheck,
  Check,
  CheckCircle,
  Tag,
  LockKey,
} from "@phosphor-icons/react";

interface PremiumModalProps {
  ipo?: IPOOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ ipo, isOpen, onClose }: PremiumModalProps) {
  const {
    activatePremiumPlan,
    openApplicationModal,
    isPremiumUser,
    activePlan,
  } = useNexo();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "vault">("pro");
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const targetIpoName = ipo ? ipo.name : "Nexo Premium Opportunities";
  const minInvest = ipo?.metrics.minInvestment || 14964;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "NEXOPRO2026" || promoCode.trim().toUpperCase() === "VIP50") {
      setDiscountApplied(true);
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try 'NEXOPRO2026' for 20% off.");
    }
  };

  const handleUpgradeAndApply = (planName: string) => {
    activatePremiumPlan(planName);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      if (ipo) {
        openApplicationModal(ipo);
      }
    }, 1400);
  };

  const handleProceedFree = () => {
    onClose();
    if (ipo) {
      openApplicationModal(ipo);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-[#0B0F17] border border-amber-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.15)] text-slate-100 my-8">
        {/* Glow ambient background elements */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header Bar */}
        <div className="relative z-10 p-6 sm:p-8 border-b border-slate-800/80 flex items-start justify-between bg-slate-900/40">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold tracking-wider uppercase">
                <Crown size={14} className="text-amber-400" /> NEXO PRO VIP ACCESS
              </span>
              {ipo && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium">
                  Target: {ipo.name}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Unlock 4.8x Allotment Boost for {targetIpoName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-normal">
              Multi-PAN Automated Bidding, Institutional Grey Market Telemetry & HNI Priority Queue Execution.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Modal State */}
        {isSuccess ? (
          <div className="relative z-10 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30 animate-bounce">
              <Crown size={36} weight="fill" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              🎉 Welcome to Nexo VIP Pro!
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto font-normal">
              Your account has been upgraded with Multi-PAN privileges. Opening application form for <strong className="text-amber-400">{targetIpoName}</strong>...
            </p>
          </div>
        ) : (
          <div className="relative z-10 p-6 sm:p-8 space-y-8">
            {/* Live Allotment Probability Booster Widget */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/30 space-y-4 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Lightning size={20} className="text-amber-400" weight="fill" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Live Allotment Probability Boost
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-400">
                  Minimum Lot Size: <strong className="text-white num-tabular font-semibold">{formatINR(minInvest)}</strong>
                </span>
              </div>

              {/* Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Free Standard */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Standard Free Queue</span>
                    <span className="text-slate-400 font-mono font-semibold">18.4% Odds</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-slate-600 rounded-full w-[18.4%]" />
                  </div>
                </div>

                {/* Nexo Pro VIP */}
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-semibold flex items-center gap-1">
                      <Sparkle size={14} className="text-amber-400" weight="fill" /> Nexo VIP Multi-PAN Queue
                    </span>
                    <span className="text-amber-400 font-mono font-bold">88.6% Odds (+381% Boost)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-amber-500/30">
                    <div className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full w-[88.6%] shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="flex items-center justify-center">
              <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-slate-800 text-white shadow-2xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Monthly Billed
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === "annual"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Annual Billed
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-950/80 text-amber-300 text-[10px] font-bold uppercase">
                    Save 30%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Starter Free */}
              <div
                onClick={() => setSelectedPlan("starter")}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                  selectedPlan === "starter"
                    ? "bg-slate-900 border-slate-600 shadow-md"
                    : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Standard
                    </span>
                    {selectedPlan === "starter" && (
                      <CheckCircle size={18} className="text-slate-400" weight="fill" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Starter Free</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white num-tabular">₹0</span>
                      <span className="text-xs text-slate-400 font-normal">/forever</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      Single PAN Application
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      Standard Retail Queue
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-400 shrink-0" />
                      Delayed GMP Updates (12h)
                    </li>
                    <li className="flex items-center gap-2 text-slate-500">
                      <X size={14} className="shrink-0" /> No Multi-PAN Auto Routing
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleProceedFree}
                  className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                >
                  Continue Free
                </button>
              </div>

              {/* Nexo VIP Pro (Featured) */}
              <div
                onClick={() => setSelectedPlan("pro")}
                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                  selectedPlan === "pro"
                    ? "bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
                    : "bg-slate-900/80 border-amber-500/50 hover:border-amber-500"
                }`}
              >
                {/* Popular Pill */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider shadow-md">
                  🔥 MOST POPULAR FOR IPOs
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Crown size={14} weight="fill" /> VIP Pro
                    </span>
                    {selectedPlan === "pro" && (
                      <CheckCircle size={20} className="text-amber-400" weight="fill" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Nexo VIP Pro</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-amber-400 num-tabular">
                        {discountApplied
                          ? billingCycle === "annual" ? "₹799" : "₹1,199"
                          : billingCycle === "annual" ? "₹999" : "₹1,499"}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">/month</span>
                      {discountApplied && (
                        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                          20% OFF
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      {billingCycle === "annual" ? "Billed annually (₹11,988/yr)" : "Billed monthly"}
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-amber-500/30">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-amber-400 shrink-0 font-semibold" />
                      <strong className="text-white font-semibold">Up to 10 Family PAN Cards</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-amber-400 shrink-0 font-semibold" />
                      <strong className="text-amber-300 font-semibold">4.8x Priority Allotment Routing</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-amber-400 shrink-0" />
                      Real-time Institutional GMP Tracker
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-amber-400 shrink-0" />
                      Instant Zerodha / Groww / Angel Sync
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-amber-400 shrink-0" />
                      Capital Gains Tax Optimizer
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpgradeAndApply("Nexo VIP Pro")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown size={16} weight="fill" /> Upgrade & Apply VIP
                </button>
              </div>

              {/* HNI Vault Pass */}
              <div
                onClick={() => setSelectedPlan("vault")}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                  selectedPlan === "vault"
                    ? "bg-slate-900 border-blue-500 shadow-md"
                    : "bg-slate-950/50 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-blue-400">
                      Institutional
                    </span>
                    {selectedPlan === "vault" && (
                      <CheckCircle size={18} className="text-blue-400" weight="fill" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">HNI Vault Pass</h4>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-white num-tabular">
                        {billingCycle === "annual" ? "₹3,999" : "₹4,999"}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-blue-400 shrink-0" />
                      Unlimited Family Member PANs
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-blue-400 shrink-0" />
                      Dedicated Institutional Desk & RM
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-blue-400 shrink-0" />
                      HNI Anchor Book Telemetry
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-blue-400 shrink-0" />
                      Automated Vault Allocation API
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleUpgradeAndApply("HNI Vault Pass")}
                  className="w-full py-2.5 rounded-xl border border-blue-500/40 bg-blue-600/20 hover:bg-blue-600/30 text-xs font-semibold text-blue-300 transition-colors cursor-pointer"
                >
                  Activate Vault Pass
                </button>
              </div>
            </div>

            {/* Promo Code Input Bar */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Tag size={18} className="text-amber-400 shrink-0" />
                <span className="font-semibold text-slate-300">Have a Pro Voucher Code?</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Try 'NEXOPRO2026'"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono font-medium tracking-wider uppercase text-white placeholder-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 focus:outline-none w-full sm:w-40"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Apply Code
                </button>
              </div>
            </div>

            {promoError && (
              <p className="text-xs text-rose-400 text-center font-normal">{promoError}</p>
            )}
            {discountApplied && (
              <p className="text-xs text-emerald-400 text-center font-semibold flex items-center justify-center gap-1">
                <CheckCircle size={14} /> Coupon &apos;NEXOPRO2026&apos; Applied! 20% Discount unlocked.
              </p>
            )}

            {/* Bottom Actions & Trust Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <ShieldCheck size={16} className="text-emerald-400" /> SEBI Compliant Protocol
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <LockKey size={16} className="text-amber-400" /> 256-bit Bank Encryption
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleProceedFree}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer font-medium"
                >
                  Proceed with Standard Application →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
