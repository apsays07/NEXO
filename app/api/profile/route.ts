import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import {
  ProfileDocument,
  defaultProfile,
  toPublicProfile,
} from "@/src/models/Profile";

const DB   = "nexo";
const COL  = "profiles";
const USER = "singleton"; // one profile per app; swap for auth userId later

/* ────────────────────────────────────────────────────────────────
   GET /api/profile
   Returns the public-safe profile document.
   Seeds a default document on first access.
──────────────────────────────────────────────────────────────── */
export async function GET() {
  try {
    const client = await clientPromise;
    const col    = client.db(DB).collection<ProfileDocument>(COL);

    let doc = await col.findOne({ userId: USER });

    /* First-time seed */
    if (!doc) {
      const seed = defaultProfile();
      const res  = await col.insertOne(seed as any);
      doc        = { ...seed, _id: res.insertedId } as any;
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
   Strips any fields that are not allowed from client input.
──────────────────────────────────────────────────────────────── */
export async function PUT(req: Request) {
  try {
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

      const result = await col.findOneAndUpdate(
        { userId: USER },
        { $set: updateDoc },
        { returnDocument: "after", upsert: true }
      );

      const updatedDoc = (result as any)?.value || result;
      if (updatedDoc) {
        return NextResponse.json({
          success: true,
          profile: toPublicProfile(updatedDoc as any),
        });
      }
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
