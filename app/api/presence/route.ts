import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { UserPresenceDocument } from "@/src/models/UserPresence";
import { broadcastRealtimeEvent } from "@/app/api/realtime/route";

const DB = "nexo";
const COL_PRESENCE = "userPresence";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB);
    const col = db.collection<UserPresenceDocument>(COL_PRESENCE);

    const presenceList = await col.find({}).toArray();
    return NextResponse.json({ success: true, presence: presenceList });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to fetch presence" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const memberId = body.memberId || "mem_1";
    const status = body.status || "ONLINE";

    const client = await clientPromise;
    const db = client.db(DB);
    const col = db.collection<UserPresenceDocument>(COL_PRESENCE);

    const now = new Date();
    await col.updateOne(
      { memberId },
      {
        $set: {
          memberId,
          status,
          lastSeenAt: now,
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    broadcastRealtimeEvent("presence:update", { memberId, status, lastSeenAt: now });

    return NextResponse.json({ success: true, memberId, status, lastSeenAt: now });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to update presence" }, { status: 500 });
  }
}
