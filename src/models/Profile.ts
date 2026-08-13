import { ObjectId } from "mongodb";

/* ─────────────────────────────────────────
   PROFILE SCHEMA (native MongoDB driver)
   Collection: "profiles"
   One document per user (singleton for now,
   keyed by userId when auth is added).
───────────────────────────────────────── */

import { MemberRole } from "@/types/nexo";

export interface ProfileDocument {
  _id?: ObjectId;

  /* ── Identity ── */
  userId?: string;           // future: linked to auth user id
  name: string;              // full legal name
  displayName: string;       // shown in UI
  email?: string;            // optional
  phone?: string;            // optional
  avatar?: string;           // URL (uploaded to /public/uploads or CDN)

  /* ── Role & Access ── */
  role: MemberRole;
  isVerified: boolean;

  /* ── Private Credentials ── */
  pan?: string;              // plain PAN — never expose to client
  panMasked?: string;        // e.g. "XXXXX2741D" — safe to send
  demat?: {
    broker?: string;         // e.g. "Zerodha"
    accountNumber?: string;  // masked on client
  };

  /* ── Preferences ── */
  preferences?: {
    theme?: "light" | "dark" | "system";
    currency?: string;       // e.g. "INR"
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };

  /* ── Security ── */
  security?: {
    lastPasswordChange?: Date;
    twoFactorEnabled?: boolean;
    activeSessionsCount?: number;
  };

  /* ── Timestamps ── */
  createdAt: Date;
  updatedAt: Date;
}

/* ─────────────────────────────────────────
   DEFAULT DOCUMENT — used for upsert seed
───────────────────────────────────────── */
export function defaultProfile(): Omit<ProfileDocument, "_id"> {
  const now = new Date();
  return {
    userId: "singleton",
    name: "",
    displayName: "",
    email: "",
    phone: "",
    avatar: "",
    role: "ADMIN",
    isVerified: true,
    pan: "",
    panMasked: "",
    demat: {
      broker: "",
      accountNumber: "",
    },
    preferences: {
      theme: "dark",
      currency: "INR",
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
    },
    security: {
      twoFactorEnabled: false,
      activeSessionsCount: 1,
    },
    createdAt: now,
    updatedAt: now,
  };
}

/* ─────────────────────────────────────────
   SAFE PUBLIC PROFILE
   Strip private fields before sending to client
───────────────────────────────────────── */
export function toPublicProfile(doc: ProfileDocument) {
  const {
    pan,                   // ← never expose raw PAN
    demat,                 // ← strip raw demat
    userId,                // ← internal
    ...safe
  } = doc as any;

  return {
    ...safe,
    _id: doc._id?.toString(),
    // expose masked demat broker only
    dematBroker: doc.demat?.broker ?? null,
  };
}
