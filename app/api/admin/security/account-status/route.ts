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

    // 1. Counts of accounts by statuses
    const activeCount = await db.collection("users").countDocuments({ status: "ACTIVE" });
    const suspendedCount = await db.collection("users").countDocuments({ status: "SUSPENDED" });
    const disabledCount = await db.collection("users").countDocuments({ status: "DISABLED" });
    const passwordResetRequiredCount = await db.collection("users").countDocuments({ mustChangePassword: true });
    
    // Email verified status comes from user model as well
    const emailUnverifiedCount = await db.collection("users").countDocuments({ emailVerified: false });

    // 2. Fetch details of suspended accounts
    const suspendedUsers = await db.collection("users")
      .find({ status: "SUSPENDED" })
      .toArray();

    const suspendedMemberIds = suspendedUsers.map((u) => u.memberId);
    const suspendedMembers = await db.collection("members")
      .find({ id: { $in: suspendedMemberIds } })
      .toArray();

    const memberMap = new Map(suspendedMembers.map((m) => [m.id, m]));

    const suspendedAccounts = suspendedUsers.map((u) => {
      const m = memberMap.get(u.memberId);
      return {
        id: u.memberId,
        name: m?.name || "Unknown",
        username: m?.username || "unknown",
        avatar: m?.avatar || "/oggy.png",
        role: u.role,
        suspendedAt: u.updatedAt || new Date(),
        reason: "Administrative Action"
      };
    });

    // 3. Fetch accounts requiring password change (limit to 10 for overview list)
    const passwordRequiredUsers = await db.collection("users")
      .find({ mustChangePassword: true })
      .limit(10)
      .toArray();

    const pwdMemberIds = passwordRequiredUsers.map((u) => u.memberId);
    const pwdMembers = await db.collection("members")
      .find({ id: { $in: pwdMemberIds } })
      .toArray();

    const pwdMemberMap = new Map(pwdMembers.map((m) => [m.id, m]));

    const passwordRequiredAccounts = passwordRequiredUsers.map((u) => {
      const m = pwdMemberMap.get(u.memberId);
      return {
        id: u.memberId,
        name: m?.name || "Unknown",
        username: m?.username || "unknown",
        avatar: m?.avatar || "/oggy.png",
        role: u.role
      };
    });

    return NextResponse.json({
      success: true,
      metrics: {
        active: activeCount,
        suspended: suspendedCount,
        disabled: disabledCount,
        passwordChangeRequired: passwordResetRequiredCount,
        emailUnverified: emailUnverifiedCount
      },
      suspendedAccounts,
      passwordRequiredAccounts
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
