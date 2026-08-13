import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { IPO } from "./types";

export const DB_NAME = "nexo";
export const COLLECTION_NAME = "ipos";

export async function getIposCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION_NAME);

  // Create practical indexes if needed
  try {
    await collection.createIndex({ isArchived: 1, updatedAt: -1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ decision: 1 });
  } catch (_e) {
    // Indexes exist or collection locked
  }

  return collection;
}

export function mapDocumentToIPO(doc: any): IPO {
  const { _id, ...rest } = doc;
  const idStr = _id instanceof ObjectId ? _id.toString() : String(_id);

  return {
    id: idStr,
    name: rest.name || "",
    company: rest.company || "",
    type: rest.type || "MAINBOARD",
    priceMin: Number(rest.priceMin) || 0,
    priceMax: Number(rest.priceMax) || 0,
    lotSize: Number(rest.lotSize) || 0,
    minimumInvestment:
      Number(rest.minimumInvestment) ||
      (Number(rest.priceMax) * Number(rest.lotSize)) ||
      0,
    issueSize: rest.issueSize !== undefined ? Number(rest.issueSize) : undefined,
    openDate: rest.openDate || undefined,
    closeDate: rest.closeDate || "",
    allotmentDate: rest.allotmentDate || undefined,
    listingDate: rest.listingDate || undefined,
    status: rest.status || "APPLYING",
    decision: rest.decision || "APPLY",
    stage: rest.stage || "APPLICATION",
    thesis: rest.thesis || "",
    gmpPercent: rest.gmpPercent !== undefined ? Number(rest.gmpPercent) : 18.5,
    createdBy: rest.createdBy || "admin",
    createdAt: rest.createdAt || new Date().toISOString(),
    updatedAt: rest.updatedAt || new Date().toISOString(),
    isArchived: Boolean(rest.isArchived),
  };
}

export function mapIPOToOpportunity(ipo: IPO, existingApps: any[] = []): any {
  const isSME = ipo.type === "SME";
  const formattedIssueSize = ipo.issueSize ? `₹${ipo.issueSize} Cr` : "—";

  const rec =
    ipo.decision === "WATCH" ? "WATCH" : ipo.decision === "SKIP" ? "AVOID" : "APPLY";

  let formattedDate = "12 Aug 2026";
  try {
    if (ipo.createdAt) {
      formattedDate = new Date(ipo.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  } catch (_e) {}

  const gmpVal = ipo.gmpPercent !== undefined ? ipo.gmpPercent : 18.5;

  return {
    id: ipo.id,
    name: ipo.name,
    company: ipo.company,
    logo: ipo.name ? ipo.name.substring(0, 2).toUpperCase() : "IPO",
    category: isSME ? "SME" : "Mainboard",
    status: ipo.status || "APPLYING",
    recommendation: rec,
    thesis: ipo.thesis || "Strong operating profile and growth prospects.",
    decisionDate: formattedDate,
    decisionBy: ipo.createdBy || "admin",
    metrics: {
      issueSize: formattedIssueSize,
      priceBand: { min: ipo.priceMin, max: ipo.priceMax },
      lotSize: ipo.lotSize,
      minInvestment: ipo.minimumInvestment || ipo.priceMax * ipo.lotSize,
      openDate: ipo.openDate || "12 Aug 2026",
      closeDate: ipo.closeDate || "14 Aug 2026",
      allotmentDate: ipo.allotmentDate || "19 Aug 2026",
      listingDate: ipo.listingDate || "21 Aug 2026",
      gmpPercent: gmpVal,
    },
    applications: existingApps,
    history: [
      {
        stage: "RESEARCH",
        date: formattedDate,
        author: ipo.createdBy || "admin",
        note: "Initial research and prospectus review.",
      },
    ],
    isFeatured: true,
  };
}
