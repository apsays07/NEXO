"use client";

import React from "react";
import { Card } from "../ui/Card";
import { Gauge } from "@phosphor-icons/react";

export function EvaluationScore() {
  const scores = [
    { label: "Business Quality", score: 8.7 },
    { label: "Valuation Attractiveness", score: 8.1 },
    { label: "Revenue & Margin Growth", score: 8.6 },
    { label: "Risk Mitigation", score: 7.8 },
  ];

  return (
    <Card id="evaluation" className="p-6 bg-white border-[#E2E8F0] shadow-2xs space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge size={20} className="text-[#2563EB]" />
          <h3 className="nexo-h4 text-[#111318] uppercase">
            NEXO INTERNAL EVALUATION
          </h3>
        </div>
        <div className="flex items-baseline gap-1 bg-[#EFF6FF] px-3 py-1 rounded-xl border border-[#BFDBFE]">
          <span className="text-lg font-bold text-[#2563EB] num-tabular">8.4</span>
          <span className="text-xs text-[#5F6673] font-semibold">/ 10</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {scores.map((item, idx) => (
          <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5F6673] font-medium">{item.label}</span>
              <span className="font-semibold text-[#111318] num-tabular">{item.score} / 10</span>
            </div>
            <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="bg-[#2563EB] h-full rounded-full"
                style={{ width: `${item.score * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[12px] text-[#5F6673] font-normal italic">
        Internal syndicate scoring algorithm based on fundamental balance sheet health, operating margins, and relative peer multiples.
      </p>
    </Card>
  );
}
