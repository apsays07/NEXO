import clientPromise from "@/lib/mongodb";
import {
  AuditActivity,
  AuditEventType,
  AuditCategory,
  AuditSeverity,
  LogActivityInput,
  DEFAULT_SEVERITY_MAP,
} from "./types";

const DB_NAME = "nexo";
const COL = "activities";

/**
 * Central activity/audit logging service.
 * Call this from server-side route handlers ONLY.
 * Actor must be resolved from the authenticated session — never from client input.
 * Never logs passwords, password hashes, session tokens, full PAN, or private message bodies.
 */
export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const severity: AuditSeverity =
      input.severity ?? DEFAULT_SEVERITY_MAP[input.eventType] ?? "INFO";

    const doc: AuditActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      eventType: input.eventType,
      category: input.category,
      severity,
      actorUserId: input.actorUserId,
      actorMemberId: input.actorMemberId,
      actorName: input.actorName,
      actorUsername: input.actorUsername,
      actorRole: input.actorRole,
      targetType: input.targetType,
      targetId: input.targetId,
      targetName: input.targetName,
      ipoId: input.ipoId,
      memberId: input.memberId,
      applicationId: input.applicationId,
      conversationId: input.conversationId,
      metadata: input.metadata,
      previousValue: input.previousValue,
      newValue: input.newValue,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      createdAt: new Date(),
    };

    // Strip undefined keys for clean MongoDB documents
    const docAny = doc as unknown as Record<string, unknown>;
    Object.keys(docAny).forEach((k) => {
      if (docAny[k] === undefined) {
        delete docAny[k];
      }
    });

    await db.collection(COL).insertOne(doc as any);
  } catch (err) {
    // Activity logging must NEVER crash the main operation
    console.error("[logActivity] Failed to write audit event:", input.eventType, err);
  }
}

/**
 * Ensure MongoDB indexes for the activities collection exist.
 * Call once on server startup or via a setup script.
 */
export async function ensureActivityIndexes(): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const col = db.collection(COL);

    await col.createIndex({ createdAt: -1 });
    await col.createIndex({ actorMemberId: 1, createdAt: -1 });
    await col.createIndex({ actorUserId: 1 });
    await col.createIndex({ category: 1, createdAt: -1 });
    await col.createIndex({ eventType: 1 });
    await col.createIndex({ severity: 1 });
    await col.createIndex({ targetType: 1, targetId: 1 });
    await col.createIndex({ memberId: 1, createdAt: -1 });
    await col.createIndex({ ipoId: 1, createdAt: -1 });
    await col.createIndex({ applicationId: 1 });
    await col.createIndex({ conversationId: 1 });
  } catch (err) {
    console.error("[ensureActivityIndexes] Failed:", err);
  }
}
