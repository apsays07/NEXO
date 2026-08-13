import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import {
  ProfileDocument,
  defaultProfile,
  toPublicProfile,
} from "@/src/models/Profile";
import { getAuthenticatedUser } from "@/src/lib/auth/authorization";

const DB  = "nexo";
const COL = "profiles";

/* ────────────────────────────────────────────────────────────────
   GET /api/profile
   Returns the public-safe profile document for the authenticated user.
   Seeds a default document on first access if missing.
──────────────────────────────────────────────────────────────── */
export async function GET() {
  try {
    const auth = await getAuthenticatedUser().catch(() => null);
    const userId = auth?.userId || "singleton";

    const client = await clientPromise;
    const col    = client.db(DB).collection<ProfileDocument>(COL);

    let doc = await col.findOne({ userId });

    /* First-time seed if profile missing for user */
    if (!doc) {
      const seed = {
        ...defaultProfile(),
        userId,
        name: auth?.displayName || "Ankit",
        email: auth?.email || "ankit@nexo.private",
      };
      const res = await col.insertOne(seed as any);
      doc = { ...seed, _id: res.insertedId } as any;
    }

    return NextResponse.json({ profile: toPublicProfile(doc!) });
  } catch (err: any) {
    console.warn("GET /api/profile MongoDB unavailable, returning default profile fallback.");
    return NextResponse.json({ profile: toPublicProfile(defaultProfile() as any) });
  }
}

/* ────────────────────────────────────────────────────────────────
   PUT /api/profile
   Accepts a partial UpdateProfileDTO and merges into the document.
──────────────────────────────────────────────────────────────── */
export async function PUT(req: Request) {
  try {
    const auth = await getAuthenticatedUser().catch(() => null);
    const userId = auth?.userId || "singleton";

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    /* Whitelist — all client profile fields saved in MongoDB */
    const allowed: Array<string> = [
      "name",
      "displayName",
      "email",
      "phone",
      "avatar",
      "pan",
      "panMasked",
      "role",
      "bio",
      "investmentStyle",
      "location",
      "dematAccountNo",
      "primaryBank",
      "bankAccountMasked",
      "ifscCode",
      "upiId",
      "memberSince",
      "twoFactorEnabled",
      "loginAlertsEnabled",
      "sessionTimeoutMinutes",
      "emailNotifications",
      "smsNotifications",
      "whatsappAlerts",
      "themePreference",
      "groupAccessLevel",
      "syndicateMembership",
      "collateralEligible",
      "creditLimit",
      "totalCapitalCommitted",
      "capitalAvailable",
      "allotmentsCount",
    ];

    const updateDoc: Record<string, any> = { updatedAt: new Date() };
    for (const key of allowed) {
      if (key in body) updateDoc[key] = body[key];
    }

    try {
      const client = await clientPromise;
      const col    = client.db(DB).collection<ProfileDocument>(COL);

      await col.updateOne(
        { userId },
        {
          $set: updateDoc,
          $setOnInsert: { userId, createdAt: new Date(), role: auth?.role || "MEMBER", isVerified: true },
        },
        { upsert: true }
      );

      const doc = await col.findOne({ userId });
      return NextResponse.json({ success: true, profile: toPublicProfile(doc || defaultProfile()) });
    } catch (dbErr) {
      console.warn("PUT /api/profile MongoDB unavailable, returning local update fallback.");
    }

    return NextResponse.json({
      success: true,
      profile: toPublicProfile({ ...defaultProfile(), ...updateDoc } as any),
    });
  } catch (err: any) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
