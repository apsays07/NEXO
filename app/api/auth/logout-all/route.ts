import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/src/lib/auth/authorization";
import { revokeAllUserSessions, SESSION_COOKIE_NAME } from "@/src/lib/auth/session";
import { recordSecurityEvent } from "@/src/lib/auth/security";

export async function POST() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const count = await revokeAllUserSessions(auth.userId);

    await recordSecurityEvent("ALL_SESSIONS_REVOKED", {
      userId: auth.userId,
      memberId: auth.memberId,
      memberName: auth.displayName,
      email: auth.email,
    });

    const response = NextResponse.json({
      success: true,
      message: `Signed out of all ${count} active devices.`,
    });

    response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
  } catch (err: any) {
    console.error("POST /api/auth/logout-all error:", err);
    return NextResponse.json({ success: false, error: "Logout all failed" }, { status: 500 });
  }
}
