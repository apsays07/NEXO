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
    console.error("GET /api/applications error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications from MongoDB" },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────────
   POST /api/applications
   Stores a new IPO application response in MongoDB.
──────────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const col = client.db(DB).collection<IPOApplicationDocument>(COL);

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

    const result = await col.insertOne(newDoc as any);

    return NextResponse.json({
      success: true,
      message: "Application response saved to MongoDB",
      insertedId: result.insertedId,
      application: newDoc,
    });
  } catch (err: any) {
    console.error("POST /api/applications error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save application response to MongoDB" },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────────
   PUT /api/applications
   Updates an existing IPO application response in MongoDB.
──────────────────────────────────────────────────────────────── */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application id is required for update" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const col = client.db(DB).collection<IPOApplicationDocument>(COL);

    const updateFields: Partial<IPOApplicationDocument> = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await col.updateOne({ id }, { $set: updateFields });

    return NextResponse.json({
      success: true,
      message: "Application updated in MongoDB",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (err: any) {
    console.error("PUT /api/applications error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update application in MongoDB" },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────────
   DELETE /api/applications
   Deletes an application response from MongoDB.
──────────────────────────────────────────────────────────────── */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application id parameter is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const col = client.db(DB).collection<IPOApplicationDocument>(COL);

    const result = await col.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: "Application deleted from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (err: any) {
    console.error("DELETE /api/applications error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete application from MongoDB" },
      { status: 500 }
    );
  }
}
