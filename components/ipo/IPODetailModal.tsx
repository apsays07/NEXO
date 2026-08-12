"use client";

import React from "react";
import { IPOOpportunity } from "@/types/nexo";
import { formatINR } from "@/lib/mockData";
import { Button } from "../ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  CheckCircle,
  Circle,
  Info,
} from "@phosphor-icons/react";

interface IPODetailModalProps {
  ipo: IPOOpportunity;
  isOpen: boolean;
  onClose: () => void;
  onApply: (ipo: IPOOpportunity) => void;
}

type StepStatus = "done" | "active" | "upcoming";

function getSteps(ipo: IPOOpportunity) {
  const stage = ipo.status;
  const done = (stages: string[]) => stages.includes(stage);
  const active = (s: string) => stage === s;

  return [
    {
      label: "IPO open date",
      date: ipo.metrics.openDate,
      status: (done(["APPLICATION_OPEN", "APPLYING", "APPLIED", "ALLOTMENT_PENDING", "ALLOTTED", "NOT_ALLOTTED", "LISTED", "HOLDING", "SOLD", "CLOSED"])
        ? "done" : active("RESEARCHING") || active("WATCHLIST") ? "active" : "upcoming") as StepStatus,
    },
    {
      label: "IPO close date",
      date: ipo.metrics.closeDate,
      status: (done(["APPLIED", "ALLOTMENT_PENDING", "ALLOTTED", "NOT_ALLOTTED", "LISTED", "HOLDING", "SOLD", "CLOSED"])
        ? "done" : active("APPLICATION_OPEN") || active("APPLYING") ? "active" : "upcoming") as StepStatus,
    },
    {
      label: "Allotment date",
      date: ipo.metrics.allotmentDate,
      status: (done(["ALLOTTED", "NOT_ALLOTTED", "LISTED", "HOLDING", "SOLD", "CLOSED"])
        ? "done" : active("APPLIED") || active("ALLOTMENT_PENDING") ? "active" : "upcoming") as StepStatus,
    },
    {
      label: "Funds unblock or debit",
      date: ipo.metrics.allotmentDate,
      info: "Refund or debit based on allotment result",
      status: (done(["ALLOTTED", "NOT_ALLOTTED", "LISTED", "HOLDING", "SOLD", "CLOSED"]) ? "done" : "upcoming") as StepStatus,
    },
    {
      label: "Tentative listing date",
      date: ipo.metrics.listingDate,
      status: (done(["LISTED", "HOLDING", "SOLD", "CLOSED"]) ? "done" : "upcoming") as StepStatus,
    },
  ];
}

export function IPODetailModal({ ipo, isOpen, onClose, onApply }: IPODetailModalProps) {
  if (!isOpen) return null;

  const steps = getSteps(ipo);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col font-sans">

      {/* ── Top Nav Bar ── */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-[#E2E8F0] bg-white">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-medium text-[#5F6673] hover:text-[#111318] transition-colors"
        >
          <ArrowLeft size={16} weight="bold" /> Back
        </button>
        <span className="text-sm font-semibold text-[#111318] truncate mx-4">{ipo.name}</span>
        <Button size="sm" variant="success" onClick={() => { onClose(); onApply(ipo); }}>
          Apply Now <ArrowRight size={13} />
        </Button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 space-y-0">

          {/* SECTION 1: Company Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-7 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-bold text-xl shadow-sm shrink-0">
                {ipo.logo}
              </div>
              <div>
                <h1 className="text-[20px] font-bold text-[#111318] leading-tight tracking-tight">
                  {ipo.name}
                </h1>
                <p className="text-sm text-[#5F6673] font-normal mt-0.5">{ipo.company}</p>
              </div>
            </div>
            <div className="sm:text-right shrink-0">
              <p className="text-[24px] font-bold text-[#111318] num-tabular leading-tight">
                {formatINR(ipo.metrics.minInvestment)}
                <span className="text-sm font-normal text-[#5F6673] ml-1.5">
                  /{ipo.metrics.lotSize} shares
                </span>
              </p>
              <p className="text-xs text-[#5F6673] font-medium mt-0.5">Minimum investment</p>
            </div>
          </div>

          {/* SECTION 2: IPO Details */}
          <div className="py-7 border-b border-[#E2E8F0] space-y-5">
            <h2 className="text-[16px] font-semibold text-[#111318]">IPO details</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6">
              <div>
                <p className="text-xs text-[#5F6673] font-normal mb-1.5">Minimum investment</p>
                <p className="text-[15px] font-semibold text-[#111318] num-tabular">
                  {formatINR(ipo.metrics.minInvestment)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#5F6673] font-normal mb-1.5">Price range</p>
                <p className="text-[15px] font-semibold text-[#111318] num-tabular">
                  ₹{ipo.metrics.priceBand.min} – ₹{ipo.metrics.priceBand.max}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#5F6673] font-normal mb-1.5">Lot size</p>
                <p className="text-[15px] font-semibold text-[#111318] num-tabular">
                  {ipo.metrics.lotSize}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#5F6673] font-normal mb-1.5">Issue size</p>
                <p className="text-[15px] font-semibold text-[#111318] num-tabular">
                  {ipo.metrics.issueSize || "—"}
                </p>
              </div>
              {ipo.metrics.faceValue !== undefined && (
                <div>
                  <p className="text-xs text-[#5F6673] font-normal mb-1.5">Face value</p>
                  <p className="text-[15px] font-semibold text-[#111318] num-tabular">₹{ipo.metrics.faceValue}</p>
                </div>
              )}
              {ipo.metrics.rhpUrl && (
                <div>
                  <p className="text-xs text-[#5F6673] font-normal mb-1.5">IPO document</p>
                  <a
                    href={ipo.metrics.rhpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#12B76A] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    RHP PDF <ArrowSquareOut size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Schedule Timeline */}
          <div className="py-7 space-y-7">
            <h2 className="text-[16px] font-semibold text-[#111318]">Schedule</h2>

            <div className="relative">
              {/* Connector line (desktop) */}
              <div className="hidden sm:block absolute top-[18px] left-[18px] right-[18px] h-[1.5px] bg-[#E2E8F0] z-0" />

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-3 relative z-10">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 sm:text-center"
                  >
                    <div className="shrink-0">
                      {step.status === "done" ? (
                        <div className="w-9 h-9 rounded-full bg-[#ECFDF3] border-2 border-[#12B76A] flex items-center justify-center">
                          <CheckCircle size={18} weight="fill" className="text-[#12B76A]" />
                        </div>
                      ) : step.status === "active" ? (
                        <div className="w-9 h-9 rounded-full bg-white border-2 border-[#D97706] flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-[#D97706]" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white border-2 border-[#CBD5E1] flex items-center justify-center">
                          <Circle size={18} className="text-[#CBD5E1]" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 text-left sm:text-center">
                      <p className="text-xs text-[#5F6673] font-medium">{step.date}</p>
                      <p className={`text-[13px] font-semibold leading-snug flex items-center sm:justify-center gap-1 flex-wrap ${
                        step.status === "active" ? "text-[#D97706]" : "text-[#111318]"
                      }`}>
                        {step.label}
                        {step.info && (
                          <span title={step.info}>
                            <Info size={13} className="text-[#9CA3AF] cursor-help shrink-0" />
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
