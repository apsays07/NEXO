"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useNexo } from "@/context/NexoContext";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopBar } from "@/components/shell/TopBar";
import { IPOHeader } from "@/components/ipo-detail/IPOHeader";
import { LocalNavigation } from "@/components/ipo-detail/LocalNavigation";
import { IPOHero } from "@/components/ipo-detail/IPOHero";
import { DecisionPanel } from "@/components/ipo-detail/DecisionPanel";
import { IPOSnapshot } from "@/components/ipo-detail/IPOSnapshot";
import { EvaluationScore } from "@/components/ipo-detail/EvaluationScore";
import { InvestmentThesis } from "@/components/ipo-detail/InvestmentThesis";
import { Lifecycle } from "@/components/ipo-detail/Lifecycle";
import { ParticipationSummary } from "@/components/ipo-detail/ParticipationSummary";
import { JoinApplicationModal } from "@/components/ipo-detail/JoinApplicationModal";
import { ApplicationProof } from "@/components/ipo-detail/ApplicationProof";
import { AllotmentPanel } from "@/components/ipo-detail/AllotmentPanel";
import { PerformanceSummary } from "@/components/ipo-detail/PerformanceSummary";
import { IPOSidebar } from "@/components/ipo-detail/IPOSidebar";
import { ApplicationModal } from "@/components/application/ApplicationModal";
import { ParticipationType } from "@/types/nexo";
import Link from "next/link";

export default function IPODetailPage() {
  const params = useParams();
  const router = useRouter();
  const {
    ipos,
    createApplication,
    openApplicationModal,
  } = useNexo();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const rawId = params?.id as string;
  const normalizedId = rawId ? decodeURIComponent(rawId).toLowerCase() : "";

  // Find target IPO by ID or slug match
  const ipo =
    ipos.find((i) => i.id.toLowerCase() === normalizedId) ||
    ipos.find(
      (i) => i.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedId
    ) ||
    ipos[0]; // fallback to featured mock IPO if direct ID hit

  if (!ipo) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC] text-[#111318]">
        <Sidebar />
        <div className="flex-1 p-8 text-center space-y-4 font-sans">
          <h2 className="text-xl font-semibold">IPO Opportunity Not Found</h2>
          <p className="text-xs text-[#5F6673]">The requested IPO opportunity could not be found.</p>
          <Link href="/" className="text-xs text-[#2563EB] font-semibold underline">
            ← Back to Workspace
          </Link>
        </div>
      </div>
    );
  }

  const handleJoinApplication = (type: ParticipationType, contribution: number) => {
    createApplication(ipo.id, type, [
      { memberId: "m1", contribution }, // Ashay logged in
    ]);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111318] font-sans antialiased">
      {/* LEFT SIDEBAR NAVIGATION */}
      <Sidebar />

      {/* MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        {/* STICKY LOCAL NAVIGATION */}
        <LocalNavigation />

        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto space-y-8">
          {/* HEADER & BREADCRUMBS */}
          <IPOHeader
            ipo={ipo}
            onJoinClick={() => setIsJoinModalOpen(true)}
            onViewApplicationClick={() => openApplicationModal(ipo)}
          />

          {/* DESKTOP 8:4 ASYMMETRIC GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* MAIN 8-COL EVALUATION & PARTICIPATION MEMO STACK */}
            <div className="lg:col-span-8 space-y-8">
              <IPOHero ipo={ipo} />
              <DecisionPanel ipo={ipo} />
              <IPOSnapshot ipo={ipo} />
              <EvaluationScore />
              <InvestmentThesis />
              <Lifecycle ipo={ipo} />
              <ParticipationSummary
                ipo={ipo}
                onJoinClick={() => setIsJoinModalOpen(true)}
              />
              <ApplicationProof ipo={ipo} />
              <AllotmentPanel ipo={ipo} />
              <PerformanceSummary ipo={ipo} />
            </div>

            {/* STICKY 4-COL SUMMARY SIDEBAR */}
            <div className="lg:col-span-4">
              <IPOSidebar
                ipo={ipo}
                onManageClick={() => openApplicationModal(ipo)}
              />
            </div>
          </div>
        </main>
      </div>

      {/* MODALS */}
      <JoinApplicationModal
        ipo={ipo}
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoinApplication}
      />
      <ApplicationModal />
    </div>
  );
}
