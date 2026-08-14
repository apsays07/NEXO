import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { validateSessionToken, hashSessionToken } from "@/src/lib/auth/session";

const DB_NAME = "nexo";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("nexo_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = await validateSessionToken(token);
    if (!sessionData) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { user, session: currentSession } = sessionData;
    const isSuperAdmin = user.role === "SUPER_ADMIN";
    const isAdmin = user.role === "ADMIN";

    if (!isSuperAdmin && !isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get("role") || "ALL"; // ALL, SUPER_ADMIN, ADMIN, MEMBER
    const statusFilter = searchParams.get("status") || "ACTIVE"; // ACTIVE, ALL, REVOKED
    const deviceFilter = searchParams.get("device") || "ALL"; // ALL, desktop, mobile, tablet

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const now = new Date();

    const query: any = {};

    // Filters for status
    if (statusFilter === "ACTIVE") {
      query.revokedAt = null;
      query.expiresAt = { $gt: now };
    } else if (statusFilter === "REVOKED") {
      query.revokedAt = { $ne: null };
    }

    // Filter by Device Type
    if (deviceFilter && deviceFilter !== "ALL") {
      query.deviceType = deviceFilter.toLowerCase();
    }

    // Query active/matching sessions
    const sessions = await db.collection("sessions")
      .find(query)
      .sort({ lastActiveAt: -1 })
      .toArray();

    // Fetch members and users to map info
    const sessionUserIds = sessions.map((s) => s.userId);
    const usersList = await db.collection("users")
      .find({ id: { $in: sessionUserIds } })
      .toArray();

    const memberIds = usersList.map((u) => u.memberId);
    const membersList = await db.collection("members")
      .find({ id: { $in: memberIds } })
      .toArray();

    const userMap = new Map(usersList.map((u) => [u.id, u]));
    const memberMap = new Map(membersList.map((m) => [m.id, m]));

    // Map sessions to final structures
    let result = sessions.map((sess) => {
      const u = userMap.get(sess.userId);
      const m = u ? memberMap.get(u.memberId) : null;
      
      const isCurrent = sess.sessionTokenHash === currentSession.sessionTokenHash;

      return {
        id: sess.id,
        userId: sess.userId,
        memberId: u?.memberId || "",
        memberName: m?.name || "Unknown",
        username: m?.username || "unknown",
        avatar: m?.avatar || "/oggy.png",
        role: u?.role || "MEMBER",
        deviceType: sess.deviceType || "desktop",
        browser: sess.browser || "Chrome",
        os: sess.os || "Windows",
        deviceName: sess.deviceName || "Chrome · Windows",
        ipAddress: sess.ipAddress || "127.0.0.1",
        createdAt: sess.createdAt,
        lastActiveAt: sess.lastActiveAt,
        expiresAt: sess.expiresAt,
        status: sess.revokedAt ? "REVOKED" : new Date(sess.expiresAt) < now ? "EXPIRED" : "ACTIVE",
        isCurrent
      };
    });

    // Filter by Role on mapped items
    if (roleFilter && roleFilter !== "ALL") {
      result = result.filter((r) => r.role === roleFilter);
    }

    return NextResponse.json({
      success: true,
      sessions: result
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
