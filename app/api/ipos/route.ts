import { NextResponse } from "next/server";
import { getIposCollection, mapDocumentToIPO } from "@/src/features/ipo/data";

const VALID_DECISIONS = ["WATCH", "APPLY", "SKIP"];
const VALID_TYPES = ["MAINBOARD", "SME"];
const VALID_STATUSES = [
  "RESEARCHING",
  "WATCHLIST",
  "APPLYING",
  "APPLIED",
  "ALLOTMENT_PENDING",
  "ALLOTTED",
  "NOT_ALLOTTED",
  "LISTED",
  "HOLDING",
  "SOLD",
  "CLOSED",
];
const VALID_STAGES = [
  "RESEARCH",
  "DECISION",
  "APPLICATION",
  "ALLOTMENT",
  "LISTING",
  "HOLDING",
  "SOLD",
];

export async function GET() {
  try {
    const collection = await getIposCollection();
    const docs = await collection
      .find({ isArchived: { $ne: true } })
      .sort({ updatedAt: -1, _id: -1 })
      .toArray();

    const ipos = docs.map(mapDocumentToIPO);
    return NextResponse.json({ ipos });
  } catch (error: any) {
    console.error("GET /api/ipos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch IPOs from database" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const {
      name,
      company,
      type = "MAINBOARD",
      priceMin,
      priceMax,
      lotSize,
      minimumInvestment,
      issueSize,
      openDate,
      closeDate,
      allotmentDate,
      listingDate,
      status = "APPLYING",
      decision = "APPLY",
      stage = "APPLICATION",
      thesis = "",
      gmpPercent,
      createdBy = "admin",
    } = body;

    // Server-side validation
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "IPO name is required." },
        { status: 400 }
      );
    }
    if (!company || typeof company !== "string" || !company.trim()) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 }
      );
    }
    if (typeof priceMin !== "number" || isNaN(priceMin) || priceMin <= 0) {
      return NextResponse.json(
        { error: "Price minimum must be greater than zero." },
        { status: 400 }
      );
    }
    if (typeof priceMax !== "number" || isNaN(priceMax) || priceMax < priceMin) {
      return NextResponse.json(
        { error: "Price maximum must be greater than or equal to price minimum." },
        { status: 400 }
      );
    }
    if (typeof lotSize !== "number" || isNaN(lotSize) || lotSize <= 0) {
      return NextResponse.json(
        { error: "Lot size must be greater than zero." },
        { status: 400 }
      );
    }
    if (!closeDate || typeof closeDate !== "string" || !closeDate.trim()) {
      return NextResponse.json(
        { error: "Close date is required." },
        { status: 400 }
      );
    }
    if (!VALID_DECISIONS.includes(decision)) {
      return NextResponse.json(
        { error: `Decision must be one of: ${VALID_DECISIONS.join(", ")}` },
        { status: 400 }
      );
    }
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Type must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }
    if (stage && !VALID_STAGES.includes(stage)) {
      return NextResponse.json(
        { error: `Stage must be one of: ${VALID_STAGES.join(", ")}` },
        { status: 400 }
      );
    }

    const calculatedMinInvestment =
      typeof minimumInvestment === "number" && minimumInvestment > 0
        ? minimumInvestment
        : priceMax * lotSize;

    const now = new Date().toISOString();

    const docToInsert = {
      name: name.trim(),
      company: company.trim(),
      type,
      priceMin,
      priceMax,
      lotSize,
      minimumInvestment: calculatedMinInvestment,
      issueSize: typeof issueSize === "number" ? issueSize : undefined,
      openDate: openDate || undefined,
      closeDate: closeDate.trim(),
      allotmentDate: allotmentDate || undefined,
      listingDate: listingDate || undefined,
      status,
      decision,
      stage,
      thesis: typeof thesis === "string" ? thesis.trim() : "",
      gmpPercent: typeof gmpPercent === "number" ? gmpPercent : 18.5,
      createdBy: String(createdBy || "admin"),
      createdAt: now,
      updatedAt: now,
      isArchived: false,
    };

    const collection = await getIposCollection();
    const result = await collection.insertOne(docToInsert);

    const createdDoc = {
      _id: result.insertedId,
      ...docToInsert,
    };

    const ipo = mapDocumentToIPO(createdDoc);
    return NextResponse.json({ success: true, ipo }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/ipos error:", error);
    return NextResponse.json(
      { error: "Failed to create IPO opportunity" },
      { status: 500 }
    );
  }
}
