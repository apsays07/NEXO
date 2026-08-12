"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { StatusBadge, RecommendationBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { LifecycleBar } from "../ui/LifecycleBar";
import { MaskedPAN } from "../ui/MaskedPAN";
import { formatINR } from "@/lib/mockData";
import { X, UserPlus, ShieldCheck } from "@phosphor-icons/react";

export function IPODetailDrawer() {
  const { selectedIpo, closeIpoDetail, openApplicationModal } = useNexo();

  if (!selectedIpo) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full max-w-2xl bg-white border-l border-[#E2E8F0] h-full overflow-y-auto flex flex-col justify-between shadow-2xl">
        <div>
          {/* HEADER */}
          <div className="p-5 border-b border-[#E2E8F0] sticky top-0 bg-white/95 backdrop-blur-md z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-semibold text-base text-[#2563EB]">
                {selectedIpo.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="nexo-h4 text-[#111318]">
                    {selectedIpo.name}
                  </h2>
                  <StatusBadge status={selectedIpo.status} size="sm" />
                </div>
                <div className="text-xs text-[#5F6673] font-normal">
                  {selectedIpo.company}
                </div>
              </div>
            </div>

            <button
              onClick={closeIpoDetail}
              className="p-1.5 rounded-lg text-[#5F6673] hover:text-[#111318] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* LIFECYCLE PROGRESS TRACKER */}
            <div className="space-y-2">
              <div className="text-[12px] font-semibold text-[#5F6673] uppercase tracking-wider">
                Lifecycle Stage
              </div>
              <LifecycleBar currentStage={selectedIpo.status} />
            </div>

            {/* GROUP RECOMMENDATION & COMMENT */}
            <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#027A48]">
                  <ShieldCheck size={16} />
                  <span>GROUP RECOMMENDATION</span>
                </div>
                <RecommendationBadge type={selectedIpo.recommendation} size="sm" />
              </div>

              <p className="text-xs text-[#027A48] font-medium leading-relaxed italic">
                "{selectedIpo.thesis}"
              </p>

              <div className="text-[12px] text-[#059669] pt-1.5 border-t border-[#A6F4C5]/60 font-medium">
                Decision by <strong>{selectedIpo.createdBy}</strong> (Admin)
              </div>
            </div>

            {/* KEY OFFER METRICS (4 Essential Items) */}
            <div className="space-y-2">
              <div className="text-[12px] font-semibold text-[#5F6673] uppercase tracking-wider">
                Offer Details
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[12px] text-[#5F6673] block font-medium uppercase">Price Band</span>
                  <span className="text-xs font-semibold text-[#111318] num-tabular">
                    ₹{selectedIpo.metrics.priceBand.min} – ₹{selectedIpo.metrics.priceBand.max}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[12px] text-[#5F6673] block font-medium uppercase">Lot Size</span>
                  <span className="text-xs font-semibold text-[#111318] num-tabular">
                    {selectedIpo.metrics.lotSize} Shares
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[12px] text-[#5F6673] block font-medium uppercase">Min Investment</span>
                  <span className="text-xs font-semibold text-[#111318] num-tabular">
                    {formatINR(selectedIpo.metrics.minInvestment)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[12px] text-[#5F6673] block font-medium uppercase">Last Date</span>
                  <span className="text-xs font-semibold text-[#D97706]">
                    {selectedIpo.metrics.closeDate}
                  </span>
                </div>
              </div>
            </div>

            {/* GROUP PARTICIPATION & MEMBER SPLITS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <div>
                  <div className="text-[12px] font-semibold text-[#5F6673] uppercase tracking-wider">
                    Group Applications
                  </div>
                  <div className="text-xs font-semibold text-[#111318]">
                    {selectedIpo.participantsCount} Members Participating
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-[#12B76A] num-tabular">
                    {formatINR(selectedIpo.combinedCapital)} Committed
                  </span>
                </div>
              </div>

              {selectedIpo.applications.length === 0 ? (
                <div className="p-6 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center space-y-3">
                  <p className="text-xs text-[#5F6673] font-normal">
                    No group applications filed for this IPO yet.
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => openApplicationModal(selectedIpo)}
                  >
                    <UserPlus size={14} /> Join Application
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedIpo.applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E2E8F0]">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] font-semibold text-[11px]">
                            {app.type} POOL
                          </span>
                          <span className="font-mono text-[12px] text-[#5F6673]">
                            {app.applicationNumber}
                          </span>
                        </div>
                        <span className="font-semibold text-[#111318] num-tabular">
                          {formatINR(app.totalContribution)}
                        </span>
                      </div>

                      {/* Participant List */}
                      <div className="space-y-2">
                        {app.participants.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.avatar}
                                alt={p.memberName}
                                className="w-7 h-7 rounded-full object-cover"
                              />
                              <div>
                                <div className="font-semibold text-[#111318]">
                                  {p.memberName}
                                </div>
                                <MaskedPAN
                                  panMasked={p.panMasked || "XXXXXXXX41"}
                                  panFull={p.panFull}
                                />
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="font-semibold text-[#111318] num-tabular">
                                {formatINR(p.contribution)}
                              </div>
                              <div className="text-[12px] text-[#2563EB] font-medium num-tabular">
                                {p.percentage}% Share
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-xs">
          <Button variant="secondary" size="sm" onClick={closeIpoDetail}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openApplicationModal(selectedIpo)}
          >
            <UserPlus size={14} /> Join / Add Application
          </Button>
        </div>
      </div>
    </div>
  );
}
