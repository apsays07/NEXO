import { ObjectId } from "mongodb";

/* ─────────────────────────────────────────────────────────────
   IPO APPLICATION RESPONSE SCHEMA (native MongoDB driver)
   Collection: "applications"
   Stores every IPO application submission, funding structure,
   contributors pool, and PAN details in MongoDB.
───────────────────────────────────────────────────────────── */

export interface ContributorDetail {
  memberId?: string;
  memberName: string;
  amount: number;
  percentage: number;
}

export interface IPOApplicationDocument {
  _id?: ObjectId;
  id: string;                                    // Unique Application ID (e.g. "app_1786570923000")
  ipoId: string;                                 // Targeted IPO ID (e.g. "1" or "ipo_vertex")
  ipoName?: string;                              // IPO Name (e.g. "Vertex Finance")
  fundingStructure: "SOLO" | "MULTI_FRIEND";     // Capital Funding Structure (Solo vs Multi-Friend)
  applicantName: string;                         // Primary Applicant Name (e.g. "Ankittgod")
  memberId?: string;                             // Submitting User/Member ID
  numberOfPanCards: number;                      // Number of PAN Cards / Lots (e.g. 1)
  panNumbers: string[];                          // Array of entered PAN Card numbers (e.g. ["HSCPP7066Q"])
  totalContribution: number;                    // Total Pooled Capital in ₹ (e.g. 15000)
  contributors: ContributorDetail[];             // Capital Allocation Pool Breakdown
  allotmentStatus: "AWAITING" | "ALLOTTED" | "NOT_ALLOTTED";
  status: "SUBMITTED" | "VERIFIED" | "ALLOTTED" | "REFUNDED" | "AWAITING";
  createdAt: Date;
  updatedAt: Date;
}
