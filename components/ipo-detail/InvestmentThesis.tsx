"use client";

import React from "react";
import { Card } from "../ui/Card";
import { CheckCircle, Warning } from "@phosphor-icons/react";

export function InvestmentThesis() {
  return (
    <Card className="p-6 bg-surface border-line shadow-2xs space-y-5 font-sans">
      <h3 className="nexo-h4 text-ink uppercase">
        INVESTMENT THESIS & ANALYSIS
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why applying */}
        <div className="space-y-3 p-4 rounded-2xl bg-positive-soft border border-positive/30">
          <h4 className="text-xs font-semibold text-[#047857] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle size={16} /> Why We Are Applying
          </h4>
          <ul className="space-y-2 text-xs text-[#065F46] font-normal">
            <li className="flex items-start gap-2">
              <span className="text-positive font-semibold">•</span>
              <span><strong className="font-semibold">Attractive Valuation:</strong> Priced at 24.5x FY26E P/E, presenting discount versus listed peer average of 32x.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-positive font-semibold">•</span>
              <span><strong className="font-semibold">Strong Industry Demand:</strong> Key supplier for EV drivetrain harnesses with multi-year OEM contracts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-positive font-semibold">•</span>
              <span><strong className="font-semibold">Healthy Operating Profile:</strong> 18.2% EBITDA margin with expanding return on capital employed (ROCE &gt; 22%).</span>
            </li>
          </ul>
        </div>

        {/* Key risks */}
        <div className="space-y-3 p-4 rounded-2xl bg-caution-soft border border-caution/30">
          <h4 className="text-xs font-semibold text-[#B45309] uppercase tracking-wider flex items-center gap-1.5">
            <Warning size={16} /> Key Risks
          </h4>
          <ul className="space-y-2 text-xs text-[#78350F] font-normal">
            <li className="flex items-start gap-2">
              <span className="text-caution font-semibold">•</span>
              <span><strong className="font-semibold">Automotive Cyclicality:</strong> Revenue growth closely tied to domestic commercial vehicle build cycles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-caution font-semibold">•</span>
              <span><strong className="font-semibold">Raw Material Sensitivity:</strong> Copper price volatility can temporarily pressure gross margins if pass-through lags.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-caution font-semibold">•</span>
              <span><strong className="font-semibold">Market Volatility:</strong> Overall broader equity market sentiment on listing date.</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
