"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { Card } from "../ui/Card";
import { StatusBadge, RecommendationBadge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { FilterPopover } from "../ui/FilterPopover";
import { formatINR } from "@/lib/mockData";
import {
  UserPlus,
  SquaresFour,
  List,
} from "@phosphor-icons/react";

type FilterTab = "ALL" | "WATCHLIST" | "APPLYING" | "APPLIED" | "ALLOTMENT" | "PORTFOLIO" | "CLOSED";

export function IPOWorkspaceView() {
  const {
    ipos,
    searchQuery,
    openIpoDetail,
    openApplicationModal,
  } = useNexo();

  const [activeFilter, setActiveFilter] = useState<FilterTab>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [popoverFilters, setPopoverFilters] = useState({ status: "ALL", decision: "ALL" });

  const filterCounts = {
    ALL: ipos.length,
    WATCHLIST: ipos.filter((i) => i.status === "WATCHLIST").length,
    APPLYING: ipos.filter((i) => i.status === "APPLYING" || i.status === "APPLICATION_OPEN").length,
    APPLIED: ipos.filter((i) => i.status === "APPLIED").length,
    ALLOTMENT: ipos.filter((i) => i.status === "ALLOTMENT_PENDING").length,
    PORTFOLIO: ipos.filter((i) => i.status === "HOLDING" || i.status === "SOLD").length,
    CLOSED: ipos.filter((i) => i.status === "CLOSED").length,
  };

  const filteredIpos = ipos.filter((ipo) => {
    const matchesSearch =
      ipo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.company.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Popover filters
    if (popoverFilters.decision !== "ALL" && ipo.recommendation !== popoverFilters.decision) {
      return false;
    }
    if (popoverFilters.status !== "ALL" && ipo.status !== popoverFilters.status) {
      return false;
    }

    // Tab filter
    switch (activeFilter) {
      case "WATCHLIST":
        return ipo.status === "WATCHLIST";
      case "APPLYING":
        return ipo.status === "APPLYING" || ipo.status === "APPLICATION_OPEN";
      case "APPLIED":
        return ipo.status === "APPLIED";
      case "ALLOTMENT":
        return ipo.status === "ALLOTMENT_PENDING";
      case "PORTFOLIO":
        return ipo.status === "HOLDING" || ipo.status === "SOLD";
      case "CLOSED":
        return ipo.status === "CLOSED";
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="nexo-h2 text-[#111318]">
            IPO Workspace
          </h1>
          <p className="text-xs font-normal text-[#5F6673] mt-0.5">
            Your private IPO pipeline and syndicate vault tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / List view toggle */}
          <div className="flex items-center p-1 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-[#5F6673] hover:text-[#111318]"
              }`}
              title="Grid View"
            >
              <SquaresFour size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#EFF6FF] text-[#2563EB]"
                  : "text-[#5F6673] hover:text-[#111318]"
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>

          <FilterPopover onFilterChange={(f) => setPopoverFilters(f)} />
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {(["ALL", "WATCHLIST", "APPLYING", "APPLIED", "ALLOTMENT", "PORTFOLIO", "CLOSED"] as FilterTab[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === tab
                  ? "bg-[#2563EB] text-white shadow-2xs shadow-[#2563EB]/20"
                  : "bg-white text-[#5F6673] hover:bg-[#F8FAFC] hover:text-[#111318] border border-[#E2E8F0]"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[11px] font-mono ${
                  activeFilter === tab
                    ? "bg-white/20 text-white"
                    : "bg-[#F1F5F9] text-[#5F6673]"
                }`}
              >
                {filterCounts[tab]}
              </span>
            </button>
          )
        )}
      </div>

      {/* EMPTY STATE */}
      {filteredIpos.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-[#CBD5E1] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F1F5F9] text-[#5F6673] flex items-center justify-center mx-auto text-sm font-semibold">
            0
          </div>
          <div>
            <h3 className="nexo-h4 text-[#111318]">
              No IPOs match your current filters.
            </h3>
            <p className="text-xs text-[#5F6673] mt-1 font-normal">
              Try adjusting your search query or lifecycle stage filters.
            </p>
          </div>
          <div className="pt-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setActiveFilter("ALL");
                setPopoverFilters({ status: "ALL", decision: "ALL" });
              }}
            >
              Clear filters
            </Button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredIpos.map((ipo) => (
            <Card
              key={ipo.id}
              hoverable
              onClick={() => openIpoDetail(ipo)}
              className="flex flex-col justify-between group p-6 border-[#E2E8F0]"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-bold text-sm text-[#2563EB]">
                      {ipo.logo}
                    </div>
                    <div>
                      <h3 className="text-[18px] leading-[26px] font-semibold text-[#111318] group-hover:text-[#2563EB] transition-colors">
                        {ipo.name}
                      </h3>
                      <div className="text-xs text-[#5F6673] truncate max-w-[150px] font-normal">
                        {ipo.company}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={ipo.status} size="sm" />
                </div>

                <div className="mb-3">
                  <RecommendationBadge type={ipo.recommendation} size="sm" />
                </div>

                <p className="text-xs text-[#5F6673] line-clamp-2 mb-4 leading-relaxed font-normal">
                  {ipo.thesis}
                </p>

                {/* Financial Attributes */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs mb-4">
                  <div>
                    <span className="text-[#5F6673] block text-[12px] font-medium">Price Band</span>
                    <span className="font-semibold text-[#111318] num-tabular text-[14px]">
                      ₹{ipo.metrics.priceBand.min}—₹{ipo.metrics.priceBand.max}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5F6673] block text-[12px] font-medium">Minimum Lot</span>
                    <span className="font-semibold text-[#111318] num-tabular text-[14px]">
                      {formatINR(ipo.metrics.minInvestment)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5F6673] block text-[12px] font-medium">Closes</span>
                    <span className="font-semibold text-[#D97706] text-[14px]">
                      {ipo.metrics.closeDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5F6673] block text-[12px] font-medium">Combined Capital</span>
                    <span className="font-semibold text-[#059669] num-tabular text-[14px]">
                      {formatINR(ipo.combinedCapital)}
                    </span>
                  </div>
                </div>

                {/* Participant Avatars */}
                <div className="flex items-center justify-between text-xs py-2 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#5F6673] font-normal">
                      {ipo.participantsCount} members
                    </span>
                    <div className="flex -space-x-2">
                      {ipo.applications
                        .flatMap((a) => a.participants)
                        .slice(0, 4)
                        .map((p, idx) => (
                          <img
                            key={idx}
                            src={p.avatar}
                            alt={p.memberName}
                            title={`${p.memberName} (${formatINR(p.contribution)})`}
                            className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-2xs"
                          />
                        ))}
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-[#2563EB] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View →
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div
                className="pt-4 flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {ipo.status === "APPLYING" || ipo.status === "APPLICATION_OPEN" ? (
                  <Button
                    size="sm"
                    variant="primary"
                    className="flex-1"
                    onClick={() => openApplicationModal(ipo)}
                  >
                    <UserPlus size={14} /> Participate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => openIpoDetail(ipo)}
                  >
                    Inspect Opportunity
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* LIST VIEW TABLE */
        <Card className="border-[#E2E8F0]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] nexo-table-header">
                  <th className="py-3 px-4">IPO Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Group Decision</th>
                  <th className="py-3 px-4">Price Band</th>
                  <th className="py-3 px-4">Closes</th>
                  <th className="py-3 px-4">Participants</th>
                  <th className="py-3 px-4">Combined Capital</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] nexo-table-body">
                {filteredIpos.map((ipo) => (
                  <tr
                    key={ipo.id}
                    onClick={() => openIpoDetail(ipo)}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#111318] text-sm">{ipo.name}</div>
                      <div className="text-[12px] text-[#5F6673] font-normal">{ipo.company}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ipo.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <RecommendationBadge type={ipo.recommendation} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 nexo-table-num text-[#111318]">
                      ₹{ipo.metrics.priceBand.min}–₹{ipo.metrics.priceBand.max}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#D97706]">
                      {ipo.metrics.closeDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[#111318]">{ipo.participantsCount}</span>
                        <div className="flex -space-x-1.5">
                          {ipo.applications
                            .flatMap((a) => a.participants)
                            .slice(0, 3)
                            .map((p, idx) => (
                              <img
                                key={idx}
                                src={p.avatar}
                                alt={p.memberName}
                                className="w-5 h-5 rounded-full border-2 border-white object-cover"
                              />
                            ))}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 nexo-table-num font-semibold text-[#059669]">
                      {formatINR(ipo.combinedCapital)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          openIpoDetail(ipo);
                        }}
                      >
                        Inspect →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
