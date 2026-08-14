import {
  Member,
  IPOOpportunity,
  PortfolioSummary,
  ActivityItem,
  ActionItem,
} from "@/types/nexo";

export const MOCK_MEMBERS: Member[] = [
  {
    id: "mem_admin",
    name: "Ankit",
    username: "ankitgod",
    password: "admin123",
    email: "ankitgod@nexo.private",
    avatar: "/oggy.png",
    role: "SUPER_ADMIN",
    panMasked: "ABCDE1234F",
    panFull: "ABCDE1234F",
    defaultContribution: 100000,
    joinedAt: "Jan 2025",
    phone: "+91 98200 12345",
  },
];


export const MOCK_IPOS: IPOOpportunity[] = [
  {
    id: "ipo_1786630252147",
    name: "HDB Financial Services",
    company: "HDB Financial Services Limited",
    logo: "HDB",
    category: "Mainboard",
    status: "APPLICATION_OPEN",
    recommendation: "APPLY",
    thesis: "Leading NBFC subsidiary of HDFC Bank with strong retail lending and credit distribution network.",
    isFeatured: true,
    metrics: {
      issueSize: "₹2,400 Cr",
      priceBand: { min: 700, max: 740 },
      lotSize: 20,
      minInvestment: 14800,
      openDate: "18 Aug 2026",
      closeDate: "28 Aug 2026",
      allotmentDate: "01 Sep 2026",
      listingDate: "04 Sep 2026",
      gmpPercent: 18.5,
    },
    createdBy: "Admin",
    participantsCount: 1,
    combinedCapital: 15000,
    tags: ["NBFC", "HDFC Group", "High Growth"],
    applications: [
      {
        id: "app_1786683514267",
        ipoId: "ipo_1786630252147",
        type: "INDIVIDUAL",
        applicantName: "user",
        memberId: "mem_1786680225463",
        panMasked: "HSCPP7066Q",
        totalContribution: 15000,
        lotCount: 1,
        verified: true,
        allotmentStatus: "AWAITING",
        status: "AWAITING",
        createdAt: "2026-08-14T04:58:34.267Z",
        applicationNumber: "NEXO-APP-6912",
        participants: [
          {
            memberId: "mem_1786680225463",
            memberName: "user",
            avatar: "/japlu.png",
            contribution: 15000,
            percentage: 100,
            panMasked: "HSCPP7066Q",
            panFull: "HSCPP7066Q",
            status: "SUBMITTED",
          },
        ],
      },
    ],
  },
];

export const MOCK_PORTFOLIO_SUMMARY: PortfolioSummary = {
  totalCapital: 284500,
  capitalDeployed: 184500,
  currentlyBlocked: 72000,
  availableCapital: 100000,
  totalReturn: 25650,
  totalReturnPercent: 8.91,
  realizedPnL: 18400,
  unrealizedPnL: 7250,
  activeOpportunitiesCount: 3,
  allotmentSuccessRatePercent: 66.7,
  allocation: {
    availablePercent: 35,
    blockedPercent: 25,
    investedPercent: 40,
  },
};

export const MOCK_ACTION_ITEMS: ActionItem[] = [
  {
    id: "act_item_1",
    type: "ALLOTMENT_PENDING",
    title: "Allotment status pending",
    subtitle: "HDB Financial Services allotment status expected on registrar portal soon.",
    ipoId: "ipo_1786630252147",
    ipoName: "HDB Financial Services",
    ctaLabel: "Check allotment →",
  },
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "act_1",
    type: "APPLICATION_SUBMITTED",
    title: "HDB Financial Services Application",
    subtitle: "Priced ₹700–₹740 per share • Lot size 20",
    timestamp: "Recent",
    memberName: "Ankit",
    memberAvatar: MOCK_MEMBERS[0].avatar,
    ipoId: "ipo_1786630252147",
    ipoName: "HDB Financial Services",
  },
];

// Utility functions
export function formatINR(amount: number, showSign = false): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  if (showSign && amount > 0) {
    return `+${formatted}`;
  } else if (amount < 0) {
    return `-${formatted}`;
  }
  return formatted;
}

export function maskPAN(pan: string): string {
  if (!pan || pan.length < 10) return "XXXXXXXX41";
  return `XXXXXX${pan.slice(-4)}`;
}

/**
 * Formats any date string into "23 august 26" style.
 * Handles ISO (2026-07-23), natural (22 Aug 2026), etc.
 */
export function formatDate(d?: string | null): string {
  if (!d || !d.trim()) return "—";
  const s = d.trim();

  // Try native Date parse
  const parsed = new Date(s);
  if (!isNaN(parsed.getTime())) {
    const day   = parsed.getUTCDate();
    const month = parsed.toLocaleString("en-US", { month: "long", timeZone: "UTC" }).toLowerCase();
    const year  = String(parsed.getUTCFullYear()).slice(2);
    return `${day} ${month} ${year}`;
  }

  return s;
}
