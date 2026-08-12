"use client";

import React from "react";
import { Card } from "../ui/Card";
import { IPOOpportunity } from "@/types/nexo";
import { CheckCircle, Circle, Info } from "@phosphor-icons/react";

interface LifecycleProps {
  ipo: IPOOpportunity;
}

type ScheduleStep = {
  label: string;
  date: string;
  info?: string;
  status: "done" | "active" | "upcoming";
};

function getSteps(ipo: IPOOpportunity): ScheduleStep[] {
  const stage = ipo.status;

  const isDone = (stages: string[]) => stages.includes(stage);
  const isActive = (s: string) => stage === s;

  const openDone =
    isDone(["APPLICATION_OPEN", "APPLYING", "APPLIED", "ALLOTMENT_PENDING", "ALLOTTED", "NOT_ALLOTTED", "LISTED", "HOLDING", "SOLD", "CLOSED"]);
  const closeDone =
    isDone(["APPLIED", "ALLOTMENT_PENDING", "ALLOTTED", "NOT_ALLOTTED", "LISTED", "HOLDING", "SOLD", "CLOSED"]);
  const allotDone =
    isDone(["ALLOTTED", "NOT_ALLOTTED", "LISTED", "HOLDING", "SOLD", "CLOSED"]);
  const listDone =
    isDone(["LISTED", "HOLDING", "SOLD", "CLOSED"]);

  return [
    {
      label: "IPO open date",
      date: ipo.metrics.openDate,
      status: openDone ? "done" : isActive("RESEARCHING") || isActive("WATCHLIST") ? "active" : "upcoming",
    },
    {
      label: "IPO close date",
      date: ipo.metrics.closeDate,
      status: closeDone ? "done" : isActive("APPLICATION_OPEN") || isActive("APPLYING") ? "active" : "upcoming",
    },
    {
      label: "Allotment date",
      date: ipo.metrics.allotmentDate,
      status: allotDone ? "done" : isActive("APPLIED") || isActive("ALLOTMENT_PENDING") ? "active" : "upcoming",
    },
    {
      label: "Funds unblock or debit",
      date: ipo.metrics.allotmentDate,
      info: "Refund or debit based on allotment result",
      status: allotDone ? "done" : "upcoming",
    },
    {
      label: "Tentative listing date",
      date: ipo.metrics.listingDate,
      status: listDone ? "done" : "upcoming",
    },
  ];
}

export function Lifecycle({ ipo }: LifecycleProps) {
  const steps = getSteps(ipo);

  return (
    <Card id="schedule" className="p-6 md:p-8 bg-white border-[#E2E8F0] shadow-2xs space-y-6 font-sans">
      <h3 className="text-base font-semibold text-[#111318] tracking-tight">Schedule</h3>

      {/* Timeline — horizontal on md+, vertical on mobile */}
      <div className="relative">
        {/* Horizontal connector line (desktop) */}
        <div className="hidden md:block absolute top-[18px] left-[18px] right-[18px] h-[1.5px] bg-[#E2E8F0] z-0" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-2 relative z-10">
          {steps.map((step, idx) => (
            <div key={idx} className="flex md:flex-col items-start md:items-center gap-3 md:gap-2 text-center">
              {/* Icon */}
              <div className="shrink-0">
                {step.status === "done" ? (
                  <div className="w-9 h-9 rounded-full bg-[#ECFDF3] border-2 border-[#12B76A] flex items-center justify-center shadow-sm">
                    <CheckCircle size={18} weight="fill" className="text-[#12B76A]" />
                  </div>
                ) : step.status === "active" ? (
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-[#D97706] flex items-center justify-center shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-[#D97706]" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white border-2 border-[#CBD5E1] flex items-center justify-center">
                    <Circle size={18} className="text-[#CBD5E1]" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="md:text-center text-left space-y-0.5 min-w-0">
                <p className={`text-xs font-medium leading-tight ${
                  step.status === "done" ? "text-[#5F6673]" :
                  step.status === "active" ? "text-[#D97706]" :
                  "text-[#5F6673]"
                }`}>
                  {step.date}
                </p>
                <p className={`text-[13px] leading-snug font-semibold ${
                  step.status === "active" ? "text-[#D97706]" : "text-[#111318]"
                } flex items-center md:justify-center gap-1 flex-wrap`}>
                  {step.label}
                  {step.info && (
                    <span title={step.info}>
                      <Info size={13} className="text-[#9CA3AF] cursor-help" />
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
