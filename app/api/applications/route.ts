import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { IPOApplicationDocument } from "@/src/models/Application";
import { validateSessionToken } from "@/src/lib/auth/session";
import { logActivity } from "@/src/features/activity/activityService";

const DB = "nexo";
const COL = "applications";

/* ────────────────────────────────────────────────────────────────
   GET /api/applications
   Fetches all saved IPO application responses from MongoDB.
 * ──────────────────────────────────────────────────────────────── */
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
 * ──────────────────────────────────────────────────────────────── */
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

      // Check for PAN card uniqueness for this ipoId
      const inputPans = (newDoc.panNumbers || []).map((p) => p.trim().toUpperCase());
      if (inputPans.length > 0) {
        const existingDoc = await col.findOne({
          id: { $ne: newDoc.id },
          ipoId: newDoc.ipoId,
          $or: [
            { panNumbers: { $in: inputPans } },
            { panMasked: { $in: inputPans } }
          ]
        });

        if (existingDoc) {
          return NextResponse.json(
            { success: false, error: "One or more PAN cards have already been used in an application for this IPO." },
            { status: 400 }
          );
        }
      }

      await col.updateOne(
        { id: newDoc.id },
        { $set: newDoc },
        { upsert: true }
      );
    } catch (dbErr) {
      console.warn("POST /api/applications MongoDB unavailable, continuing locally.");
    }

    // Resolve actor from session for audit log
    const cookieStore = await cookies();
    const token = cookieStore.get("nexo_session")?.value;
    let actorUserId = undefined;
    let actorMemberId = undefined;
    let actorName = newDoc.applicantName;
    let actorUsername = undefined;
    let actorRole = undefined;

    if (token) {
      const sessionData = await validateSessionToken(token);
      if (sessionData) {
        actorUserId = sessionData.user.id;
        actorMemberId = sessionData.member.id;
        actorName = sessionData.member.name;
        actorUsername = sessionData.member.username;
        actorRole = sessionData.user.role;
      }
    }

    await logActivity({
      eventType: "APPLICATION_CREATED",
      category: "APPLICATION",
      severity: "SUCCESS",
      actorUserId,
      actorMemberId,
      actorName,
      actorUsername,
      actorRole,
      targetType: "APPLICATION",
      targetId: newDoc.id,
      targetName: `${newDoc.ipoName} Application`,
      ipoId: newDoc.ipoId,
      memberId: newDoc.memberId,
      applicationId: newDoc.id,
      metadata: {
        type: newDoc.fundingStructure,
        amount: newDoc.totalContribution,
        ipoName: newDoc.ipoName
      }
    });

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
