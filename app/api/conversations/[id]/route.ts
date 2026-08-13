import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ConversationDocument } from "@/src/models/Conversation";
import { ConversationMemberDocument } from "@/src/models/ConversationMember";
import { MemberDocument } from "@/src/models/Member";

const DB = "nexo";
const COL_CONV = "conversations";
const COL_MEMBERS = "conversationMembers";
const COL_USERS = "members";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const currentMemberId = searchParams.get("memberId") || "mem_1";

    const client = await clientPromise;
    const db = client.db(DB);
    const convCol = db.collection<ConversationDocument>(COL_CONV);
    const memberCol = db.collection<ConversationMemberDocument>(COL_MEMBERS);
    const userCol = db.collection<MemberDocument>(COL_USERS);

    /* 1. Security Check: verify member belongs to this conversation */
    const isMember = await memberCol.findOne({
      conversationId: id,
      memberId: currentMemberId,
    });

    if (!isMember) {
      return NextResponse.json(
        { success: false, error: "Access denied. You are not a member of this conversation." },
        { status: 403 }
      );
    }

    const conversation = await convCol.findOne({ id });
    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 }
      );
    }

    const cMemberships = await memberCol.find({ conversationId: id }).toArray();
    const allUsers = await userCol.find({}).toArray();
    const userMap = new Map(allUsers.map((u) => [u.id, u]));

    const participantMembers = cMemberships
      .map((m) => userMap.get(m.memberId))
      .filter(Boolean);

    let title = conversation.title;
    let avatar = conversation.avatar;
    let otherMember = undefined;

    if (conversation.type === "DIRECT") {
      const other = participantMembers.find((m) => m?.id !== currentMemberId);
      if (other) {
        title = other.name;
        avatar = other.avatar;
        otherMember = other;
      }
    }

    return NextResponse.json({
      success: true,
      conversation: {
        ...conversation,
        title,
        avatar,
        otherMember,
        participants: participantMembers,
      },
    });
  } catch (err: any) {
    console.error("GET /api/conversations/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversation details" },
      { status: 500 }
    );
  }
}
