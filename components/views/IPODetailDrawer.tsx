"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { StatusBadge, RecommendationBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { LifecycleBar } from "../ui/LifecycleBar";
import { MaskedPAN } from "../ui/MaskedPAN";
import { formatINR } from "@/lib/mockData";
import { X, UserPlus, CheckCircle } from "@phosphor-icons/react";

export function IPODetailDrawer() {
  const { selectedIpo, closeIpoDetail, openApplicationModal } = useNexo();

  if (!selectedIpo) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-3xl bg-[#FFFFFF] border-l border-[#E2E8F0] h-full overflow-y-auto flex flex-col justify-between shadow-2xl">
        <div>
          {/* HEADER */}
          <div className="p-6 border-b border-[#E2E8F0] sticky top-0 bg-[#FFFFFF]/95 backdrop-blur-md z-10 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-extrabold text-lg text-[#2563EB]">
                {selectedIpo.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                    {selectedIpo.name}
                  </h2>
                  <StatusBadge status={selectedIpo.status} size="sm" />
                </div>
                <div className="text-xs text-[#64748B] mt-0.5 font-medium">
                  {selectedIpo.company}
                </div>
              </div>
            </div>

            <button
              onClick={closeIpoDetail}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* LIFECYCLE PROGRESS BAR */}
            <div>
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Opportunity Progression Lifecycle
              </div>
              <LifecycleBar currentStage={selectedIpo.status} />
            </div>

            {/* OUR DECISION & THESIS */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Syndicate Analysis & Decision
                </span>
                <RecommendationBadge type={selectedIpo.recommendation} />
              </div>

              <div className="text-sm text-[#0F172A] leading-relaxed font-normal">
                "{selectedIpo.thesis}"
              </div>

              <div className="flex items-center justify-between text-xs text-[#64748B] pt-2 border-t border-[#E2E8F0] font-medium">
                <span>Analysis by {selectedIpo.createdBy} (Admin)</span>
                {selectedIpo.metrics.gmpPercent && (
                  <span className="text-[#059669] font-bold">
                    Current Grey Market Premium: +{selectedIpo.metrics.gmpPercent}% (₹
                    {selectedIpo.metrics.gmp})
                  </span>
                )}
              </div>
            </div>

            {/* KEY FINANCIAL METRICS */}
            <div>
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-3">
                Key Offer Financial Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs">
                  <span className="text-xs text-[#64748B] block font-medium">Price Band</span>
                  <span className="text-sm font-extrabold text-[#0F172A] num-tabular">
                    ₹{selectedIpo.metrics.priceBand.min} – ₹
                    {selectedIpo.metrics.priceBand.max}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs">
                  <span className="text-xs text-[#64748B] block font-medium">Lot Size</span>
                  <span className="text-sm font-extrabold text-[#0F172A] num-tabular">
                    {selectedIpo.metrics.lotSize} Shares
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs">
                  <span className="text-xs text-[#64748B] block font-medium">Minimum Cut-off</span>
                  <span className="text-sm font-extrabold text-[#0F172A] num-tabular">
                    {formatINR(selectedIpo.metrics.minInvestment)}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-2xs">
                  <span className="text-xs text-[#64748B] block font-medium">Issue Size</span>
                  <span className="text-sm font-extrabold text-[#0F172A]">
                    {selectedIpo.metrics.issueSize}
                  </span>
                </div>
              </div>

              {/* TIMELINE DATES */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                  <span className="text-[#64748B] block font-medium">Bidding Opens</span>
                  <span className="font-bold text-[#0F172A]">
                    {selectedIpo.metrics.openDate}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                  <span className="text-[#64748B] block font-medium">Bidding Closes</span>
                  <span className="font-bold text-[#D97706]">
                    {selectedIpo.metrics.closeDate}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                  <span className="text-[#64748B] block font-medium">Basis of Allotment</span>
                  <span className="font-bold text-[#0F172A]">
                    {selectedIpo.metrics.allotmentDate}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                  <span className="text-[#64748B] block font-medium">Listing Date</span>
                  <span className="font-bold text-[#0F172A]">
                    {selectedIpo.metrics.listingDate}
                  </span>
                </div>
              </div>
            </div>

            {/* OUR PARTICIPATION & APPLICATIONS */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                    Group Applications & Member Splits
                  </h3>
                  <p className="text-xs text-[#64748B] font-medium">
                    Automated pro-rata calculation of contributions & percentages
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-[#0F172A] num-tabular">
                    {formatINR(selectedIpo.combinedCapital)}
                  </div>
                  <div className="text-[11px] text-[#059669] font-bold">
                    {selectedIpo.participantsCount} Members Committed
                  </div>
                </div>
              </div>

              {selectedIpo.applications.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center">
                  <p className="text-sm text-[#475569] font-medium">
                    No group applications submitted for this opportunity yet.
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    className="mt-4"
                    onClick={() => openApplicationModal(selectedIpo)}
                  >
                    <UserPlus size={14} /> Initiate Solo / Combo Application
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedIpo.applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] space-y-4 shadow-xs"
                    >
                      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] font-extrabold text-xs">
                            {app.type} APPLICATION
                          </span>
                          <span className="text-xs font-mono text-[#64748B]">
                            {app.applicationNumber}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-[#0F172A] num-tabular">
                          Pooled: {formatINR(app.totalContribution)}
                        </span>
                      </div>

                      {/* Participant Rows */}
                      <div className="space-y-3">
                        {app.participants.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={p.avatar}
                                alt={p.memberName}
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E2E8F0]"
                              />
                              <div>
                                <div className="text-xs font-bold text-[#0F172A]">
                                  {p.memberName}
                                </div>
                                <MaskedPAN
                                  panMasked={p.panMasked}
                                  panFull={p.panFull}
                                />
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xs font-bold text-[#0F172A] num-tabular">
                                {formatINR(p.contribution)}
                              </div>
                              <div className="text-[11px] text-[#2563EB] font-bold num-tabular">
                                {p.percentage}% Share
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Verified Screenshot record */}
                      {app.applicationProofUrl && (
                        <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs">
                          <span className="text-[#047857] flex items-center gap-1.5 font-bold">
                            <CheckCircle size={16} className="text-[#059669]" /> Official
                            Application Proof Verified
                          </span>
                          <span className="text-[11px] text-[#059669] font-mono font-medium">
                            Timestamped & Vaulted
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-5 border-t border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-between">
          <div className="text-xs text-[#64748B] font-medium">
            Private Wealth Syndicate Security Protocol
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={closeIpoDetail}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => openApplicationModal(selectedIpo)}
            >
              <UserPlus size={14} /> Add Participation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
