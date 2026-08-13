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
    console.error("GET /api/profile:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
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
      "demat",
      "preferences",
      "individualSavings",
      "userContributions",
    ];

    const updateFields: Record<string, any> = { updatedAt: new Date() };
    for (const key of allowed) {
      if (key in body) {
        updateFields[key] = body[key];
      }
    }

    /* Derive panMasked from raw PAN if caller sends `pan` (optional) */
    if (typeof body.pan === "string" && body.pan.trim().length === 10) {
      const raw = body.pan.trim().toUpperCase();
      updateFields.pan       = raw;          // stored encrypted-at-rest (MongoDB)
      updateFields.panMasked = `XXXXX${raw.slice(5)}`; // safe for client
    }

    const client = await clientPromise;
    const col    = client.db(DB).collection<ProfileDocument>(COL);

    await col.updateOne(
      { userId: USER },
      {
        $set:         updateFields,
        $setOnInsert: { userId: USER, createdAt: new Date(), role: "ADMIN", isVerified: true },
      },
      { upsert: true }
    );

    const doc = await col.findOne({ userId: USER });
    return NextResponse.json({ success: true, profile: toPublicProfile(doc!) });
  } catch (err: any) {
    console.error("PUT /api/profile:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
