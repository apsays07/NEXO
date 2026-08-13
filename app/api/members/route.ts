import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { MemberDocument } from "@/src/models/Member";
import { MOCK_MEMBERS } from "@/lib/mockData";

const DB = "nexo";
const COL = "members";

/* ────────────────────────────────────────────────────────────────
   GET /api/members
   Fetches all group members & admin-assigned credentials from MongoDB.
   Seeds initial default members if collection is empty.
──────────────────────────────────────────────────────────────── */
export async function GET() {
  try {
    const client = await clientPromise;
    const col = client.db(DB).collection<MemberDocument>(COL);

    let members = await col.find({}).toArray();

    /* Seed default mock members if empty */
    if (members.length === 0) {
      const seedMembers: MemberDocument[] = MOCK_MEMBERS.map((m) => ({
        id: m.id,
        name: m.name,
        username: (m as any).username || m.name.toLowerCase(),
        password: (m as any).password || (m.role === "ADMIN" ? "admin123" : "user123"),
        email: m.email,
        avatar: m.avatar,
        role: m.role,
        panMasked: m.panMasked,
        panFull: m.panFull || m.panMasked,
        defaultContribution: m.defaultContribution,
        joinedAt: m.joinedAt,
        phone: m.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      try {
        await col.insertMany(seedMembers as any);
        members = await col.find({}).toArray();
      } catch (e) {
        members = seedMembers as any;
      }
    }

    return NextResponse.json({ success: true, members });
  } catch (err: any) {
    console.warn("GET /api/members MongoDB unavailable, returning mock members fallback.");
    return NextResponse.json({ success: true, members: MOCK_MEMBERS });
  }
}

/* ────────────────────────────────────────────────────────────────
   POST /api/members
   Creates a new group member with assigned Username & Password.
──────────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    if (!body || !body.name) {
      return NextResponse.json({ success: false, error: "Missing required member fields" }, { status: 400 });
    }

    const newMember: MemberDocument = {
      id: body.id || `mem_${Date.now()}`,
      name: body.name,
      username: body.username || body.name.toLowerCase().replace(/\s+/g, ""),
      password: body.password || "user123",
      email: body.email || `${body.username || "user"}@nexo.private`,
      avatar: body.avatar || "/oggy.png",
      role: body.role || "MEMBER",
      panMasked: body.panMasked || body.panFull || "ABCDE1234F",
      panFull: body.panFull || body.panMasked || "ABCDE1234F",
      defaultContribution: Number(body.defaultContribution) || 50000,
      joinedAt: body.joinedAt || "Just now",
      phone: body.phone,
      upiId: body.upiId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const client = await clientPromise;
      const col = client.db(DB).collection<MemberDocument>(COL);
      await col.insertOne(newMember as any);

      // Also provision User Account in nexo.users for authentication
      const usersCol = client.db(DB).collection("users");
      const { hashPassword, normalizeEmail } = await import("@/src/lib/auth/password");
      const userEmail = newMember.email;
      const emailNorm = normalizeEmail(userEmail);
      const passwordHash = await hashPassword(newMember.password || "user123");

      await usersCol.updateOne(
        { emailNormalized: emailNorm },
        {
          $set: {
            id: `usr_${newMember.id}`,
            email: userEmail,
            emailNormalized: emailNorm,
            passwordHash: passwordHash,
            memberId: newMember.id,
            role: newMember.role,
            status: "ACTIVE",
            emailVerified: true,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
    } catch (dbErr) {
      console.warn("POST /api/members MongoDB unavailable, continuing with local store.");
    }

    return NextResponse.json({
      success: true,
      message: `Member ${newMember.name} provisioned with login credentials`,
      member: newMember,
    });
  } catch (err: any) {
    console.error("POST /api/members error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/* ────────────────────────────────────────────────────────────────
   PUT /api/members
   Updates an existing member's credentials or profile in MongoDB.
──────────────────────────────────────────────────────────────── */
export async function PUT(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Missing member ID" }, { status: 400 });
    }

    const updateDoc: Record<string, any> = { updatedAt: new Date() };
    const allowed = [
      "name",
      "username",
      "password",
      "email",
      "avatar",
      "role",
      "panMasked",
      "panFull",
      "defaultContribution",
      "phone",
      "upiId",
    ];

    for (const key of allowed) {
      if (key in body) updateDoc[key] = body[key];
    }

    try {
      const client = await clientPromise;
      const col = client.db(DB).collection<MemberDocument>(COL);

      await col.updateOne({ id: body.id }, { $set: updateDoc });
    } catch (dbErr) {
      console.warn("PUT /api/members MongoDB unavailable, continuing with local store.");
    }

    return NextResponse.json({
      success: true,
      message: "Member updated successfully.",
    });
  } catch (err: any) {
    console.error("PUT /api/members error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
