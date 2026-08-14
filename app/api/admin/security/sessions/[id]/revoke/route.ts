import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { validateSessionToken } from "@/src/lib/auth/session";
import { logActivity } from "@/src/features/activity/activityService";

const DB_NAME = "nexo";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get("nexo_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = await validateSessionToken(token);
    if (!sessionData) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { user: currentUser, session: currentSession, member: currentMember } = sessionData;

    // Only SUPER_ADMIN can revoke sessions dynamically
    if (currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden. Super Admin access required." }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Fetch the target session
    const targetSession = await db.collection("sessions").findOne({ id: sessionId });
    if (!targetSession) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    if (targetSession.revokedAt !== null) {
      return NextResponse.json({ success: false, error: "Session is already revoked" }, { status: 400 });
    }

    // Safety: prevent immediate self-revocation without confirmation
    const isSelfRevoke = targetSession.sessionTokenHash === currentSession.sessionTokenHash;
    if (isSelfRevoke) {
      // In the API, we allow it, but frontend should confirm. Let's process it.
    }

    const now = new Date();

    // Revoke the session
    await db.collection("sessions").updateOne(
      { id: sessionId },
      { $set: { revokedAt: now, updatedAt: now } }
    );

    // Fetch target user/member details for audit log
    const targetUser = await db.collection("users").findOne({ id: targetSession.userId });
    const targetMember = targetUser 
      ? await db.collection("members").findOne({ id: targetUser.memberId })
      : null;

    // Log the revocation event
    await logActivity({
      eventType: "SESSION_REVOKED",
      category: "SECURITY",
      severity: "WARNING",
      actorUserId: currentUser.id,
      actorMemberId: currentMember.id,
      actorName: currentMember.name,
      actorUsername: currentMember.username,
      actorRole: currentUser.role,
      targetType: "MEMBER",
      targetId: targetUser?.memberId || "",
      targetName: targetMember?.name || "Unknown User",
      metadata: {
        sessionId,
        deviceName: targetSession.deviceName || "Unknown Device",
        ipAddress: targetSession.ipAddress
      }
    });

    return NextResponse.json({
      success: true,
      message: "Session successfully revoked"
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
