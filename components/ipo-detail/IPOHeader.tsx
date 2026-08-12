"use client";

import React from "react";
import Link from "next/link";
import { StatusBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { IPOOpportunity } from "@/types/nexo";
import { ArrowLeft, UserPlus, CheckCircle } from "@phosphor-icons/react";

interface IPOHeaderProps {
  ipo: IPOOpportunity;
  onJoinClick: () => void;
  onViewApplicationClick: () => void;
}

export function IPOHeader({
  ipo,
  onJoinClick,
  onViewApplicationClick,
}: IPOHeaderProps) {
  const hasApplied = ipo.applications.some((a) =>
    a.participants.some((p) => p.memberName === "Ashay" || p.memberName === "Niranjan")
  );

  return (
    <div className="space-y-3 pb-4 border-b border-[#E2E8F0]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#64748B] font-medium">
        <Link
          href="/"
          className="hover:text-[#0F172A] flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} /> Back to IPOs
        </Link>
        <span>/</span>
        <span className="text-[#0F172A] font-bold">{ipo.name}</span>
      </div>

      {/* Main Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-extrabold text-base shadow-2xs">
            {ipo.logo}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-[#64748B] font-bold">
                {ipo.category || "Mainboard IPO"}
              </span>
              <span className="text-[#94A3B8]">•</span>
              <StatusBadge status={ipo.status} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              {ipo.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasApplied ? (
            <Button size="sm" variant="secondary" onClick={onViewApplicationClick}>
              <CheckCircle size={16} /> View Application
            </Button>
          ) : (
            <Button size="sm" variant="primary" onClick={onJoinClick}>
              <UserPlus size={16} /> Join Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
