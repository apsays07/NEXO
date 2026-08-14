import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { validateSessionToken } from "@/src/lib/auth/session";
import { formatActivityDescription, formatCategory } from "@/src/features/activity/formatters";

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

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("nexo_session")?.value;
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const sessionData = await validateSessionToken(token);
    if (!sessionData) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { user } = sessionData;
    const isSuperAdmin = user.role === "SUPER_ADMIN";
    const isAdmin = user.role === "ADMIN";

    if (!isSuperAdmin && !isAdmin) {
      return new Response("Forbidden", { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const eventType = searchParams.get("eventType") || "";
    const severity = searchParams.get("severity") || "";
    const actorId = searchParams.get("actorId") || "";
    const memberId = searchParams.get("memberId") || "";
    const ipoId = searchParams.get("ipoId") || "";
    const applicationId = searchParams.get("applicationId") || "";
    const targetType = searchParams.get("targetType") || "";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";

    const query: any = {};

    // Filter sensitive logs for regular Admin
    if (!isSuperAdmin) {
      query.eventType = { $nin: SENSITIVE_EVENTS };
    }

    if (category && category !== "ALL") query.category = category;
    if (eventType && eventType !== "ALL") query.eventType = eventType;
    if (severity && severity !== "ALL") query.severity = severity;
    
    if (actorId) {
      query.$or = [{ actorUserId: actorId }, { actorMemberId: actorId }];
    }
    
    if (memberId) {
      query.$or = [
        { memberId },
        { actorMemberId: memberId },
        { targetId: memberId }
      ];
    }
    
    if (ipoId) query.ipoId = ipoId;
    if (applicationId) query.applicationId = applicationId;
    if (targetType && targetType !== "ALL") query.targetType = targetType;

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      const searchConditions = [
        { actorName: searchRegex },
        { actorUsername: searchRegex },
        { targetName: searchRegex },
        { eventType: searchRegex },
        { category: searchRegex },
        { "metadata.ipoName": searchRegex },
        { "metadata.applicationName": searchRegex }
      ];
      
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    // Safety limit of 1000 events for CSV export
    const activities = await db
      .collection("activities")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(1000)
      .toArray();

    // Helper to escape values in CSV
    const escapeCSV = (val: string) => {
      const escaped = val.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    // Columns: Timestamp, Actor, Role, Category, Action, Target, Severity
    const headers = ["Timestamp", "Actor", "Role", "Category", "Action", "Target", "Severity"];
    const rows = activities.map((act: any) => {
      const ts = act.createdAt instanceof Date ? act.createdAt.toISOString() : new Date(act.createdAt).toISOString();
      const actorLabel = act.actorName ? `${act.actorName} (@${act.actorUsername || ""})` : "System";
      const roleLabel = act.actorRole || "";
      const catLabel = formatCategory(act.category);
      const actionLabel = formatActivityDescription(act);
      const targetLabel = act.targetName || "";
      const sevLabel = act.severity || "INFO";

      return [
        escapeCSV(ts),
        escapeCSV(actorLabel),
        escapeCSV(roleLabel),
        escapeCSV(catLabel),
        escapeCSV(actionLabel),
        escapeCSV(targetLabel),
        escapeCSV(sevLabel)
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="nexo_activity_export.csv"',
      },
    });

  } catch (err: any) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
