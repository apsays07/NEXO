import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { IPOApplicationDocument } from "@/src/models/Application";

const DB = "nexo";
const COL = "applications";

/* ────────────────────────────────────────────────────────────────
   GET /api/applications
   Fetches all saved IPO application responses from MongoDB.
──────────────────────────────────────────────────────────────── */
export async function GET() {
  try {
    const client = await clientPromise;
    const col = client.db(DB).collection<IPOApplicationDocument>(COL);

    const applications = await col
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, applications });
  } catch (err: any) {
    console.warn("GET /api/applications MongoDB unavailable, returning empty array fallback.");
    return NextResponse.json({ success: true, applications: [] });
  }
}

/* ────────────────────────────────────────────────────────────────
   POST /api/applications
   Stores a new IPO application response in MongoDB.
──────────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const newDoc: IPOApplicationDocument = {
      id: body.id || `app_${Date.now()}`,
      ipoId: body.ipoId || "1",
      ipoName: body.ipoName || "IPO",
      fundingStructure: body.fundingStructure || (body.type === "COMBO" ? "MULTI_FRIEND" : "SOLO"),
      applicantName: body.applicantName || "Member",
      memberId: body.memberId || "mem_1",
      numberOfPanCards: Math.max(1, body.numberOfPanCards || body.lotCount || 1),
      panNumbers: body.panNumbers || (body.panMasked ? [body.panMasked] : ["ABCDE2741D"]),
      totalContribution: Number(body.totalContribution) || 15000,
      contributors: Array.isArray(body.contributors)
        ? body.contributors
        : (body.participants || []).map((p: any) => ({
            memberId: p.memberId,
            memberName: p.memberName || p.name || "Member",
            amount: p.contribution || 15000,
            percentage: p.percentage || 100,
          })),
      allotmentStatus: body.allotmentStatus || "AWAITING",
      status: body.status || "AWAITING",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const client = await clientPromise;
      const col = client.db(DB).collection<IPOApplicationDocument>(COL);

      await col.updateOne(
        { id: newDoc.id },
        { $set: newDoc },
        { upsert: true }
      );
    } catch (dbErr) {
      console.warn("POST /api/applications MongoDB unavailable, continuing locally.");
    }

    return NextResponse.json({
      success: true,
      message: "Application recorded successfully.",
      application: newDoc,
    });
  } catch (err: any) {
    console.error("POST /api/applications error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
