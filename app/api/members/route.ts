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

      await col.insertMany(seedMembers as any);
      members = await col.find({}).toArray();
    }

    return NextResponse.json({ success: true, members });
  } catch (err: any) {
    console.error("GET /api/members error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch members from MongoDB" },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────────
   POST /api/members
   Creates a new group member with assigned Username & Password.
──────────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const col = client.db(DB).collection<MemberDocument>(COL);

    const name = body.name?.trim() || "New Member";
    const username = (body.username || name.toLowerCase().replace(/\s+/g, "")).trim();
    const password = (body.password || "user123").trim();

    /* Check duplicate username */
    const existing = await col.findOne({ username });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Username "${username}" is already taken. Please choose another.` },
        { status: 400 }
      );
    }

    const newDoc: MemberDocument = {
      id: body.id || `mem_${Date.now()}`,
      name: name,
      username: username,
      password: password,
      email: body.email || `${username}@nexo.private`,
      avatar: body.avatar || "/oggy.png",
      role: body.role === "ADMIN" ? "ADMIN" : "MEMBER",
      panMasked: body.panMasked || body.panFull || "ABCDE1234F",
      panFull: body.panFull || body.panMasked || "ABCDE1234F",
      defaultContribution: Number(body.defaultContribution) || 50000,
      joinedAt: "Just now",
      phone: body.phone,
      upiId: body.upiId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(newDoc as any);

    return NextResponse.json({
      success: true,
      message: `Member ${name} created with assigned credentials (Username: ${username})`,
      insertedId: result.insertedId,
      member: newDoc,
    });
  } catch (err: any) {
    console.error("POST /api/members error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save member to MongoDB" },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────────
   PUT /api/members
   Updates an existing member's credentials or profile details.
──────────────────────────────────────────────────────────────── */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Member id is required for update" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const col = client.db(DB).collection<MemberDocument>(COL);

    const updateFields: Partial<MemberDocument> = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await col.updateOne({ id }, { $set: updateFields });

    return NextResponse.json({
      success: true,
      message: "Member credentials updated in MongoDB",
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (err: any) {
    console.error("PUT /api/members error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update member in MongoDB" },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────────
   DELETE /api/members
   Deletes a member from MongoDB.
──────────────────────────────────────────────────────────────── */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Member id parameter is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const col = client.db(DB).collection<MemberDocument>(COL);

    const result = await col.deleteOne({ id });

    return NextResponse.json({
      success: true,
      message: "Member deleted from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (err: any) {
    console.error("DELETE /api/members error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete member from MongoDB" },
      { status: 500 }
    );
  }
}
