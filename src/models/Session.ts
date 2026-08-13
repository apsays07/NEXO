import { ObjectId } from "mongodb";

/* ─────────────────────────────────────────────────────────────
   SESSION SCHEMA (native MongoDB driver)
   Collection: "sessions"
   Stores active, expired, and revoked user sessions.
───────────────────────────────────────────────────────────── */

export interface SessionDocument {
  _id?: ObjectId;
  id: string;                     // Unique Session ID (e.g. "sess_1001")
  userId: string;                 // Linked User ID (e.g. "usr_1001")
  sessionTokenHash: string;       // SHA-256 hash of raw session token
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;                // Absolute expiration timestamp (30 days)
  lastActiveAt: Date;             // Last activity timestamp for idle refresh
  revokedAt: Date | null;         // Revocation timestamp if revoked (null = active)
  userAgent?: string;
  deviceType?: string;            // "desktop" | "mobile" | "tablet"
  browser?: string;               // E.g. "Chrome", "Safari", "Edge"
  os?: string;                    // E.g. "Windows", "macOS", "iOS", "Android"
  deviceName?: string;            // Normalized label e.g. "Chrome · Windows"
  ipAddress?: string;             // IP address or hint
}
