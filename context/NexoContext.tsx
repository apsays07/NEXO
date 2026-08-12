"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  IPOOpportunity,
  Member,
  MemberRole,
  ActivityItem,
  PortfolioSummary,
  ParticipationType,
  ApplicationType,
  Application,
  AllotmentStatus,
  IPOLifecycleStage,
  ActionItem,
  RecommendationType,
  Transaction,
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
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  currentUser: Member | null;
  currentMember: Member;
  login: (userId: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  authError: string | null;
  setAuthError: (err: string | null) => void;
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
  individualSavings: number;
  updateIndividualSavings: (amount: number) => void;
  userContributions: Record<string, number>;
  updateUserContribution: (ipoId: string, amount: number) => void;
  transactions: Transaction[];
  clearTransactions: () => void;
  deleteTransaction: (txnId: string) => void;
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
  updateIpoStatus: (ipoId: string, status: IPOLifecycleStage) => void;
  updateApplicationStatus: (ipoId: string, applicationId: string, status: AllotmentStatus) => void;
  updateRegistrarUrl: (ipoId: string, url: string) => void;
  updateApplication: (
    ipoId: string,
    applicationId: string,
    data: {
      applicantName?: string;
      panMasked?: string;
      totalContribution?: number;
      participants?: import("@/types/nexo").ApplicationParticipant[];
    }
  ) => void;
  deleteApplication: (ipoId: string, applicationId: string) => void;
  updateTransaction: (
    txnId: string,
    data: { amount?: number; applicantName?: string; panMasked?: string }
  ) => void;
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
  const [members] = useState<Member[]>(MOCK_MEMBERS);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ViewTab>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexo_active_tab");
        if (stored) return stored as ViewTab;
      } catch {}
    }
    return "dashboard";
  });
  const [currentUserRole, setCurrentUserRole] = useState<MemberRole>("ADMIN");

  // Auto-save activeTab to localStorage on tab switch
  useEffect(() => {
    if (typeof window !== "undefined") {
      try { localStorage.setItem("nexo_active_tab", activeTab); } catch {}
    }
  }, [activeTab]);

  // State definitions initialized lazily from localStorage to guarantee persistence
  const [ipos, setIpos] = useState<IPOOpportunity[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexo_ipos");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return MOCK_IPOS;
  });

  const [individualSavings, setIndividualSavings] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexo_individualSavings");
        if (stored !== null && !isNaN(parseFloat(stored))) return parseFloat(stored);
      } catch {}
    }
    return 50000;
  });

  const [userContributions, setUserContributions] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexo_userContributions");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return {};
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexo_transactions");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return [];
  });

  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [actionItems, setActionItems] = useState<ActionItem[]>(MOCK_ACTION_ITEMS);
  const [portfolioSummary] = useState<PortfolioSummary>(MOCK_PORTFOLIO_SUMMARY);

  // Auto-save to localStorage on state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try { localStorage.setItem("nexo_individualSavings", String(individualSavings)); } catch {}
    }
  }, [individualSavings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try { localStorage.setItem("nexo_userContributions", JSON.stringify(userContributions)); } catch {}
    }
  }, [userContributions]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try { localStorage.setItem("nexo_transactions", JSON.stringify(transactions)); } catch {}
    }
  }, [transactions]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try { localStorage.setItem("nexo_ipos", JSON.stringify(ipos)); } catch {}
    }
  }, [ipos]);

  // Restore session & auth state safely on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("nexo_session_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        setCurrentUserRole(parsed.role || "ADMIN");
        setIsAuthenticated(true);
      }
    } catch {}

    setIsAuthLoaded(true);
  }, []);

  const login = (userId: string, pass: string): { success: boolean; message?: string } => {
    setAuthError(null);
    const cleanId = userId.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId) {
      const msg = "Please enter a User ID or Email";
      setAuthError(msg);
      return { success: false, message: msg };
    }

    if (!cleanPass) {
      const msg = "Please enter your password";
      setAuthError(msg);
      return { success: false, message: msg };
    }

    let foundMember = members.find(
      (m) =>
        m.id.toLowerCase() === cleanId ||
        m.email.toLowerCase() === cleanId ||
        m.name.toLowerCase() === cleanId
    );

    if (!foundMember && cleanId === "admin") {
      foundMember = members[0];
    }

    if (foundMember) {
      setCurrentUser(foundMember);
      setCurrentUserRole(foundMember.role);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("nexo_session_user", JSON.stringify(foundMember));
      } catch {}
      return { success: true };
    } else {
      if (cleanPass.length >= 4) {
        const dynamicUser: Member = {
          id: `user_${Date.now()}`,
          name: userId.trim(),
          email: `${cleanId}@nexo.private`,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          role: cleanId.includes("admin") ? "ADMIN" : "MEMBER",
          panMasked: "XXXXXXXX99",
          panFull: "ABCDE9999Z",
          defaultContribution: 50000,
          joinedAt: "Today",
        };
        setCurrentUser(dynamicUser);
        setCurrentUserRole(dynamicUser.role);
        setIsAuthenticated(true);
        try {
          localStorage.setItem("nexo_session_user", JSON.stringify(dynamicUser));
        } catch {}
        return { success: true };
      }
    }

    const msg = "Invalid User ID or Password. Try demo login: 'admin' / 'admin123'";
    setAuthError(msg);
    return { success: false, message: msg };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthError(null);
    try {
      localStorage.removeItem("nexo_session_user");
    } catch {}
  };

  const updateIndividualSavings = (amount: number) => {
    setIndividualSavings(amount);
  };

  const updateUserContribution = (ipoId: string, amount: number) => {
    setUserContributions((prev) => ({
      ...prev,
      [ipoId]: amount,
    }));
  };

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

  const createApplication = (
    ipoId: string,
    type: ParticipationType | ApplicationType,
    participantContributions: {
      memberId: string;
      memberName?: string;
      contribution: number;
      panMasked?: string;
      panFull?: string;
    }[],
    proofUrl?: string,
    applicantMemberId?: string,
    customApplicantName?: string,
    customPanMasked?: string
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
        panMasked: p.panMasked || member?.panMasked || "XXXXXXXX41",
        panFull: p.panFull || member?.panFull,
        proofUrl: proofUrl,
        proofUploadedAt: proofUrl ? "Just now" : undefined,
        status: "SUBMITTED" as const,
      };
    });

    const newAppId = `app_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const targetIpo = ipos.find((i) => i.id === ipoId);
    const appNumber = `NEXO-APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const resolvedApplicantName = customApplicantName || applicantMember?.name || "Ankit";
    const resolvedPanMasked = customPanMasked || formattedParticipants[0]?.panMasked || applicantMember?.panMasked || "XXXXXXXX41";

    const newApplication: Application = {
      id: newAppId,
      ipoId,
      type: canonicalType,
      applicantName: resolvedApplicantName,
      memberId: applicantMember?.id || "mem_1",
      panMasked: resolvedPanMasked,
      totalContribution: total,
      lotCount: Math.max(1, participantContributions.length),
      verified: true,
      allotmentStatus: "AWAITING",
      status: "AWAITING",
      createdAt: new Date().toISOString(),
      applicationNumber: appNumber,
      applicationProofUrl: proofUrl,
      participants: formattedParticipants.length > 0 ? formattedParticipants : [
        {
          memberId: applicantMember?.id || "mem_1",
          memberName: resolvedApplicantName,
          avatar: applicantMember?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          contribution: total,
          percentage: 100,
          panMasked: resolvedPanMasked,
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

    // Determine the logged-in user's individual contribution share
    const myContribEntry = participantContributions.find(
      (p) =>
        p.memberId === applicantMemberId ||
        (p.memberName && p.memberName.toLowerCase().includes("ankit")) ||
        p.memberId === (members[0]?.id || "mem_1")
    );
    const myShare = canonicalType === "INDIVIDUAL"
      ? total
      : (myContribEntry ? myContribEntry.contribution : participantContributions[0]?.contribution ?? total);

    // Record transaction. Store user's deducted share as amount, and total group pool for ledger clarity
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}_${Math.floor(10000 + Math.random() * 90000)}`,
      ipoId,
      ipoName: targetIpo?.name || activeApplicationIpo?.name || "IPO",
      type: canonicalType === "INDIVIDUAL" ? "SOLO" : "COMBO",
      amount: myShare,
      userContribution: myShare,
      groupTotalPool: total,
      applicationNumber: appNumber,
      participants:
        canonicalType === "INDIVIDUAL"
          ? [resolvedApplicantName]
          : formattedParticipants.map((p) => `${p.memberName} (${p.contribution >= 1000 ? `₹${(p.contribution / 1000).toFixed(0)}k` : `₹${p.contribution}`})`),
      createdAt: new Date().toISOString(),
      status: "SUBMITTED",
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    // Record logged-in user's contribution for this IPO (deducting only their share)
    setUserContributions((prev) => ({
      ...prev,
      [ipoId]: (prev[ipoId] ?? 0) + myShare,
    }));

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

  const [listedIpos, setListedIpos] = useState<import("@/types/nexo").ListedIPO[]>([
    {
      id: "l_1",
      name: "Premier Energies",
      category: "Mainboard",
      logo: "⚡",
      lotsAllotted: 2,
      totalProfit: 42000,
      applicantsCount: 5,
      oneLotProfit: 21000,
      listingDate: "Sep 2024",
    },
    {
      id: "l_2",
      name: "Bajaj Housing Finance",
      category: "Mainboard",
      logo: "🏦",
      lotsAllotted: 3,
      totalProfit: 68500,
      applicantsCount: 6,
      oneLotProfit: 22833,
      listingDate: "Sep 2024",
    },
  ]);

  const addListedIpo = (ipoData: Omit<import("@/types/nexo").ListedIPO, "id">) => {
    const newListedItem = {
      ...ipoData,
      id: `l_${Date.now()}`,
    };
    setListedIpos((prev) => [newListedItem, ...prev]);
  };

  const deleteListedIpo = (id: string) => {
    setListedIpos((prev) => prev.filter((item) => item.id !== id));
  };

  const deleteApplication = (ipoId: string, applicationId: string) => {
    setIpos((prev) =>
      prev.map((ipo) => {
        if (ipo.id === ipoId) {
          const updatedApps = ipo.applications.filter((a) => a.id !== applicationId);
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

  const updateApplication = (
    ipoId: string,
    applicationId: string,
    data: {
      applicantName?: string;
      panMasked?: string;
      totalContribution?: number;
      participants?: import("@/types/nexo").ApplicationParticipant[];
    }
  ) => {
    setIpos((prev) =>
      prev.map((ipo) => {
        if (ipo.id === ipoId) {
          const updatedApps = ipo.applications.map((app) => {
            if (app.id === applicationId) {
              return { ...app, ...data };
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

  const updateRegistrarUrl = (ipoId: string, url: string) => {
    setIpos((prev) =>
      prev.map((ipo) => (ipo.id === ipoId ? { ...ipo, registrarUrl: url } : ipo))
    );
  };

  return (
    <NexoContext.Provider
      value={{
        isAuthenticated,
        isAuthLoaded,
        currentUser,
        currentMember: currentUser || members[0],
        login,
        logout,
        authError,
        setAuthError,
        activeTab,
        setActiveTab,
        currentUserRole,
        setCurrentUserRole,
        ipos,
        members,
        activities,
        actionItems,
        dismissActionItem,
        portfolioSummary,
        individualSavings,
        updateIndividualSavings,
        userContributions,
        updateUserContribution,
        transactions,
        clearTransactions: () => setTransactions([]),
        deleteTransaction: (txnId: string) => {
          const txn = transactions.find((t) => t.id === txnId);
          if (!txn) return;

          // 1. Restore capital back to userContributions / balance
          setUserContributions((prev) => {
            const updated = { ...prev };
            const existing = updated[txn.ipoId] ?? 0;
            updated[txn.ipoId] = Math.max(0, existing - txn.amount);
            return updated;
          });

          // 2. Remove transaction from ledger
          setTransactions((prev) => prev.filter((t) => t.id !== txnId));

          // 3. Remove corresponding application from ipos[].applications
          setIpos((prev) =>
            prev.map((ipo) => {
              if (ipo.id === txn.ipoId) {
                const filteredApps = ipo.applications.filter((app) => {
                  if (txn.applicationNumber && app.applicationNumber === txn.applicationNumber) {
                    return false;
                  }
                  if (txn.participants && txn.participants.length > 0 && app.applicantName) {
                    const primaryParticipant = txn.participants[0].split("(")[0].trim();
                    if (app.applicantName.trim().toLowerCase() === primaryParticipant.toLowerCase()) {
                      return false;
                    }
                  }
                  return true;
                });

                return {
                  ...ipo,
                  applications: filteredApps,
                  status: filteredApps.length === 0 ? "WATCHLIST" : ipo.status,
                };
              }
              return ipo;
            })
          );
        },
        updateTransaction: (
          txnId: string,
          data: { amount?: number; applicantName?: string; panMasked?: string }
        ) => {
          const txn = transactions.find((t) => t.id === txnId);
          if (!txn) return;

          const oldAmount = txn.amount;
          const newAmount = data.amount !== undefined ? data.amount : oldAmount;
          const newName = data.applicantName !== undefined ? data.applicantName : txn.participants[0];
          const newPan = data.panMasked !== undefined ? data.panMasked : txn.panMasked;

          if (newAmount !== oldAmount) {
            const diff = newAmount - oldAmount;
            setUserContributions((prev) => ({
              ...prev,
              [txn.ipoId]: Math.max(0, (prev[txn.ipoId] ?? 0) + diff),
            }));
          }

          setTransactions((prev) =>
            prev.map((t) => {
              if (t.id === txnId) {
                const updatedParts = [...t.participants];
                if (updatedParts.length > 0 && data.applicantName) {
                  updatedParts[0] = data.applicantName;
                }
                return {
                  ...t,
                  amount: newAmount,
                  userContribution: newAmount,
                  panMasked: newPan,
                  participants: updatedParts,
                };
              }
              return t;
            })
          );

          setIpos((prev) =>
            prev.map((ipo) => {
              if (ipo.id === txn.ipoId) {
                const updatedApps = ipo.applications.map((app) => {
                  if (app.applicationNumber === txn.applicationNumber || app.applicantName === txn.participants[0]) {
                    return {
                      ...app,
                      applicantName: newName,
                      panMasked: newPan || app.panMasked,
                      totalContribution: newAmount,
                    };
                  }
                  return app;
                });
                return { ...ipo, applications: updatedApps };
              }
              return ipo;
            })
          );
        },
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
        updateApplication,
        deleteApplication,
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
