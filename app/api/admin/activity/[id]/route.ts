import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { validateSessionToken } from "@/src/lib/auth/session";

const DB_NAME = "nexo";
const SENSITIVE_EVENTS = [
  "PASSWORD_RESET",
  "ROLE_CHANGED",
  "SESSION_REVOKED",
  "ALL_SESSIONS_REVOKED",
  "ADMIN_ACCESS_DENIED",
  "SUPER_ADMIN_ACTION",
  "ACCOUNT_SUSPENDED"
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: activityId } = await params;
    
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
    const activity = await db.collection("activities").findOne({ id: activityId });

    if (!activity) {
      return NextResponse.json({ success: false, error: "Activity not found" }, { status: 404 });
    }

    // Enforce role-based access to sensitive events
    if (!isSuperAdmin && SENSITIVE_EVENTS.includes(activity.eventType)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      activity
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal Server Error" }, { status: 500 });
  }
}