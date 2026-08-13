import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSessionToken, revokeSession, SESSION_COOKIE_NAME } from "@/src/lib/auth/session";
import { recordSecurityEvent } from "@/src/lib/auth/security";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (sessionCookie?.value) {
      const validated = await validateSessionToken(sessionCookie.value);
      if (validated) {
        await revokeSession(validated.session.id);
        const role = validated.user.role;
        const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
        await recordSecurityEvent(isAdmin ? "ADMIN_LOGOUT" : "USER_LOGOUT", {
          userId: validated.user.id,
          memberId: validated.member.id,
          memberName: validated.member.name,
          email: validated.user.email,
        });
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });

    response.cookies.delete(SESSION_COOKIE_NAME);

    return response;
  } catch (err: any) {
    console.error("POST /api/auth/logout error:", err);
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}
