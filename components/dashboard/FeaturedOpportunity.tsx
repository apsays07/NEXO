"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import { StatusBadge, RecommendationBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatINR } from "@/lib/mockData";
import { IPOOpportunity } from "@/types/nexo";
import { ArrowRight, Clock, ShieldCheck } from "@phosphor-icons/react";
import { IPODetailModal } from "../ipo/IPODetailModal";

interface FeaturedOpportunityProps {
  ipo: IPOOpportunity;
  onInspect: (ipo: IPOOpportunity) => void;
  onApply: (ipo: IPOOpportunity) => void;
}

export function FeaturedOpportunity({ ipo, onInspect, onApply }: FeaturedOpportunityProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <Card className="p-4 sm:p-5 bg-surface border border-line hover:border-line-strong shadow-xs hover:shadow-md transition-all rounded-2xl flex flex-col justify-between h-full space-y-4 font-sans">
        <div>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center font-bold text-small border border-accent/20 shadow-2xs shrink-0">
                {ipo.logo}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-caption font-medium text-ink-secondary uppercase tracking-wider bg-surface-alt px-2 py-0.5 rounded border border-line-subtle">
                    {ipo.category || "Mainboard IPO"}
                  </span>
                  <span className="text-ink-tertiary">•</span>
                  <span className="text-caption font-medium text-ink-secondary">{ipo.company}</span>
                </div>
                {/* Clickable IPO name → opens detail modal */}
                <button
                  onClick={() => setShowDetail(true)}
                  className="text-left text-h4 font-semibold text-ink hover:text-accent hover:underline underline-offset-2 transition-colors tracking-tight cursor-pointer"
                >
                  {ipo.name}
                </button>
              </div>
            </div>

            <StatusBadge status={ipo.status} size="sm" />
          </div>

          {/* Financial Metrics Cluster */}
          <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-surface-alt/70 border border-line-subtle space-y-0.5">
              <span className="text-caption font-medium text-ink-tertiary uppercase tracking-wider block">
                Min Investment
              </span>
              <div className="text-h4 font-semibold text-ink num-tabular">
                {formatINR(ipo.metrics.minInvestment)}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt/70 border border-line-subtle space-y-0.5">
              <span className="text-caption font-medium text-ink-tertiary uppercase tracking-wider block">
                Issue Size
              </span>
              <div className="text-h4 font-semibold text-ink num-tabular">
                {ipo.metrics.issueSize || "—"}
              </div>
            </div>
          </div>

          {/* Group Decision Box */}
          <div className="p-3 rounded-xl bg-positive-soft/70 border border-positive/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-caption font-semibold text-positive">
                <ShieldCheck size={16} />
                <span>Group Decision</span>
              </div>
              <RecommendationBadge type={ipo.recommendation} size="sm" />
            </div>

            <p className="text-small text-ink font-normal leading-relaxed">
              {ipo.thesis}
            </p>

            <div className="flex items-center gap-3 pt-1.5 text-caption text-ink-tertiary border-t border-positive/20 font-medium">
              {ipo.decisionBy && (
                <span>Authored by: <strong className="font-semibold text-ink">{ipo.decisionBy}</strong></span>
              )}
              {ipo.decisionBy && ipo.decisionDate && <span>•</span>}
              {ipo.decisionDate && (
                <span>Decision date: <strong className="font-semibold text-ink">{ipo.decisionDate}</strong></span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
          <span className="text-caption text-caution font-semibold flex items-center gap-1.5 bg-caution-soft px-3 py-1.5 rounded-xl border border-caution/30 shadow-2xs">
            <Clock size={14} /> Closes {ipo.metrics.closeDate}
          </span>
          <Button
            size="md"
            variant="success"
            onClick={() => onApply(ipo)}
          >
            Apply Now <ArrowRight size={14} />
          </Button>
        </div>
      </Card>

      {/* IPO Detail Modal */}
      <IPODetailModal
        ipo={ipo}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onApply={onApply}
      />
    </>
  );
}
