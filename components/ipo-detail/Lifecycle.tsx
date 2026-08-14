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

function formatDate(d?: string): string {
  if (!d) return "—";
  return d.trim().replace(/^(\d+)([a-zA-Z]+)/, "$1 $2").replace(/\s+/g, " ");
}

function parseStepDate(d?: string): Date | null {
  if (!d) return null;
  const cleaned = d.trim().replace(/^(\d+)([a-zA-Z]+)/, "$1 $2").replace(/\s+/g, " ");
  const parsed = new Date(cleaned);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  return null;
}

function getSteps(ipo: IPOOpportunity): ScheduleStep[] {
  const openD = parseStepDate(ipo.metrics?.openDate);
  const closeD = parseStepDate(ipo.metrics?.closeDate);
  const allotD = parseStepDate(ipo.metrics?.allotmentDate);
  const unblockD = parseStepDate(ipo.metrics?.fundUnblockDate || ipo.metrics?.allotmentDate);
  const listD = parseStepDate(ipo.metrics?.listingDate);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let openStatus: ScheduleStep["status"] = "upcoming";
  let closeStatus: ScheduleStep["status"] = "upcoming";
  let allotStatus: ScheduleStep["status"] = "upcoming";
  let unblockStatus: ScheduleStep["status"] = "upcoming";
  let listStatus: ScheduleStep["status"] = "upcoming";

  if (openD && closeD) {
    const openTime = new Date(openD.getFullYear(), openD.getMonth(), openD.getDate()).getTime();
    const closeTime = new Date(closeD.getFullYear(), closeD.getMonth(), closeD.getDate()).getTime();
    const allotTime = allotD ? new Date(allotD.getFullYear(), allotD.getMonth(), allotD.getDate()).getTime() : closeTime + 4 * 86400000;
    const unblockTime = unblockD ? new Date(unblockD.getFullYear(), unblockD.getMonth(), unblockD.getDate()).getTime() : allotTime + 86400000;
    const listTime = listD ? new Date(listD.getFullYear(), listD.getMonth(), listD.getDate()).getTime() : unblockTime + 2 * 86400000;

    const t = today.getTime();

    if (t < openTime) {
      openStatus = "active";
    } else if (t >= openTime && t <= closeTime) {
      openStatus = "done";
      closeStatus = "active";
    } else if (t > closeTime && t <= allotTime) {
      openStatus = "done";
      closeStatus = "done";
      allotStatus = "active";
    } else if (t > allotTime && t <= unblockTime) {
      openStatus = "done";
      closeStatus = "done";
      allotStatus = "done";
      unblockStatus = "active";
    } else if (t > unblockTime && t <= listTime) {
      openStatus = "done";
      closeStatus = "done";
      allotStatus = "done";
      unblockStatus = "done";
      listStatus = "active";
    } else if (t > listTime) {
      openStatus = "done";
      closeStatus = "done";
      allotStatus = "done";
      unblockStatus = "done";
      listStatus = "done";
    }
  } else {
    const stage = ipo.status;
    const isDone = (stages: string[]) => stages.includes(stage);
    const isActive = (s: string) => stage === s;

    const openDone = isDone(["APPLICATION_OPEN", "APPLYING", "APPLIED", "ALLOTMENT_PENDING", "ALLOTTED", "NOT_ALLOTTED", "LISTED", "HOLDING", "SOLD", "CLOSED"]);
    const closeDone = isDone(["APPLIED", "ALLOTMENT_PENDING", "ALLOTTED", "NOT_ALLOTTED", "LISTED", "HOLDING", "SOLD", "CLOSED"]);
    const allotDone = isDone(["ALLOTTED", "NOT_ALLOTTED", "LISTED", "HOLDING", "SOLD", "CLOSED"]);
    const listDone = isDone(["LISTED", "HOLDING", "SOLD", "CLOSED"]);

    openStatus = openDone ? "done" : isActive("RESEARCHING") || isActive("WATCHLIST") ? "active" : "upcoming";
    closeStatus = closeDone ? "done" : isActive("APPLICATION_OPEN") || isActive("APPLYING") ? "active" : "upcoming";
    allotStatus = allotDone ? "done" : isActive("APPLIED") || isActive("ALLOTMENT_PENDING") ? "active" : "upcoming";
    unblockStatus = allotDone ? "done" : "upcoming";
    listStatus = listDone ? "done" : "upcoming";
  }

  return [
    {
      label: "IPO open date",
      date: formatDate(ipo.metrics?.openDate),
      status: openStatus,
    },
    {
      label: "IPO close date",
      date: formatDate(ipo.metrics?.closeDate),
      status: closeStatus,
    },
    {
      label: "Allotment date",
      date: formatDate(ipo.metrics?.allotmentDate),
      status: allotStatus,
    },
    {
      label: "Funds unblock or debit",
      date: formatDate(ipo.metrics?.fundUnblockDate || ipo.metrics?.allotmentDate),
      info: "Refund or debit based on allotment result",
      status: unblockStatus,
    },
    {
      label: "Tentative listing date",
      date: formatDate(ipo.metrics?.listingDate),
      status: listStatus,
    },
  ];
}

export function Lifecycle({ ipo }: LifecycleProps) {
  const steps = getSteps(ipo);

  return (
    <Card id="schedule" className="p-6 md:p-8 bg-surface border-line shadow-2xs space-y-6 font-sans">
      <h3 className="text-base font-semibold text-ink tracking-tight">Schedule</h3>

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
                  <div className="w-9 h-9 rounded-full bg-positive-soft border-2 border-[#12B76A] flex items-center justify-center shadow-sm">
                    <CheckCircle size={18} weight="fill" className="text-positive" />
                  </div>
                ) : step.status === "active" ? (
                  <div className="w-9 h-9 rounded-full bg-surface border-2 border-[#D97706] flex items-center justify-center shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-caution" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-surface border-2 border-[#CBD5E1] flex items-center justify-center">
                    <Circle size={18} className="text-[#CBD5E1]" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="md:text-center text-left space-y-0.5 min-w-0">
                <p className={`text-xs font-medium leading-tight ${
                  step.status === "done" ? "text-ink-secondary" :
                  step.status === "active" ? "text-caution" :
                  "text-ink-secondary"
                }`}>
                  {step.date}
                </p>
                <p className={`text-[13px] leading-snug font-semibold ${
                  step.status === "active" ? "text-caution" : "text-ink"
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
