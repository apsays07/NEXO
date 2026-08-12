"use client";

import React from "react";
import { Card } from "../ui/Card";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";

interface IPOSnapshotProps {
  ipo: IPOOpportunity;
}

export function IPOSnapshot({ ipo }: IPOSnapshotProps) {
  const metrics = [
    { label: "Issue Size", value: ipo.metrics.issueSize || "₹1,400 Cr" },
    { label: "Price Band", value: `₹${ipo.metrics.priceBand.min} – ₹${ipo.metrics.priceBand.max}` },
    { label: "Lot Size", value: `${ipo.metrics.lotSize} shares` },
    { label: "Minimum Investment", value: formatINR(ipo.metrics.minInvestment) },
    { label: "Open Date", value: ipo.metrics.openDate },
    { label: "Close Date", value: ipo.metrics.closeDate },
    { label: "Allotment Date", value: ipo.metrics.allotmentDate },
    { label: "Listing Date", value: ipo.metrics.listingDate },
  ];

  return (
    <Card id="snapshot" className="p-6 bg-white border-[#E2E8F0] shadow-2xs space-y-4 font-sans">
      <h3 className="nexo-h4 text-[#111318] uppercase">
        IPO SNAPSHOT
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
        {metrics.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-xs text-[#5F6673] font-medium block">
              {item.label}
            </span>
            <span className="text-sm font-semibold text-[#111318] num-tabular block">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
