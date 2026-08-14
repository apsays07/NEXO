import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ConversationDocument } from "@/src/models/Conversation";
import { ConversationMemberDocument } from "@/src/models/ConversationMember";
import { MessageDocument } from "@/src/models/Message";
import { MemberDocument } from "@/src/models/Member";
import { broadcastRealtimeEvent } from "@/app/api/realtime/route";

const DB = "nexo";
const COL_CONV = "conversations";
const COL_MEMBERS = "conversationMembers";
const COL_MSG = "messages";
const COL_USERS = "members";

/* ────────────────────────────────────────────────────────────────
   GET /api/conversations
   Fetches all conversations for a member sorted by lastMessageAt DESC.
──────────────────────────────────────────────────────────────── */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const currentMemberId = searchParams.get("memberId") || "mem_1";

    const client = await clientPromise;
    const db = client.db(DB);
    const convCol = db.collection<ConversationDocument>(COL_CONV);
    const memberCol = db.collection<ConversationMemberDocument>(COL_MEMBERS);
    const msgCol = db.collection<MessageDocument>(COL_MSG);
    const userCol = db.collection<MemberDocument>(COL_USERS);

    let myMemberships = await memberCol.find({ memberId: currentMemberId }).toArray();

    /* Seed initial mock conversations if database is empty */
    if (myMemberships.length === 0) {
      await seedDefaultConversations(db);
      myMemberships = await memberCol.find({ memberId: currentMemberId }).toArray();
    }

    const convIds = myMemberships.map((m) => m.conversationId);
    const conversations = await convCol
      .find({ id: { $in: convIds } })
      .sort({ lastMessageAt: -1 })
      .toArray();

    const allUsers = await userCol.find({}).toArray();
    const userMap = new Map(allUsers.map((u) => [u.id, u]));

    /* Enrich conversations with membership details, unread counts & recipient profiles */
    const enriched = await Promise.all(
      conversations.map(async (c) => {
        const myMembership = myMemberships.find((m) => m.conversationId === c.id);
        const lastReadAt = myMembership?.lastReadAt
          ? new Date(myMembership.lastReadAt)
          : new Date(0);

        // Count unread messages created after lastReadAt (excluding own messages)
        const unreadCount = await msgCol.countDocuments({
          conversationId: c.id,
          senderId: { $ne: currentMemberId },
          createdAt: { $gt: lastReadAt },
        });

        // Get all members of this conversation
        const cMemberships = await memberCol.find({ conversationId: c.id }).toArray();
        const participantMembers = cMemberships
          .map((m) => userMap.get(m.memberId))
          .filter(Boolean);

        let title = c.title;
        let avatar = c.avatar;
        let otherMember = undefined;

        if (c.type === "DIRECT") {
          const other = participantMembers.find((m) => m?.id !== currentMemberId);
          if (other) {
            title = other.name;
            avatar = other.avatar;
            otherMember = other;
          }
        }

        return {
          ...c,
          title,
          avatar,
          unreadCount,
          otherMember,
          participants: participantMembers,
        };
      })
    );

    // Deduplicate conversations by conversation ID
    const uniqueMap = new Map<string, (typeof enriched)[0]>();
    for (const c of enriched) {
      if (c && c.id && !uniqueMap.has(c.id)) {
        uniqueMap.set(c.id, c);
      }
    }
    const uniqueConversations = Array.from(uniqueMap.values());

    return NextResponse.json({ success: true, conversations: uniqueConversations });
  } catch (err: any) {
    console.error("GET /api/conversations error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────────
   POST /api/conversations
   Creates a new DIRECT, GROUP, or IPO conversation.
   Prevents duplicate DIRECT conversations using a deterministic directKey.
──────────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentMemberId = body.currentMemberId || body.createdBy || "mem_1";
    const targetMemberId = body.targetMemberId;
    const type = body.type || (targetMemberId ? "DIRECT" : "GROUP");
    const ipoId = body.ipoId;
    const title = body.title || "Group Chat";

    const client = await clientPromise;
    const db = client.db(DB);
    const convCol = db.collection<ConversationDocument>(COL_CONV);
    const memberCol = db.collection<ConversationMemberDocument>(COL_MEMBERS);
    const userCol = db.collection<MemberDocument>(COL_USERS);

    /* 1. Check existing DIRECT conversation */
    if (type === "DIRECT" && targetMemberId) {
      const pair = [currentMemberId, targetMemberId].sort();
      const directKey = `${pair[0]}_${pair[1]}`;

      const existingDirect = await convCol.findOne({ directKey });
      if (existingDirect) {
        return NextResponse.json({
          success: true,
          isExisting: true,
          conversation: existingDirect,
        });
      }

      const convId = `conv_dir_${Date.now()}`;
      const now = new Date();

      const newConv: ConversationDocument = {
        id: convId,
        type: "DIRECT",
        title: "",
        createdBy: currentMemberId,
        directKey,
        lastMessage: "Start a conversation",
        lastMessageAt: now,
        createdAt: now,
        updatedAt: now,
      };

      await convCol.insertOne(newConv as any);

      await memberCol.insertMany([
        {
          id: `cm_${convId}_${currentMemberId}`,
          conversationId: convId,
          memberId: currentMemberId,
          role: "OWNER",
          joinedAt: now,
          lastReadAt: now,
        },
        {
          id: `cm_${convId}_${targetMemberId}`,
          conversationId: convId,
          memberId: targetMemberId,
          role: "MEMBER",
          joinedAt: now,
          lastReadAt: new Date(0),
        },
      ] as any);

      broadcastRealtimeEvent("conversation:update", newConv);

      return NextResponse.json({
        success: true,
        isExisting: false,
        conversation: newConv,
      });
    }

    /* 2. Check existing IPO Group conversation */
    if (type === "IPO" && ipoId) {
      const existingIpoConv = await convCol.findOne({ type: "IPO", ipoId });
      if (existingIpoConv) {
        // Ensure current member is in membership
        const inGroup = await memberCol.findOne({
          conversationId: existingIpoConv.id,
          memberId: currentMemberId,
        });

        if (!inGroup) {
          await memberCol.insertOne({
            id: `cm_${existingIpoConv.id}_${currentMemberId}`,
            conversationId: existingIpoConv.id,
            memberId: currentMemberId,
            role: "MEMBER",
            joinedAt: new Date(),
            lastReadAt: new Date(),
          } as any);
        }

        return NextResponse.json({
          success: true,
          isExisting: true,
          conversation: existingIpoConv,
        });
      }

      const convId = `conv_ipo_${ipoId}`;
      const now = new Date();
      const allUsers = await userCol.find({}).toArray();

      const newConv: ConversationDocument = {
        id: convId,
        type: "IPO",
        title: title || "IPO Discussion",
        avatar: "/oggy.png",
        ipoId,
        createdBy: currentMemberId,
        lastMessage: "Group chat started",
        lastMessageAt: now,
        createdAt: now,
        updatedAt: now,
      };

      await convCol.insertOne(newConv as any);

      // Add all group members to IPO group chat
      const memberships: ConversationMemberDocument[] = allUsers.map((u) => ({
        id: `cm_${convId}_${u.id}`,
        conversationId: convId,
        memberId: u.id,
        role: u.id === currentMemberId ? "OWNER" : "MEMBER",
        joinedAt: now,
        lastReadAt: u.id === currentMemberId ? now : new Date(0),
      }));

      await memberCol.insertMany(memberships as any);

      broadcastRealtimeEvent("conversation:update", newConv);

      return NextResponse.json({
        success: true,
        isExisting: false,
        conversation: newConv,
      });
    }

    /* 3. Create Custom GROUP Conversation */
    const convId = `conv_grp_${Date.now()}`;
    const now = new Date();
    const participantIds: string[] = Array.isArray(body.participantIds)
      ? Array.from(new Set([currentMemberId, ...body.participantIds]))
      : [currentMemberId];

    const newConv: ConversationDocument = {
      id: convId,
      type: "GROUP",
      title: title || "Group Conversation",
      avatar: body.avatar || "/oggy.png",
      createdBy: currentMemberId,
      lastMessage: "Group created",
      lastMessageAt: now,
      createdAt: now,
      updatedAt: now,
    };

    await convCol.insertOne(newConv as any);

    const memberships: ConversationMemberDocument[] = participantIds.map((mId) => ({
      id: `cm_${convId}_${mId}`,
      conversationId: convId,
      memberId: mId,
      role: mId === currentMemberId ? "OWNER" : "MEMBER",
      joinedAt: now,
      lastReadAt: mId === currentMemberId ? now : new Date(0),
    }));

    await memberCol.insertMany(memberships as any);

    broadcastRealtimeEvent("conversation:update", newConv);

    return NextResponse.json({
      success: true,
      isExisting: false,
      conversation: newConv,
    });
  } catch (err: any) {
    console.error("POST /api/conversations error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}

/* Helper to seed initial default conversations for registered workspace members */
async function seedDefaultConversations(db: any) {
  const convCol = db.collection(COL_CONV);
  const memberCol = db.collection(COL_MEMBERS);
  const userCol = db.collection(COL_USERS);

  const registeredMembers = await userCol.find({}).toArray();
  if (!registeredMembers || registeredMembers.length === 0) return;

  const now = new Date();
  const owner = registeredMembers[0];

  for (let i = 1; i < registeredMembers.length; i++) {
    const target = registeredMembers[i];
    const pair = [owner.id, target.id].sort();
    const directKey = `${pair[0]}_${pair[1]}`;
    const convId = `conv_dir_${directKey}`;

    const existing = await convCol.findOne({ directKey });
    if (!existing) {
      const uName = (target.username || target.name).toLowerCase();
      await convCol.insertOne({
        id: convId,
        type: "DIRECT",
        title: `@${uName}`,
        createdBy: owner.id,
        directKey,
        lastMessage: `Start chatting with @${uName}`,
        lastMessageAt: now,
        createdAt: now,
        updatedAt: now,
      });

      await memberCol.insertMany([
        { id: `cm_${convId}_${owner.id}`, conversationId: convId, memberId: owner.id, role: "OWNER", joinedAt: now, lastReadAt: now },
        { id: `cm_${convId}_${target.id}`, conversationId: convId, memberId: target.id, role: "MEMBER", joinedAt: now, lastReadAt: now },
      ]);
    }
  }
}
