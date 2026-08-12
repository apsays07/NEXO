"use client";

import React from "react";
import { Card } from "../ui/Card";
import { CheckCircle, Warning } from "@phosphor-icons/react";

export function InvestmentThesis() {
  return (
    <Card className="p-6 bg-white border-[#E2E8F0] shadow-sm space-y-5">
      <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight uppercase">
        INVESTMENT THESIS & ANALYSIS
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why applying */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0]">
          <h4 className="text-xs font-extrabold text-[#047857] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle size={16} /> Why We Are Applying
          </h4>
          <ul className="space-y-2 text-xs text-[#065F46] font-medium">
            <li className="flex items-start gap-2">
              <span className="text-[#059669] font-bold">•</span>
              <span><strong>Attractive Valuation:</strong> Priced at 24.5x FY26E P/E, presenting discount versus listed peer average of 32x.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#059669] font-bold">•</span>
              <span><strong>Strong Industry Demand:</strong> Key supplier for EV drivetrain harnesses with multi-year OEM contracts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#059669] font-bold">•</span>
              <span><strong>Healthy Operating Profile:</strong> 18.2% EBITDA margin with expanding return on capital employed (ROCE &gt; 22%).</span>
            </li>
          </ul>
        </div>

        {/* Key risks */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]">
          <h4 className="text-xs font-extrabold text-[#B45309] uppercase tracking-wider flex items-center gap-1.5">
            <Warning size={16} /> Key Risks
          </h4>
          <ul className="space-y-2 text-xs text-[#78350F] font-medium">
            <li className="flex items-start gap-2">
              <span className="text-[#D97706] font-bold">•</span>
              <span><strong>Automotive Cyclicality:</strong> Revenue growth closely tied to domestic commercial vehicle build cycles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D97706] font-bold">•</span>
              <span><strong>Raw Material Sensitivity:</strong> Copper price volatility can temporarily pressure gross margins if pass-through lags.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D97706] font-bold">•</span>
              <span><strong>Market Volatility:</strong> Overall broader equity market sentiment on listing date.</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
