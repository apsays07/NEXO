import { IPOOpportunity, Member, Application, Transaction, PortfolioSummary } from "@/types/nexo";

export type AdminTab =
  | "dashboard"
  | "ipos"
  | "applications"
  | "allotments"
  | "holdings"
  | "transactions"
  | "members"
  | "messages"
  | "activity"
  | "security"
  | "settings";

export type AdminPriorityLevel = "URGENT" | "PENDING" | "INFO";

export interface AdminPriorityItem {
  id: string;
  level: AdminPriorityLevel;
  title: string;
  subtitle: string;
  ipoId?: string;
  ipoName?: string;
  memberName?: string;
  ctaLabel: string;
  targetTab?: AdminTab;
  actionType: "PROOF" | "ALLOTMENT" | "VERIFICATION" | "PRICE" | "GENERAL";
}

export interface SecurityEvent {
  id: string;
  type: "LOGIN" | "SESSION_REVOKED" | "PASSWORD_CHANGE" | "PERMISSION_CHANGE";
  title: string;
  actor: string;
  ipAddress?: string;
  timestamp: string;
  status: "SUCCESS" | "WARNING" | "ALERT";
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "IPO" | "Member" | "Application" | "Transaction" | "Holding" | "Message";
  targetTab: AdminTab;
  detailId?: string;
}
