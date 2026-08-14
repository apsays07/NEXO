import { logActivity } from "@/src/features/activity/activityService";
import { AuditEventType } from "@/src/features/activity/types";

export type SecurityEventType =
  | "USER_LOGIN_SUCCESS" | "USER_LOGIN_FAILED" | "USER_LOGOUT"
  | "ADMIN_LOGIN_SUCCESS" | "ADMIN_LOGIN_FAILED" | "ADMIN_LOGOUT"
  | "ADMIN_ACCESS_DENIED"
  | "SESSION_REVOKED" | "ALL_SESSIONS_REVOKED"
  | "PASSWORD_CHANGED" | "ACCOUNT_SUSPENDED";

const SECURITY_TO_AUDIT_EVENT: Record<SecurityEventType, AuditEventType> = {
  USER_LOGIN_SUCCESS:   "LOGIN_SUCCESS",
  USER_LOGIN_FAILED:    "LOGIN_FAILED",
  USER_LOGOUT:          "LOGOUT",
  ADMIN_LOGIN_SUCCESS:  "ADMIN_LOGIN_SUCCESS",
  ADMIN_LOGIN_FAILED:   "ADMIN_LOGIN_FAILED",
  ADMIN_LOGOUT:         "ADMIN_LOGOUT",
  ADMIN_ACCESS_DENIED:  "ADMIN_ACCESS_DENIED",
  SESSION_REVOKED:      "SESSION_REVOKED",
  ALL_SESSIONS_REVOKED: "ALL_SESSIONS_REVOKED",
  PASSWORD_CHANGED:     "PASSWORD_CHANGED",
  ACCOUNT_SUSPENDED:    "ACCOUNT_SUSPENDED",
};

/**
 * Records a security audit event via the unified logActivity() service.
 * NEVER stores passwords, session tokens, or full PAN.
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
  const auditEventType = SECURITY_TO_AUDIT_EVENT[eventType];

  await logActivity({
    eventType: auditEventType,
    category: "SECURITY",
    actorUserId: details.userId,
    actorMemberId: details.memberId,
    actorName: details.memberName || details.email || "Unknown",
    actorRole: details.loginContext === "ADMIN" ? "ADMIN" : "MEMBER",
    ipAddress: details.ipAddress,
    userAgent: details.deviceName,
    metadata: {
      loginContext: details.loginContext,
      deviceName: details.deviceName,
      ...(details.sessionId ? { sessionId: details.sessionId } : {}),
    },
  });
}
