export type IPOLifecycleStage =
  | "RESEARCHING"
  | "WATCHLIST"
  | "APPLYING"
  | "APPLICATION_OPEN"
  | "APPLIED"
  | "ALLOTMENT_PENDING"
  | "ALLOTTED"
  | "NOT_ALLOTTED"
  | "LISTED"
  | "HOLDING"
  | "SOLD"
  | "CLOSED";

export type RecommendationType = "APPLY" | "WATCH" | "SKIP";

export type ParticipationType = "SOLO" | "COMBO";

export type MemberRole = "ADMIN" | "MEMBER";

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: MemberRole;
  panMasked: string;
  panFull: string;
  defaultContribution: number;
  joinedAt: string;
  phone?: string;
  upiId?: string;
}

export interface ApplicationParticipant {
  memberId: string;
  memberName: string;
  avatar: string;
  contribution: number;
  percentage: number;
  panMasked: string;
  panFull?: string;
  proofUrl?: string;
  proofUploadedAt?: string;
  status: "PENDING" | "SUBMITTED" | "ALLOTTED" | "NOT_ALLOTTED" | "REFUNDED";
  allotmentShares?: number;
  refundAmount?: number;
  profitLoss?: number;
  profitLossPercent?: number;
}

export interface Application {
  id: string;
  ipoId: string;
  type: ParticipationType;
  totalContribution: number;
  status: "DRAFT" | "SUBMITTED" | "VERIFIED" | "ALLOTTED" | "REFUNDED";
  createdAt: string;
  participants: ApplicationParticipant[];
  applicationProofUrl?: string;
  applicationNumber?: string;
}

export interface FinancialMetrics {
  issueSize: string; // e.g. "₹1,400 Cr"
  priceBand: { min: number; max: number };
  lotSize: number;
  minInvestment: number;
  openDate: string;
  closeDate: string;
  allotmentDate: string;
  listingDate: string;
  retailQuotaPercent?: number;
  gmp?: number; // Grey Market Premium in ₹
  gmpPercent?: number;
}

export interface IPOOpportunity {
  id: string;
  name: string;
  company: string;
  logo: string;
  category?: "Mainboard" | "SME";
  status: IPOLifecycleStage;
  recommendation: RecommendationType;
  thesis: string;
  metrics: FinancialMetrics;
  createdBy: string;
  participantsCount: number;
  combinedCapital: number;
  applications: Application[];
  issuePrice?: number;
  currentPrice?: number;
  listingGainPercent?: number;
  realizedProfit?: number;
  tags?: string[];
  isFeatured?: boolean;
  closeCountdown?: string;
}

export interface PortfolioSummary {
  totalCapital: number;
  capitalDeployed: number;
  currentlyBlocked: number;
  availableCapital: number;
  totalReturn: number;
  totalReturnPercent: number;
  realizedPnL: number;
  unrealizedPnL: number;
  activeOpportunitiesCount: number;
  allotmentSuccessRatePercent: number;
  allocation: {
    availablePercent: number;
    blockedPercent: number;
    investedPercent: number;
  };
}

export interface ActivityItem {
  id: string;
  type:
    | "IPO_ADDED"
    | "APPLICATION_SUBMITTED"
    | "PROOF_UPLOADED"
    | "ALLOTMENT_DECLARED"
    | "LISTING_RECORDED"
    | "RECOMMENDATION_UPDATED";
  title: string;
  subtitle: string;
  timestamp: string;
  memberName: string;
  memberAvatar: string;
  ipoId?: string;
  ipoName?: string;
}

export interface ActionItem {
  id: string;
  type: "PROOF_MISSING" | "ALLOTMENT_PENDING" | "CONTRIBUTION_INCOMPLETE";
  title: string;
  subtitle: string;
  ipoId: string;
  ipoName: string;
  ctaLabel: string;
  memberName?: string;
  memberAvatar?: string;
}

export interface Transaction {
  id: string;
  ipoId: string;
  ipoName: string;
  type: "SOLO" | "COMBO";
  amount: number;
  applicationNumber: string;
  participants: string[]; // member names
  createdAt: string; // ISO string
  status: "SUBMITTED" | "ALLOTTED" | "REFUNDED" | "REJECTED";
}
