"use client";

import React from "react";
import { Card } from "../ui/Card";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { Clock, CheckCircle, XCircle } from "@phosphor-icons/react";

interface AllotmentPanelProps {
  ipo: IPOOpportunity;
}

export function AllotmentPanel({ ipo }: AllotmentPanelProps) {
  const isAllotmentPending = ipo.status === "ALLOTMENT_PENDING" || ipo.status === "APPLYING" || ipo.status === "APPLIED";
  const isAllotted = ipo.status === "ALLOTTED" || ipo.status === "HOLDING" || ipo.status === "SOLD";

  const timelineSteps = [
    { title: "Application Submitted", date: "12 Aug 2026", status: "completed" },
    { title: "Bidding Closed", date: ipo.metrics.closeDate, status: "completed" },
    { title: "Allotment Result", date: ipo.metrics.allotmentDate, status: isAllotted ? "completed" : "current" },
    { title: "Listing Date", date: ipo.metrics.listingDate, status: "upcoming" },
  ];

  return (
    <Card id="allotment" className="p-6 bg-surface border-line shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight uppercase">
          ALLOTMENT STATUS
        </h3>
        <span className="text-xs text-[#64748B] font-mono">Registral Audit</span>
      </div>

      {isAllotmentPending ? (
        <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-caution text-white">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#92400E]">
                ALLOTMENT PENDING
              </div>
              <div className="text-xs text-[#78350F] font-medium">
                Registrar allotment results expected on {ipo.metrics.allotmentDate}.
              </div>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-surface text-caution border border-[#FDE68A]">
            Pending Audit
          </span>
        </div>
      ) : isAllotted ? (
        <div className="p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-positive text-white">
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#047857]">
                ALLOTTED SUCCESSFULLY
              </div>
              <div className="text-xs text-[#065F46] font-medium">
                116 Shares Allotted • Amount Deployed {formatINR(29928)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#DC2626] text-white">
              <XCircle size={20} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#991B1B]">
                NOT ALLOTTED
              </div>
              <div className="text-xs text-[#7F1D1D] font-medium">
                Full ASBA amount refund initiated ({formatINR(40000)}).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Allotment Timeline */}
      <div className="pt-2">
        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider block mb-3">
          Timeline & Important Dates
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {timelineSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs ${
                step.status === "completed"
                  ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]"
                  : step.status === "current"
                  ? "bg-accent-soft border-[#BFDBFE] text-accent"
                  : "bg-page border-line text-[#64748B]"
              }`}
            >
              <span className="font-extrabold block">{step.title}</span>
              <span className="text-[11px] font-mono block mt-0.5">{step.date}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
