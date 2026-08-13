import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/src/lib/auth/authorization";
import { revokeSession } from "@/src/lib/auth/session";
import { recordSecurityEvent } from "@/src/lib/auth/security";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const { id: sessionId } = await params;
    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID required" }, { status: 400 });
    }

    const success = await revokeSession(sessionId);
    if (success) {
      await recordSecurityEvent("SESSION_REVOKED", {
        userId: auth.userId,
        memberId: auth.memberId,
        memberName: auth.displayName,
        email: auth.email,
      });
    }

    return NextResponse.json({
      success,
      message: success ? "Session revoked successfully" : "Session not found or already revoked",
    });
  } catch (err: any) {
    console.error("DELETE /api/auth/sessions/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to revoke session" }, { status: 500 });
  }
}
