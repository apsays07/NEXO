export type IPOType = "MAINBOARD" | "SME";
export type IPODecision = "WATCH" | "APPLY" | "SKIP";
export type IPOStatus =
  | "RESEARCHING"
  | "WATCHLIST"
  | "APPLYING"
  | "APPLIED"
  | "ALLOTMENT_PENDING"
  | "ALLOTTED"
  | "NOT_ALLOTTED"
  | "LISTED"
  | "HOLDING"
  | "SOLD"
  | "CLOSED";

export type IPOStage =
  | "RESEARCH"
  | "DECISION"
  | "APPLICATION"
  | "ALLOTMENT"
  | "LISTING"
  | "HOLDING"
  | "SOLD";

export interface IPO {
  id: string;
  name: string;
  company: string;
  type: IPOType;
  priceMin: number;
  priceMax: number;
  lotSize: number;
  minimumInvestment: number;
  issueSize?: number;
  openDate?: string;
  closeDate: string;
  allotmentDate?: string;
  listingDate?: string;
  status: IPOStatus;
  decision: IPODecision;
  stage: IPOStage;
  thesis?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export type CreateIPODTO = Omit<
  IPO,
  "id" | "createdAt" | "updatedAt" | "isArchived" | "createdBy"
> & {
  createdBy?: string;
  minimumInvestment?: number;
};

export type UpdateIPODTO = Partial<CreateIPODTO>;
