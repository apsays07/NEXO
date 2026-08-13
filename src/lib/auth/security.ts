import clientPromise from "@/lib/mongodb";
import { ActivityItem } from "@/types/nexo";

const DB_NAME = "nexo";

export type SecurityEventType =
  // User (member) auth events
  | "USER_LOGIN_SUCCESS"
  | "USER_LOGIN_FAILED"
  | "USER_LOGOUT"
  // Admin auth events
  | "ADMIN_LOGIN_SUCCESS"
  | "ADMIN_LOGIN_FAILED"
  | "ADMIN_LOGOUT"
  | "ADMIN_ACCESS_DENIED"
  // Session events
  | "SESSION_REVOKED"
  | "ALL_SESSIONS_REVOKED"
  // Account events
  | "PASSWORD_CHANGED"
  | "ACCOUNT_SUSPENDED";

/**
 * Records an immutable security audit log entry in MongoDB nexo.activities.
 * NEVER logs passwords or raw session tokens.
 */
export async function recordSecurityEvent(
  eventType: SecurityEventType,
  details: {
    userId?: string;
    memberId?: string;
    memberName?: string;
    email?: string;
    ipAddress?: string;
    deviceName?: string;
    loginContext?: "USER" | "ADMIN";
    sessionId?: string;
  }
): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const titleMap: Record<SecurityEventType, string> = {
      USER_LOGIN_SUCCESS:    `Member signed in — ${details.memberName || details.email || "User"}`,
      USER_LOGIN_FAILED:     `Failed member sign-in attempt — ${details.email || "Unknown"}`,
      USER_LOGOUT:           `Member signed out — ${details.memberName || "User"}`,
      ADMIN_LOGIN_SUCCESS:   `Admin signed in — ${details.memberName || details.email || "Admin"}`,
      ADMIN_LOGIN_FAILED:    `Failed admin sign-in attempt — ${details.email || "Unknown"}`,
      ADMIN_LOGOUT:          `Admin signed out — ${details.memberName || "Admin"}`,
      ADMIN_ACCESS_DENIED:   `Admin access denied — ${details.email || "Account"} (insufficient role)`,
      SESSION_REVOKED:       `Session revoked — ${details.memberName || "User"}`,
      ALL_SESSIONS_REVOKED:  `All other sessions revoked — ${details.memberName || "User"}`,
      PASSWORD_CHANGED:      `Password updated — ${details.memberName || "User"}`,
      ACCOUNT_SUSPENDED:     `Account suspended — ${details.email || "Account"}`,
    };

    const newActivity: ActivityItem & {
      isSecurityEvent: boolean;
      userId?: string;
      loginContext?: string;
      sessionId?: string;
      eventType: string;
    } = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: "STATUS_CHANGED" as any,
      title: titleMap[eventType],
      subtitle: `${details.deviceName || "Web Client"} · ${details.ipAddress || "Unknown IP"}`,
      timestamp: new Date().toISOString(),
      memberName: details.memberName || details.email || "System",
      memberAvatar: "/oggy.png",
      isSecurityEvent: true,
      eventType,
      userId: details.userId,
      loginContext: details.loginContext,
      sessionId: details.sessionId,
    };

    await db.collection("activities").insertOne(newActivity);
  } catch (err) {
    // Security logging must never crash the main auth flow
    console.error("Security audit log failed:", err);
  }
}
