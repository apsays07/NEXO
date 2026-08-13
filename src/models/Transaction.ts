import { ObjectId } from "mongodb";

/* ─────────────────────────────────────────────────────────────
   TRANSACTION SCHEMA (native MongoDB driver)
   Collection: "transactions"
   Stores every investment transaction and capital contribution in MongoDB.
───────────────────────────────────────────────────────────── */

export interface TransactionDocument {
  _id?: ObjectId;
  id: string;
  ipoId: string;
  ipoName: string;
  type: "SOLO" | "COMBO";
  amount: number;
  applicationNumber: string;
  participants: string[];
  status?: "SUBMITTED" | "ALLOTTED" | "REFUNDED" | "REJECTED" | string;
  createdAt: Date;
}
