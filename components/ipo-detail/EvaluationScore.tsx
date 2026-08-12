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
    <Card id="evaluation" className="p-6 bg-surface border-line shadow-2xs space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge size={20} className="text-accent" />
          <h3 className="nexo-h4 text-ink uppercase">
            NEXO INTERNAL EVALUATION
          </h3>
        </div>
        <div className="flex items-baseline gap-1 bg-accent-soft px-3 py-1 rounded-xl border border-[#BFDBFE]">
          <span className="text-lg font-bold text-accent num-tabular">8.4</span>
          <span className="text-xs text-ink-secondary font-semibold">/ 10</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {scores.map((item, idx) => (
          <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-page border border-line">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-secondary font-medium">{item.label}</span>
              <span className="font-semibold text-ink num-tabular">{item.score} / 10</span>
            </div>
            <div className="h-1.5 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="bg-accent h-full rounded-full"
                style={{ width: `${item.score * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[12px] text-ink-secondary font-normal italic">
        Internal scoring algorithm based on fundamental balance sheet health, operating margins, and relative peer multiples.
      </p>
    </Card>
  );
}
