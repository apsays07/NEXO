import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { validateSessionToken } from "@/src/lib/auth/session";

const DB_NAME = "nexo";

export async function GET() {
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

    const { user } = sessionData;
    const isSuperAdmin = user.role === "SUPER_ADMIN";
    const isAdmin = user.role === "ADMIN";

    if (!isSuperAdmin && !isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const now = new Date();

    // 1. Calculate Active Sessions Count
    const activeSessionsCount = await db.collection("sessions").countDocuments({
      revokedAt: null,
      expiresAt: { $gt: now }
    });

    // 2. Count roles from users collection
    const activeAdminsCount = await db.collection("users").countDocuments({
      role: "ADMIN",
      status: "ACTIVE"
    });

    const activeMembersCount = await db.collection("users").countDocuments({
      role: "MEMBER",
      status: "ACTIVE"
    });

    const suspendedAccountsCount = await db.collection("users").countDocuments({
      status: "SUSPENDED"
    });

    const passwordChangesCount = await db.collection("users").countDocuments({
      mustChangePassword: true
    });

    // 3. Count logins and security events today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const loginsTodayCount = await db.collection("activities").countDocuments({
      eventType: { $in: ["LOGIN_SUCCESS", "ADMIN_LOGIN_SUCCESS"] },
      createdAt: { $gte: startOfToday }
    });

    const failedLoginsTodayCount = await db.collection("activities").countDocuments({
      eventType: { $in: ["LOGIN_FAILED", "ADMIN_LOGIN_FAILED"] },
      createdAt: { $gte: startOfToday }
    });

    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentSecurityEventsCount = await db.collection("activities").countDocuments({
      category: "SECURITY",
      createdAt: { $gte: oneDayAgo }
    });

    // 4. Generate Security Alerts (Requires Attention)
    const alerts: Array<{ id: string; severity: "WARNING" | "CRITICAL" | "INFO"; title: string; desc: string }> = [];

    // Alert: Elevated Login Failures (5+ failures in the last 24h)
    if (failedLoginsTodayCount >= 5) {
      alerts.push({
        id: "elevated_login_failures",
        severity: "WARNING",
        title: "Elevated failed-login activity",
        desc: `${failedLoginsTodayCount} failed sign-in attempts detected on the platform today.`
      });
    }

    // Alert: Suspended Admins
    const suspendedAdminsCount = await db.collection("users").countDocuments({
      role: { $in: ["ADMIN", "SUPER_ADMIN"] },
      status: "SUSPENDED"
    });
    if (suspendedAdminsCount > 0) {
      alerts.push({
        id: "suspended_admins",
        severity: "CRITICAL",
        title: "Suspended admin accounts",
        desc: `There are ${suspendedAdminsCount} suspended administrator accounts requiring review.`
      });
    }

    // Alert: Outstanding Password Changes
    if (passwordChangesCount > 0) {
      alerts.push({
        id: "outstanding_passwords",
        severity: "INFO",
        title: "Password reset active",
        desc: `${passwordChangesCount} account(s) require a password change on next login.`
      });
    }

    return NextResponse.json({
      success: true,
      summary: {
        activeSessions: activeSessionsCount,
        activeAdmins: activeAdminsCount,
        activeMembers: activeMembersCount,
        loginsToday: loginsTodayCount,
        failedLogins: failedLoginsTodayCount,
        suspendedAccounts: suspendedAccountsCount,
        passwordChangesRequired: passwordChangesCount,
        recentSecurityEvents: recentSecurityEventsCount,
        alerts
      }
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
