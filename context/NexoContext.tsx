"use client";

import React, { createContext, useContext, useState } from "react";
import {
  IPOOpportunity,
  Member,
  ActivityItem,
  PortfolioSummary,
  ParticipationType,
  ApplicationType,
  Application,
  AllotmentStatus,
  MemberRole,
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
  currentUserRole: MemberRole;
  setCurrentUserRole: (role: MemberRole) => void;
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
    type: ParticipationType | ApplicationType,
    participantContributions: { memberId: string; contribution: number }[],
    proofUrl?: string,
    applicantMemberId?: string
  ) => void;
  currentMember: Member;
  updateIpoStatus: (ipoId: string, status: IPOLifecycleStage) => void;
  updateApplicationStatus: (ipoId: string, applicationId: string, status: AllotmentStatus) => void;
  updateRegistrarUrl: (ipoId: string, url: string) => void;
  updateApplication: (
    ipoId: string,
    applicationId: string,
    dataOrName: string | {
      applicantName?: string;
      panMasked?: string;
      totalContribution?: number;
      participants?: import("@/types/nexo").ApplicationParticipant[];
    },
    newLotCount?: number
  ) => void;
  deleteApplication: (ipoId: string, applicationId: string) => void;
  listedIpos: import("@/types/nexo").ListedIPO[];
  addListedIpo: (ipo: Omit<import("@/types/nexo").ListedIPO, "id">) => void;
  deleteListedIpo: (id: string) => void;
  isLoading: boolean;
  isPremiumUser: boolean;
  activePlan: string;
  isPremiumModalOpen: boolean;
  openPremiumModal: (ipo?: IPOOpportunity | null) => void;
  closePremiumModal: () => void;
  activatePremiumPlan: (planName: string) => void;
}

const NexoContext = createContext<NexoContextType | undefined>(undefined);

export function NexoProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<ViewTab>("dashboard");
  const [currentUserRole, setCurrentUserRole] = useState<MemberRole>("ADMIN");
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
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [activePlan, setActivePlan] = useState("Free");
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const openPremiumModal = (_ipo?: IPOOpportunity | null) => setIsPremiumModalOpen(true);
  const closePremiumModal = () => setIsPremiumModalOpen(false);
  const activatePremiumPlan = (planName: string) => {
    setIsPremiumUser(true);
    setActivePlan(planName);
  };

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
      createdBy: "Shivam Prasad",
      participantsCount: 0,
      combinedCapital: 0,
      applications: [],
    };

    setIpos((prev) => [newIpo, ...prev]);

    const newActivity: ActivityItem = {
      id: `act_${Date.now()}`,
      type: "IPO_ADDED",
      title: `Shivam added ${data.name}`,
      subtitle: `Priced ₹${data.priceMin}–₹${data.priceMax} per share • Lot size ${data.lotSize}`,
      timestamp: "Just now",
      memberName: "Shivam Prasad",
      memberAvatar: members[0].avatar,
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

  const updateApplicationStatus = (
    ipoId: string,
    applicationId: string,
    allotmentStatus: AllotmentStatus
  ) => {
    setIpos((prev) =>
      prev.map((ipo) => {
        if (ipo.id === ipoId) {
          const updatedApps = ipo.applications.map((app) =>
            app.id === applicationId
              ? { ...app, allotmentStatus, status: allotmentStatus }
              : app
          );
          return { ...ipo, applications: updatedApps };
        }
        return ipo;
      })
    );
  };

  const deleteApplication = (ipoId: string, applicationId: string) => {
    setIpos((prev) =>
      prev.map((ipo) => {
        if (ipo.id === ipoId) {
          const updatedApps = ipo.applications.filter((app) => app.id !== applicationId);
          const newTotalCapital = updatedApps.reduce((sum, a) => sum + a.totalContribution, 0);
          return {
            ...ipo,
            applications: updatedApps,
            participantsCount: updatedApps.length,
            combinedCapital: newTotalCapital,
          };
        }
        return ipo;
      })
    );
  };

  const updateApplication = (
    ipoId: string,
    applicationId: string,
    dataOrName: string | {
      applicantName?: string;
      panMasked?: string;
      totalContribution?: number;
      participants?: import("@/types/nexo").ApplicationParticipant[];
    },
    newLotCount?: number
  ) => {
    setIpos((prev) =>
      prev.map((ipo) => {
        if (ipo.id === ipoId) {
          const minInvest = ipo.metrics?.minInvestment || 14964;
          const updatedApps = ipo.applications.map((app) => {
            if (app.id === applicationId) {
              if (typeof dataOrName === "string") {
                const name = dataOrName;
                const lotCount = newLotCount !== undefined ? newLotCount : (app.lotCount || 1);
                const newTotal = lotCount * minInvest;
                return {
                  ...app,
                  applicantName: name,
                  lotCount,
                  totalContribution: newTotal,
                };
              } else {
                const data = dataOrName;
                return {
                  ...app,
                  ...(data.applicantName !== undefined && { applicantName: data.applicantName }),
                  ...(data.panMasked !== undefined && { panMasked: data.panMasked }),
                  ...(data.totalContribution !== undefined && { totalContribution: data.totalContribution }),
                  ...(data.participants !== undefined && { participants: data.participants }),
                };
              }
            }
            return app;
          });
          const totalCombined = updatedApps.reduce(
            (sum, a) => sum + a.totalContribution,
            0
          );
          return {
            ...ipo,
            applications: updatedApps,
            combinedCapital: totalCombined,
          };
        }
        return ipo;
      })
    );
  };

  const createApplication = (
    ipoId: string,
    type: ParticipationType | ApplicationType,
    participantContributions: { memberId: string; memberName?: string; contribution: number }[],
    proofUrl?: string,
    applicantMemberId?: string
  ) => {
    const canonicalType: ApplicationType =
      type === "SOLO" || type === "INDIVIDUAL" ? "INDIVIDUAL" : "COMBINED";

    const total = participantContributions.reduce((sum, p) => sum + p.contribution, 0);

    const applicantMember = applicantMemberId
      ? members.find((m) => m.id === applicantMemberId)
      : members[0];

    const formattedParticipants = participantContributions.map((p) => {
      const member = members.find((m) => m.id === p.memberId);
      const percentage = total > 0 ? (p.contribution / total) * 100 : 0;
      return {
        memberId: p.memberId,
        memberName: p.memberName || member?.name || "Member",
        avatar: member?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
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
    const targetIpo = ipos.find((i) => i.id === ipoId);
    const newApplication: Application = {
      id: newAppId,
      ipoId,
      type: canonicalType,
      applicantName: applicantMember?.name || "Ankit",
      memberId: applicantMember?.id || "mem_1",
      panMasked: applicantMember?.panMasked || "XXXXXXXX41",
      totalContribution: total,
      lotCount: Math.max(1, participantContributions.length),
      verified: true,
      allotmentStatus: "AWAITING",
      status: "AWAITING",
      createdAt: new Date().toISOString(),
      applicationNumber: `NEXO-APP-${Math.floor(1000 + Math.random() * 9000)}`,
      applicationProofUrl: proofUrl,
      participants: formattedParticipants.length > 0 ? formattedParticipants : [
        {
          memberId: applicantMember?.id || "mem_1",
          memberName: applicantMember?.name || "Ankit",
          avatar: applicantMember?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          contribution: total,
          percentage: 100,
          panMasked: applicantMember?.panMasked || "XXXXXXXX41",
          panFull: applicantMember?.panFull,
          status: "SUBMITTED" as const,
        }
      ],
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
            updatedApps.flatMap((a) =>
              a.participants.map((p: { memberId: string }) => p.memberId)
            )
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
      setActionItems((prev) =>
        prev.filter((a) => a.ipoId !== ipoId || a.type !== "PROOF_MISSING")
      );
    }

    // Record activity
    const newActivity: ActivityItem = {
      id: `act_${Date.now()}`,
      type: "APPLICATION_SUBMITTED",
      title: `${applicantMember?.name || "Member"} filed ${newApplication.lotCount} IPO Application(s)`,
      subtitle: `Combined ₹${total.toLocaleString("en-IN")} for ${
        targetIpo?.name || activeApplicationIpo?.name || "IPO"
      }`,
      timestamp: "Just now",
      memberName: applicantMember?.name || "Ankit",
      memberAvatar: applicantMember?.avatar || members[0].avatar,
      ipoId,
      ipoName: targetIpo?.name || activeApplicationIpo?.name,
    };

    setActivities((prev) => [newActivity, ...prev]);
    closeApplicationModal();
    setActiveTab("applications");
  };

  const currentMember = members[0]; // Active logged-in user (Shivam Prasad)

  const updateRegistrarUrl = (ipoId: string, url: string) => {
    setIpos((prev) =>
      prev.map((ipo) => (ipo.id === ipoId ? { ...ipo, registrarUrl: url } : ipo))
    );
  };

  const [listedIpos, setListedIpos] = useState<import("@/types/nexo").ListedIPO[]>([
    {
      id: "listed_1",
      name: "ABC Industries",
      category: "Mainboard",
      logo: "ABC",
      lotsAllotted: 2,
      totalProfit: 30000,
      applicantsCount: 4,
      oneLotProfit: 15000,
      listingDate: "22 Aug 2026",
      lotPrice: 15000,
      userProfits: [
        { memberId: "mem_1", memberName: "Niranjan", profit: 15000 },
        { memberId: "mem_2", memberName: "Ashay", profit: 7500 },
        { memberId: "mem_3", memberName: "Ranveer", profit: 7500 },
      ],
    },
    {
      id: "listed_2",
      name: "Premier Energies",
      category: "Mainboard",
      logo: "PE",
      lotsAllotted: 3,
      totalProfit: 72000,
      applicantsCount: 6,
      oneLotProfit: 24000,
      listingDate: "03 Sep 2026",
      lotPrice: 14964,
      userProfits: [
        { memberId: "mem_1", memberName: "Niranjan", profit: 24000 },
        { memberId: "mem_2", memberName: "Ashay", profit: 24000 },
        { memberId: "mem_3", memberName: "Ranveer", profit: 24000 },
      ],
    },
    {
      id: "listed_3",
      name: "Bajaj Housing Finance",
      category: "Mainboard",
      logo: "BHF",
      lotsAllotted: 4,
      totalProfit: 112000,
      applicantsCount: 8,
      oneLotProfit: 28000,
      listingDate: "16 Sep 2026",
      lotPrice: 15000,
      userProfits: [
        { memberId: "mem_1", memberName: "Niranjan", profit: 28000 },
        { memberId: "mem_2", memberName: "Ashay", profit: 28000 },
        { memberId: "mem_3", memberName: "Ranveer", profit: 28000 },
        { memberId: "mem_4", memberName: "Amit", profit: 28000 },
      ],
    },
    {
      id: "listed_4",
      name: "KRN Heat Exchanger",
      category: "SME",
      logo: "KRN",
      lotsAllotted: 2,
      totalProfit: 94000,
      applicantsCount: 5,
      oneLotProfit: 47000,
      listingDate: "03 Oct 2026",
      lotPrice: 14820,
      userProfits: [
        { memberId: "mem_1", memberName: "Niranjan", profit: 47000 },
        { memberId: "mem_2", memberName: "Ashay", profit: 47000 },
      ],
    },
  ]);

  const addListedIpo = (ipoData: Omit<import("@/types/nexo").ListedIPO, "id">) => {
    const newListed: import("@/types/nexo").ListedIPO = {
      id: `listed_${Date.now()}`,
      ...ipoData,
      logo: ipoData.logo || ipoData.name.substring(0, 2).toUpperCase(),
    };
    setListedIpos((prev) => [newListed, ...prev]);
  };

  const deleteListedIpo = (id: string) => {
    setListedIpos((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <NexoContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUserRole,
        setCurrentUserRole,
        ipos,
        members,
        currentMember,
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
        updateApplicationStatus,
        updateRegistrarUrl,
        deleteApplication,
        updateApplication,
        listedIpos,
        addListedIpo,
        deleteListedIpo,
        isLoading,
        isPremiumUser,
        activePlan,
        isPremiumModalOpen,
        openPremiumModal,
        closePremiumModal,
        activatePremiumPlan,
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
