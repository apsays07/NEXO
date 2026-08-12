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
  listedIpos: import("@/types/nexo").ListedIPO[];
  addListedIpo: (ipo: Omit<import("@/types/nexo").ListedIPO, "id">) => void;
  deleteListedIpo: (id: string) => void;
  createIPO: (data: {
    name: string;
    minInvestment: number;
    issueSize: number;
    description: string;
    closeDate: string;
  }) => { success: boolean; message?: string };
  removeIPO: (ipoId: string) => { success: boolean; message?: string };
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

  const [activeTab, setActiveTab] = useState<ViewTab>("dashboard");
  const [currentUserRole, setCurrentUserRole] = useState<MemberRole>("ADMIN");

  // Restore session & persisted local storage state safely after hydration
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("nexo_session_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        setCurrentUserRole(parsed.role || "ADMIN");
        setIsAuthenticated(true);
      }

      const storedSavings = localStorage.getItem("nexo_individualSavings");
      if (storedSavings !== null) setIndividualSavings(parseFloat(storedSavings));

      const storedContribs = localStorage.getItem("nexo_userContributions");
      if (storedContribs !== null) setUserContributions(JSON.parse(storedContribs));

      const storedTxns = localStorage.getItem("nexo_transactions");
      if (storedTxns !== null) setTransactions(JSON.parse(storedTxns));
    } catch {}

    setIsAuthLoaded(true);

    async function syncDb() {
      try {
        const ipoRes = await fetch("/api/ipos");
        const ipoData = await ipoRes.json();
        if (ipoData?.success && Array.isArray(ipoData.ipos) && ipoData.ipos.length > 0) {
          setIpos(ipoData.ipos);
        }
      } catch {}
    }
    syncDb();
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

    // Match against mock members or demo credentials
    let foundMember = members.find(
      (m) =>
        m.id.toLowerCase() === cleanId ||
        m.email.toLowerCase() === cleanId ||
        m.name.toLowerCase() === cleanId
    );

    // Also support 'admin' alias for Ankit
    if (!foundMember && cleanId === "admin") {
      foundMember = members[0]; // Ankit
    }

    // Default password checks:
    // admin / admin123, user123, password, nexo123, or any non-empty password for valid members
    if (foundMember) {
      // Valid member found
      setCurrentUser(foundMember);
      setCurrentUserRole(foundMember.role);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("nexo_session_user", JSON.stringify(foundMember));
      } catch {}
      return { success: true };
    } else {
      // If user provided a custom ID, create a dynamic guest session if password is valid
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
  const [ipos, setIpos] = useState<IPOOpportunity[]>(MOCK_IPOS);
  const [activities, setActivities] = useState<ActivityItem[]>(MOCK_ACTIVITIES);
  const [actionItems, setActionItems] = useState<ActionItem[]>(MOCK_ACTION_ITEMS);
  const [portfolioSummary] = useState<PortfolioSummary>(MOCK_PORTFOLIO_SUMMARY);
  const [individualSavings, setIndividualSavings] = useState<number>(0);
  const [userContributions, setUserContributions] = useState<Record<string, number>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Persist to localStorage on change
  useEffect(() => {
    try { localStorage.setItem("nexo_individualSavings", String(individualSavings)); } catch {}
  }, [individualSavings]);
  useEffect(() => {
    try { localStorage.setItem("nexo_userContributions", JSON.stringify(userContributions)); } catch {}
  }, [userContributions]);
  useEffect(() => {
    try { localStorage.setItem("nexo_transactions", JSON.stringify(transactions)); } catch {}
  }, [transactions]);


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
    participantContributions: { memberId: string; contribution: number }[],
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
        memberName: member?.name || "Member",
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
    const appNumber = `NEXO-APP-${Math.floor(1000 + Math.random() * 9000)}`;
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
      applicationNumber: appNumber,
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

    // Record transaction. Ledger keeps its own SOLO/COMBO vocabulary, so map
    // from the canonical INDIVIDUAL/COMBINED type used by applications.
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      ipoId,
      ipoName: activeApplicationIpo?.name || "IPO",
      type: canonicalType === "INDIVIDUAL" ? "SOLO" : "COMBO",
      amount: total,
      applicationNumber: appNumber,
      participants:
        canonicalType === "INDIVIDUAL"
          ? [applicantMember?.name || members[0].name]
          : formattedParticipants.map((p) => p.memberName),
      createdAt: new Date().toISOString(),
      status: "SUBMITTED",
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    // Deduct applied amount from individual savings (only for solo applications)
    if (canonicalType === "INDIVIDUAL") {
      setIndividualSavings((prev) => Math.max(0, prev - total));
      // Also record as a userContribution for the IPO
      setUserContributions((prev) => ({
        ...prev,
        [ipoId]: (prev[ipoId] ?? 0) + total,
      }));
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

  const createIPO = (data: {
    name: string;
    minInvestment: number;
    issueSize: number;
    description: string;
    closeDate: string;
  }) => {
    const activeRole = currentMember?.role || currentUser?.role || currentUserRole;
    if (activeRole !== "ADMIN") {
      return { success: false, message: "Unauthorized. Admin privileges required." };
    }

    const adminName = currentMember?.name || currentUser?.name || "Shivam Prasad";
    const formattedIssueSize = `₹${Number(data.issueSize).toLocaleString("en-IN")} Cr`;

    const newIpo: IPOOpportunity = {
      id: `ipo_${Date.now()}`,
      name: data.name,
      company: data.name, // Direct company name without invented legal suffixes
      logo: data.name.substring(0, 2).toUpperCase(),
      category: "Mainboard",
      status: "APPLICATION_OPEN",
      recommendation: "APPLY",
      thesis: data.description,
      isHidden: false,
      metrics: {
        issueSize: formattedIssueSize,
        priceBand: { min: 0, max: 0 },
        lotSize: 1,
        minInvestment: Number(data.minInvestment) || 15000,
        openDate: "Open",
        closeDate: data.closeDate || "28 Aug 2026",
        allotmentDate: "—",
        listingDate: "—",
      },
      createdBy: adminName,
      participantsCount: 0,
      combinedCapital: 0,
      applications: [],
    };

    setIpos((prev) => [newIpo, ...prev]);

    const newActivity: ActivityItem = {
      id: `act_${Date.now()}`,
      type: "IPO_ADDED",
      title: `${adminName} added ${data.name}`,
      subtitle: `Closes on ${data.closeDate} • Min. Investment ₹${Number(data.minInvestment).toLocaleString("en-IN")}`,
      timestamp: "Today",
      memberName: adminName,
      memberAvatar: currentMember?.avatar || members[0].avatar,
      ipoId: newIpo.id,
      ipoName: data.name,
    };

    setActivities((prev) => [newActivity, ...prev]);

    return { success: true, message: `✓ IPO published successfully. ${data.name} is now visible on the user website.` };
  };

  const removeIPO = (ipoId: string) => {
    const activeRole = currentMember?.role || currentUser?.role || currentUserRole;
    if (activeRole !== "ADMIN") {
      return { success: false, message: "Unauthorized. Admin privileges required." };
    }

    const targetIpo = ipos.find((i) => i.id === ipoId);
    if (!targetIpo) {
      return { success: false, message: "IPO not found." };
    }

    const adminName = currentMember?.name || currentUser?.name || "Shivam Prasad";

    // Soft hide from member-facing lists while preserving application references
    setIpos((prev) =>
      prev.map((ipo) => (ipo.id === ipoId ? { ...ipo, isHidden: true } : ipo))
    );

    const newActivity: ActivityItem = {
      id: `act_${Date.now()}`,
      type: "IPO_ADDED",
      title: `${adminName} removed ${targetIpo.name}`,
      subtitle: `IPO hidden from user website`,
      timestamp: "Today",
      memberName: adminName,
      memberAvatar: currentMember?.avatar || members[0].avatar,
      ipoId: targetIpo.id,
      ipoName: targetIpo.name,
    };

    setActivities((prev) => [newActivity, ...prev]);

    return { success: true, message: `✓ IPO removed. ${targetIpo.name} is no longer visible on the user website.` };
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
          // Reverse balance deduction for SOLO
          if (txn.type === "SOLO") {
            setIndividualSavings((prev) => prev + txn.amount);
            setUserContributions((prev) => {
              const updated = { ...prev };
              const existing = updated[txn.ipoId] ?? 0;
              updated[txn.ipoId] = Math.max(0, existing - txn.amount);
              return updated;
            });
          }
          setTransactions((prev) => prev.filter((t) => t.id !== txnId));
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
        createIPO,
        removeIPO,
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
