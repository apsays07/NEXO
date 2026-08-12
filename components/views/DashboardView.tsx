"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { Card } from "../ui/Card";
import { StatusBadge, RecommendationBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { ArrowRight, Clock, ShieldCheck, UserPlus, CheckCircle } from "@phosphor-icons/react";

export function DashboardView() {
  const { ipos, openIpoDetail, openApplicationModal, setActiveTab } = useNexo();

  const featuredIpo = ipos.find((i) => i.isFeatured) || ipos[0];
  const activeIpos = ipos.filter((i) => i.id !== featuredIpo?.id);

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* 1. GREETING HEADER */}
      <DashboardHeader />

      {/* 2. PREMIUM FEATURED OPPORTUNITY CARD */}
      {featuredIpo && (
        <Card
          hoverable
          onClick={() => openIpoDetail(featuredIpo)}
          className="p-6 md:p-8 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl relative overflow-hidden group hover:border-[#CBD5E1] transition-all"
        >
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-extrabold text-base shadow-2xs">
                {featuredIpo.logo}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px] font-bold text-[#2563EB] tracking-wider uppercase">
                    FEATURED OPPORTUNITY
                  </span>
                  <span className="text-[#94A3B8]">•</span>
                  <span className="text-xs text-[#64748B] font-semibold">
                    {featuredIpo.category || "Mainboard IPO"}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight group-hover:text-[#2563EB] transition-colors">
                  {featuredIpo.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <StatusBadge status={featuredIpo.status} size="md" />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Financial Numbers (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider block mb-1">
                  Offer Price Band
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] num-tabular tracking-tight">
                  ₹{featuredIpo.metrics.priceBand.min} — ₹{featuredIpo.metrics.priceBand.max}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <div>
                  <span className="text-[#64748B] font-medium block">Lot Size</span>
                  <span className="text-sm font-extrabold text-[#0F172A] num-tabular mt-0.5 block">
                    {featuredIpo.metrics.lotSize} shares
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] font-medium block">Min Investment</span>
                  <span className="text-sm font-extrabold text-[#0F172A] num-tabular mt-0.5 block">
                    {formatINR(featuredIpo.metrics.minInvestment)}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] font-medium block">Bidding Closes</span>
                  <span className="text-sm font-extrabold text-[#D97706] mt-0.5 flex items-center gap-1">
                    <Clock size={14} />
                    <span>{featuredIpo.metrics.closeDate}</span>
                  </span>
                </div>
              </div>

              {featuredIpo.thesis && (
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                    Syndicate Thesis
                  </span>
                  <p className="text-xs sm:text-sm text-[#334155] font-medium leading-relaxed italic">
                    "{featuredIpo.thesis}"
                  </p>
                </div>
              )}
            </div>

            {/* Decision & Action Box (4 Cols) */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64748B]">Group Decision</span>
                  <RecommendationBadge type={featuredIpo.recommendation} size="sm" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] font-medium">Committed Capital</span>
                  <span className="text-sm font-extrabold text-[#059669] num-tabular">
                    {formatINR(featuredIpo.combinedCapital)}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant="primary"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  openIpoDetail(featuredIpo);
                }}
              >
                Inspect Opportunity <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {featuredIpo.applications
                  .flatMap((a) => a.participants)
                  .slice(0, 3)
                  .map((p, idx) => (
                    <img
                      key={idx}
                      src={p.avatar}
                      alt={p.memberName}
                      className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-2xs"
                    />
                  ))}
              </div>
              <span className="font-semibold text-[#475569]">
                <strong className="text-[#0F172A] font-extrabold">
                  {featuredIpo.participantsCount} Syndicate Members
                </strong>{" "}
                Participating ({formatINR(featuredIpo.combinedCapital)} pooled)
              </span>
            </div>

            <span className="text-xs font-extrabold text-[#2563EB] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              View Full Evaluation →
            </span>
          </div>
        </Card>
      )}


    </div>
  );
}
