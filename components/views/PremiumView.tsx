"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import {
  Crown,
  Lightning,
  Sparkle,
  Check,
  CheckCircle,
  TrendUp,
  Fire,
  UsersThree,
  ChartLineUp,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";

export function PremiumView() {
  const {
    isPremiumUser,
    activePlan,
    activatePremiumPlan,
    openPremiumModal,
    ipos,
  } = useNexo();

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [selectedPanCount, setSelectedPanCount] = useState<number>(5);
  const [lotCount, setLotCount] = useState<number>(3);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [activatedNotice, setActivatedNotice] = useState(false);

  // Allotment odds boost math model
  const baseOdds = 15; // 15% standard retail odds
  const computedOdds = Math.min(96, Math.round(baseOdds * (1 + selectedPanCount * 0.45) * (1 + (lotCount - 1) * 0.1)));
  const estimatedListingGain = Math.round(selectedPanCount * lotCount * 14964 * 0.28);

  const handleUpgrade = (plan: string) => {
    activatePremiumPlan(plan);
    setActivatedNotice(true);
    setTimeout(() => setActivatedNotice(false), 3000);
  };

  const faqs = [
    {
      q: "How does Multi-PAN Group Routing boost allotment chances by 4.8x?",
      a: "SEBI allocates retail IPO lots on a lottery system per unique PAN card. By routing applications through multiple verified family & friend PAN cards simultaneously, your probability scales linearly with the number of unique PANs submitted.",
    },
    {
      q: "Is Multi-PAN capital pooling SEBI compliant?",
      a: "Yes. Nexo OS operates strictly within SEBI & RBI regulatory guidelines. Each application is filed under an individual verified DEMAT/PAN account with linked bank accounts or UPI handles.",
    },
    {
      q: "What is the Institutional GMP Telemetry engine?",
      a: "Our proprietary algorithm aggregates real-time grey market premium (GMP) trades from HNI desks in Mumbai, Gujarat, and Kolkata, providing live listing gain predictions 48 hours before official allotment.",
    },
    {
      q: "Can I upgrade or cancel my subscription anytime?",
      a: "Absolutely. You can change plans or cancel anytime with zero lock-in period. Annual plans come with a 14-day 100% money-back guarantee.",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in pb-16 font-sans">
      {/* Active Premium Banner Notice */}
      {isPremiumUser && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-emerald-500/15 border border-amber-500/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Crown size={20} weight="fill" />
            </div>
            <div>
              <span className="font-semibold text-[#111318] block text-sm">
                Nexo VIP Pro Active ({activePlan || "Pro Tier"})
              </span>
              <span className="text-[#5F6673] font-normal">
                Your account has full Multi-PAN routing & institutional GMP telemetry unlocked.
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 font-semibold text-[11px] border border-amber-500/40">
            ● VIP Active
          </span>
        </div>
      )}

      {activatedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-600" />
            <span>Success! Nexo Pro VIP Plan activated. All IPO applications will now be fast-tracked.</span>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <div className="relative rounded-3xl bg-[#090D16] border border-amber-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl text-white">
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkle size={16} weight="fill" /> INSTITUTIONAL IPO ALLOTMENT ENGINE
          </div>

          <h1 className="nexo-display text-white tracking-tight leading-tight">
            Stop Losing IPO Allotments to Random Lotteries.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Nexo VIP Pro combines Multi-PAN automated bidding, real-time institutional GMP telemetry, and instant UPI mandate synchronization to guarantee maximum allotment probability.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              size="lg"
              variant="success"
              className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-semibold border-none hover:from-amber-400 hover:to-yellow-300 shadow-xl shadow-amber-500/25 px-8"
              onClick={() => openPremiumModal(ipos[0])}
            >
              <Crown size={20} weight="fill" /> Apply IPO with Premium Pro
            </Button>

            <button
              onClick={() => {
                const el = document.getElementById("pricing-matrix");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              View Plan Comparison ↓
            </button>
          </div>
        </div>
      </div>

      {/* STATS HIGHLIGHT CLUSTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5F6673] uppercase tracking-wider">
              Group Capital Deployed
            </span>
            <div className="p-2 rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <ChartLineUp size={20} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#111318] num-tabular">
            ₹42.8 Cr+
          </div>
          <p className="text-xs text-[#059669] font-medium flex items-center gap-1">
            <TrendUp size={14} /> +34.2% Growth in Q3 2026
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5F6673] uppercase tracking-wider">
              Average Allotment Success Rate
            </span>
            <div className="p-2 rounded-xl bg-[#ECFDF3] text-[#12B76A]">
              <Lightning size={20} weight="fill" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#111318] num-tabular">
            84.2%
          </div>
          <p className="text-xs text-[#5F6673] font-normal">
            vs 14.8% standard retail single-PAN odds
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5F6673] uppercase tracking-wider">
              Active Group Members
            </span>
            <div className="p-2 rounded-xl bg-[#FFF5F5] text-[#E11D48]">
              <UsersThree size={20} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-semibold text-[#111318] num-tabular">
            12,480+
          </div>
          <p className="text-xs text-[#5F6673] font-normal">
            Verified Indian Investor Accounts
          </p>
        </div>
      </div>

      {/* INTERACTIVE ALLOTMENT ODDS CALCULATOR */}
      <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="nexo-h3 text-[#111318] flex items-center gap-2">
              <Lightning size={22} className="text-amber-500" weight="fill" /> Allotment Probability Calculator
            </h3>
            <p className="text-xs text-[#5F6673] font-normal mt-0.5">
              Simulate your allotment probability boost by configuring family PANs and lot investments.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] font-semibold text-xs border border-[#BFDBFE]">
            SEBI Lot Math Engine
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Area (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slider 1: Family PAN Cards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#111318]">
                  Number of Friend / Family PAN Cards:
                </label>
                <span className="font-semibold text-[#2563EB] font-mono text-sm bg-[#EFF6FF] px-2.5 py-0.5 rounded-lg border border-[#BFDBFE]">
                  {selectedPanCount} PAN Cards
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={selectedPanCount}
                onChange={(e) => setSelectedPanCount(Number(e.target.value))}
                className="w-full h-2.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
              />
              <div className="flex justify-between text-[11px] text-[#5F6673] font-mono">
                <span>1 Single PAN (15% odds)</span>
                <span>5 PANs (68% odds)</span>
                <span>10 PANs (96% odds)</span>
              </div>
            </div>

            {/* Slider 2: Investment Lots */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#111318]">
                  Number of Lots per Application:
                </label>
                <span className="font-semibold text-[#059669] font-mono text-sm bg-[#ECFDF3] px-2.5 py-0.5 rounded-lg border border-[#A6F4C5]">
                  {lotCount} Lots ({formatINR(lotCount * 14964)})
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={lotCount}
                onChange={(e) => setLotCount(Number(e.target.value))}
                className="w-full h-2.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#059669]"
              />
              <div className="flex justify-between text-[11px] text-[#5F6673] font-mono">
                <span>1 Lot</span>
                <span>3 Lots</span>
                <span>5 Lots (HNI Bidding)</span>
              </div>
            </div>
          </div>

          {/* Calculator Output Box (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white space-y-4 shadow-lg border border-slate-700">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkle size={16} weight="fill" /> PROBABILITY SIMULATION RESULT
            </div>

            <div>
              <span className="text-xs text-slate-400 block font-normal">Estimated Allotment Chance</span>
              <div className="text-4xl font-bold text-amber-400 num-tabular tracking-tight">
                {computedOdds}%
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                ⚡ +{computedOdds - baseOdds}% boost over single retail PAN
              </p>
            </div>

            <div className="pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-300">Est. Listing Day Gains:</span>
              <span className="font-semibold text-emerald-400 num-tabular text-sm">
                {formatINR(estimatedListingGain)}
              </span>
            </div>

            <Button
              size="md"
              variant="success"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-semibold border-none hover:from-amber-400 hover:to-yellow-300 shadow-md"
              onClick={() => openPremiumModal(ipos[0])}
            >
              Apply IPO with {selectedPanCount} PANs →
            </Button>
          </div>
        </div>
      </div>

      {/* PRICING MATRIX SECTION */}
      <div id="pricing-matrix" className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-xs font-semibold uppercase">
            PRO PRICING TIERS
          </span>
          <h2 className="nexo-h2 text-[#111318]">
            Choose the Right Vault Level for Your Capital
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6673] font-normal">
            All plans include SEBI compliant bank account linkage and encrypted PAN vaulting.
          </p>

          {/* Billing Switcher */}
          <div className="pt-2 flex items-center justify-center">
            <div className="p-1 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white text-[#111318] shadow-2xs"
                    : "text-[#5F6673] hover:text-[#111318]"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-[#2563EB] text-white font-semibold shadow-md shadow-[#2563EB]/20"
                    : "text-[#5F6673] hover:text-[#111318]"
                }`}
              >
                Annual Billed
                <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-bold uppercase">
                  Save 30%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Standard Free */}
          <Card className="p-6 flex flex-col justify-between space-y-6 border-[#E2E8F0]">
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#5F6673]">
                Starter Plan
              </div>
              <div>
                <h3 className="nexo-h3 text-[#111318]">Standard Free</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#111318] num-tabular">₹0</span>
                  <span className="text-xs text-[#5F6673]">/month</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-[#111318] pt-3 border-t border-[#E2E8F0]">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#059669]" /> Single PAN Bidding
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#059669]" /> Standard Retail Queue
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#059669]" /> Delayed GMP Data (12h)
                </li>
              </ul>
            </div>

            <Button variant="secondary" size="md" className="w-full">
              Current Standard Plan
            </Button>
          </Card>

          {/* Card 2: Nexo VIP Pro (FEATURED) */}
          <Card className="p-6 border-2 border-[#2563EB] bg-gradient-to-b from-[#F8FAFC] to-[#EFF6FF] flex flex-col justify-between space-y-6 relative shadow-lg">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#2563EB] text-white font-semibold text-[11px] uppercase tracking-wider shadow-md">
              🔥 MOST RECOMMENDED
            </div>

            <div className="space-y-4 pt-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#2563EB] flex items-center gap-1">
                <Crown size={16} weight="fill" /> VIP Pro
              </div>
              <div>
                <h3 className="nexo-h3 text-[#111318]">Nexo VIP Pro</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#2563EB] num-tabular">
                    {billingCycle === "annual" ? "₹999" : "₹1,499"}
                  </span>
                  <span className="text-xs text-[#5F6673]">/month</span>
                </div>
                <span className="text-[11px] text-[#5F6673] block mt-1 font-mono">
                  {billingCycle === "annual" ? "Billed annually ₹11,988/yr" : "Billed monthly"}
                </span>
              </div>

              <ul className="space-y-3 text-xs text-[#111318] pt-3 border-t border-[#BFDBFE]">
                <li className="flex items-center gap-2 font-semibold text-[#2563EB]">
                  <Check size={16} className="text-[#2563EB]" /> Up to 10 Family PAN Cards
                </li>
                <li className="flex items-center gap-2 font-semibold text-[#059669]">
                  <Check size={16} className="text-[#059669]" /> 4.8x Priority Allotment Routing
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#2563EB]" /> Real-time Institutional GMP Tracker
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#2563EB]" /> Instant Zerodha / Groww / Angel Sync
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#2563EB]" /> Tax & P&L Auto-Optimizer
                </li>
              </ul>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] font-semibold shadow-md shadow-[#2563EB]/20"
              onClick={() => handleUpgrade("Nexo VIP Pro")}
            >
              <Crown size={16} weight="fill" /> Upgrade to Pro VIP
            </Button>
          </Card>

          {/* Card 3: Institutional HNI */}
          <Card className="p-6 flex flex-col justify-between space-y-6 border-[#E2E8F0]">
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#111318]">
                Institutional
              </div>
              <div>
                <h3 className="nexo-h3 text-[#111318]">HNI Vault Pass</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#111318] num-tabular">
                    {billingCycle === "annual" ? "₹3,999" : "₹4,999"}
                  </span>
                  <span className="text-xs text-[#5F6673]">/month</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-[#111318] pt-3 border-t border-[#E2E8F0]">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#059669]" /> Unlimited Family Member PANs
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#059669]" /> Dedicated Institutional Desk & RM
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#059669]" /> HNI Anchor Book Telemetry
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-[#059669]" /> Custom API & Webhook Access
                </li>
              </ul>
            </div>

            <Button
              variant="secondary"
              size="md"
              className="w-full"
              onClick={() => handleUpgrade("HNI Vault Pass")}
            >
              Activate HNI Vault Pass
            </Button>
          </Card>
        </div>
      </div>

      {/* REAL-TIME GMP TELEMETRY TABLE */}
      <Card className="p-6 space-y-4 border-[#E2E8F0]">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <h3 className="nexo-h4 text-[#111318] flex items-center gap-2">
              <Fire size={18} className="text-[#E11D48]" weight="fill" /> Institutional GMP & Subscription Telemetry
            </h3>
            <p className="text-xs text-[#5F6673] font-normal mt-0.5">
              Live updates direct from HNI trading desks. Unlocked for Nexo Pro VIP members.
            </p>
          </div>

          <span className="text-[11px] font-semibold text-[#12B76A] bg-[#ECFDF3] px-2.5 py-1 rounded-full border border-[#A6F4C5]">
            ● Live Desk Feeds
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] nexo-table-header">
                <th className="py-2.5 px-3">IPO Name</th>
                <th className="py-2.5 px-3">Issue Price</th>
                <th className="py-2.5 px-3">Current GMP (₹)</th>
                <th className="py-2.5 px-3">Est. Listing Gain</th>
                <th className="py-2.5 px-3">QIB Sub (x)</th>
                <th className="py-2.5 px-3">HNI Sub (x)</th>
                <th className="py-2.5 px-3 text-right">Recommendation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] nexo-table-body">
              <tr>
                <td className="py-3 px-3 font-semibold text-[#111318]">Ather Energy Ltd</td>
                <td className="py-3 px-3 nexo-table-num text-[#111318]">₹324</td>
                <td className="py-3 px-3 font-semibold text-[#059669] nexo-table-num">₹142 (+43.8%)</td>
                <td className="py-3 px-3 font-medium text-[#059669] nexo-table-num">₹466 / share</td>
                <td className="py-3 px-3 nexo-table-num font-medium">64.2x</td>
                <td className="py-3 px-3 nexo-table-num font-medium">112.8x</td>
                <td className="py-3 px-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-[#ECFDF3] text-[#027A48] text-[11px] font-semibold">
                    HIGH ALLOTMENT DEMAND
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#111318]">Swiggy Limited</td>
                <td className="py-3 px-3 nexo-table-num text-[#111318]">₹390</td>
                <td className="py-3 px-3 font-semibold text-[#059669] nexo-table-num">₹88 (+22.5%)</td>
                <td className="py-3 px-3 font-medium text-[#059669] nexo-table-num">₹478 / share</td>
                <td className="py-3 px-3 nexo-table-num font-medium">38.4x</td>
                <td className="py-3 px-3 nexo-table-num font-medium">45.1x</td>
                <td className="py-3 px-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] text-[11px] font-semibold">
                    RECOMMENDED
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-[#111318]">Hyundai Motor India</td>
                <td className="py-3 px-3 nexo-table-num text-[#111318]">₹1,960</td>
                <td className="py-3 px-3 font-semibold text-[#059669] nexo-table-num">₹310 (+15.8%)</td>
                <td className="py-3 px-3 font-medium text-[#059669] nexo-table-num">₹2,270 / share</td>
                <td className="py-3 px-3 nexo-table-num font-medium">14.6x</td>
                <td className="py-3 px-3 nexo-table-num font-medium">22.4x</td>
                <td className="py-3 px-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#D97706] text-[11px] font-semibold">
                    WATCHING
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* FAQ SECTION */}
      <div className="space-y-4">
        <h3 className="nexo-h3 text-[#111318]">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-xs text-[#111318] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#5F6673] leading-relaxed border-t border-[#F1F5F9] pt-3 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
