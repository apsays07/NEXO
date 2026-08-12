"use client";

import React, { createContext, useContext, useState } from "react";
import {
  IPOOpportunity,
  Member,
  ActivityItem,
  PortfolioSummary,
  ParticipationType,
  IPOLifecycleStage,
  ActionItem,
  RecommendationType,
} from "@/types/nexo";
import {
  MOCK_IPOS,
  MOCK_MEMBERS,
  MOCK_ACTIVITIES,
  MOCK_PORTFOLIO_SUMMARY,
  MOCK_ACTION_ITEMS,
} from "@/lib/mockData";

type ViewTab = "dashboard" | "ipos" | "applications" | "portfolio" | "members";

interface NexoContextType {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  ipos: IPOOpportunity[];
  members: Member[];
  activities: ActivityItem[];
  actionItems: ActionItem[];
  dismissActionItem: (id: string) => void;
  portfolioSummary: PortfolioSummary;
  selectedIpo: IPOOpportunity | null;
  openIpoDetail: (ipo: IPOOpportunity) => void;
  closeIpoDetail: () => void;
  isApplicationModalOpen: boolean;
  activeApplicationIpo: IPOOpportunity | null;
  openApplicationModal: (ipo: IPOOpportunity) => void;
  closeApplicationModal: () => void;
  isAddIpoModalOpen: boolean;
  openAddIpoModal: () => void;
  closeAddIpoModal: () => void;
  addNewIpo: (ipoData: {
    name: string;
    company: string;
    priceMin: number;
    priceMax: number;
    lotSize: number;
    openDate: string;
    closeDate: string;
    recommendation: RecommendationType;
    thesis: string;
  }) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  revealedPans: Record<string, boolean>;
  togglePanReveal: (memberId: string) => void;
  createApplication: (
    ipoId: string,
    type: ParticipationType,
    participantContributions: { memberId: string; contribution: number }[],
    proofUrl?: string
  ) => void;
  updateIpoStatus: (ipoId: string, status: IPOLifecycleStage) => void;
  isLoading: boolean;
}

const NexoContext = createContext<NexoContextType | undefined>(undefined);

export function NexoProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<ViewTab>("dashboard");
  const [ipos, setIpos] = useState<IPOOpportunity[]>(MOCK_IPOS);
  const [members] = useState<Member[]>(MOCK_MEMBERS);
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [actionItems, setActionItems] = useState<ActionItem[]>(MOCK_ACTION_ITEMS);
  const [portfolioSummary] = useState<PortfolioSummary>(MOCK_PORTFOLIO_SUMMARY);

  const [selectedIpo, setSelectedIpo] = useState<IPOOpportunity | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [activeApplicationIpo, setActiveApplicationIpo] = useState<IPOOpportunity | null>(null);
  const [isAddIpoModalOpen, setIsAddIpoModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [revealedPans, setRevealedPans] = useState<Record<string, boolean>>({});
  const [isLoading] = useState(false);

  const togglePanReveal = (memberId: string) => {
    setRevealedPans((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  const dismissActionItem = (id: string) => {
    setActionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const openIpoDetail = (ipo: IPOOpportunity) => {
    setSelectedIpo(ipo);
    const slug = ipo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (typeof window !== "undefined") {
      window.location.href = `/ipos/${slug}`;
    }
  };

  const closeIpoDetail = () => {
    setSelectedIpo(null);
  };

  const openApplicationModal = (ipo: IPOOpportunity) => {
    setActiveApplicationIpo(ipo);
    setIsApplicationModalOpen(true);
  };

  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setActiveApplicationIpo(null);
  };

  const openAddIpoModal = () => setIsAddIpoModalOpen(true);
  const closeAddIpoModal = () => setIsAddIpoModalOpen(false);

  const addNewIpo = (data: {
    name: string;
    company: string;
    priceMin: number;
    priceMax: number;
    lotSize: number;
    openDate: string;
    closeDate: string;
    recommendation: RecommendationType;
    thesis: string;
  }) => {
    const minInv = data.priceMax * data.lotSize;
    const newIpo: IPOOpportunity = {
      id: `ipo_${Date.now()}`,
      name: data.name,
      company: data.company,
      logo: data.name.substring(0, 2).toUpperCase(),
      category: "Mainboard",
      status: "APPLYING",
      recommendation: data.recommendation,
      thesis: data.thesis,
      metrics: {
        issueSize: "₹1,000 Cr",
        priceBand: { min: data.priceMin, max: data.priceMax },
        lotSize: data.lotSize,
        minInvestment: minInv,
        openDate: data.openDate || "Today",
        closeDate: data.closeDate || "3 days",
        allotmentDate: "T+3 Days",
        listingDate: "T+6 Days",
      },
      createdBy: "Niranjan",
      participantsCount: 0,
      combinedCapital: 0,
      applications: [],
    };

    setIpos((prev) => [newIpo, ...prev]);

    const newActivity: ActivityItem = {
      id: `act_${Date.now()}`,
      type: "IPO_ADDED",
      title: `Ashay added ${data.name}`,
      subtitle: `Priced ₹${data.priceMin}–₹${data.priceMax} per share • Lot size ${data.lotSize}`,
      timestamp: "Just now",
      memberName: "Ashay",
      memberAvatar: members[1].avatar,
      ipoId: newIpo.id,
      ipoName: data.name,
    };

    setActivities((prev) => [newActivity, ...prev]);
    closeAddIpoModal();
  };

  const updateIpoStatus = (ipoId: string, status: IPOLifecycleStage) => {
    setIpos((prev) =>
      prev.map((item) => (item.id === ipoId ? { ...item, status } : item))
    );
    if (selectedIpo && selectedIpo.id === ipoId) {
      setSelectedIpo((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const createApplication = (
    ipoId: string,
    type: ParticipationType,
    participantContributions: { memberId: string; contribution: number }[],
    proofUrl?: string
  ) => {
    const total = participantContributions.reduce((sum, p) => sum + p.contribution, 0);

    const formattedParticipants = participantContributions.map((p) => {
      const member = members.find((m) => m.id === p.memberId);
      const percentage = total > 0 ? (p.contribution / total) * 100 : 0;
      return {
        memberId: p.memberId,
        memberName: member?.name || "Member",
        avatar: member?.avatar || "",
        contribution: p.contribution,
        percentage: Number(percentage.toFixed(1)),
        panMasked: member?.panMasked || "XXXXXXXX41",
        panFull: member?.panFull,
        proofUrl: proofUrl,
        proofUploadedAt: proofUrl ? "Just now" : undefined,
        status: "SUBMITTED" as const,
      };
    });

    const newAppId = `app_${Date.now()}`;
    const newApplication = {
      id: newAppId,
      ipoId,
      type,
      totalContribution: total,
      status: "SUBMITTED" as const,
      createdAt: new Date().toISOString(),
      applicationNumber: `NEXO-APP-${Math.floor(1000 + Math.random() * 9000)}`,
      applicationProofUrl: proofUrl,
      participants: formattedParticipants,
    };

    setIpos((prev) =>
      prev.map((ipo) => {
        if (ipo.id === ipoId) {
          const updatedApps = [...ipo.applications, newApplication];
          const totalCombined = updatedApps.reduce(
            (sum, a) => sum + a.totalContribution,
            0
          );
          const uniqueParticipants = new Set(
            updatedApps.flatMap((a) => a.participants.map((p) => p.memberId))
          ).size;

          return {
            ...ipo,
            applications: updatedApps,
            combinedCapital: totalCombined,
            participantsCount: uniqueParticipants,
            status: ipo.status === "WATCHLIST" ? "APPLYING" : ipo.status,
          };
        }
        return ipo;
      })
    );

    // Dismiss missing proof action if proof was uploaded
    if (proofUrl) {
      setActionItems((prev) => prev.filter((a) => a.ipoId !== ipoId || a.type !== "PROOF_MISSING"));
    }

    // Record activity
    const newActivity: ActivityItem = {
      id: `act_${Date.now()}`,
      type: "APPLICATION_SUBMITTED",
      title: `${type} Application Submitted`,
      subtitle: `Combined ₹${total.toLocaleString("en-IN")} pooled for ${
        activeApplicationIpo?.name || "IPO"
      }`,
      timestamp: "Just now",
      memberName: "Niranjan",
      memberAvatar: members[0].avatar,
      ipoId,
      ipoName: activeApplicationIpo?.name,
    };

    setActivities((prev) => [newActivity, ...prev]);
    closeApplicationModal();
  };

  return (
    <NexoContext.Provider
      value={{
        activeTab,
        setActiveTab,
        ipos,
        members,
        activities,
        actionItems,
        dismissActionItem,
        portfolioSummary,
        selectedIpo,
        openIpoDetail,
        closeIpoDetail,
        isApplicationModalOpen,
        activeApplicationIpo,
        openApplicationModal,
        closeApplicationModal,
        isAddIpoModalOpen,
        openAddIpoModal,
        closeAddIpoModal,
        addNewIpo,
        searchQuery,
        setSearchQuery,
        revealedPans,
        togglePanReveal,
        createApplication,
        updateIpoStatus,
        isLoading,
      }}
    >
      {children}
    </NexoContext.Provider>
  );
}

export function useNexo() {
  const context = useContext(NexoContext);
  if (!context) {
    throw new Error("useNexo must be used within a NexoProvider");
  }
  return context;
}
