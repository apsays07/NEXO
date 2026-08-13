import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/src/lib/auth/authorization";
import { getUserSessions, revokeAllOtherSessions } from "@/src/lib/auth/session";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const sessions = await getUserSessions(auth.userId, auth.session.id);

    return NextResponse.json({
      success: true,
      sessions: sessions.map((s) => ({
        id: s.id,
        deviceName: s.deviceName || "Web Client",
        browser: s.browser || "Browser",
        os: s.os || "OS",
        deviceType: s.deviceType || "desktop",
        lastActiveAt: s.lastActiveAt,
        createdAt: s.createdAt,
        isCurrent: s.isCurrent,
        ipAddress: s.ipAddress || "Verified IP",
      })),
    });
  } catch (err: any) {
    console.error("GET /api/auth/sessions error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch active sessions" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const count = await revokeAllOtherSessions(auth.userId, auth.session.id);

    return NextResponse.json({
      success: true,
      message: `Successfully signed out of ${count} other device(s).`,
      revokedCount: count,
    });
  } catch (err: any) {
    console.error("POST /api/auth/sessions (revoke others) error:", err);
    return NextResponse.json({ success: false, error: "Failed to revoke other sessions" }, { status: 500 });
  }
}
