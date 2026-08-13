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

    return NextResponse.json({ success: true, conversations: enriched });
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

/* Helper to seed initial default conversations */
async function seedDefaultConversations(db: any) {
  const convCol = db.collection(COL_CONV);
  const memberCol = db.collection(COL_MEMBERS);
  const msgCol = db.collection(COL_MSG);

  const now = new Date();
  const t1 = new Date(now.getTime() - 2 * 60 * 1000);
  const t2 = new Date(now.getTime() - 14 * 60 * 1000);
  const t3 = new Date(now.getTime() - 60 * 60 * 1000);

  // 1. IPO Chat: Dhoot Transmission
  const ipoConvId = "conv_ipo_ipo_abc";
  await convCol.insertOne({
    id: ipoConvId,
    type: "IPO",
    title: "Dhoot Transmission",
    avatar: "/oggy.png",
    ipoId: "ipo_abc",
    createdBy: "mem_1",
    lastMessage: "Application submitted ✓",
    lastMessageAt: t1,
    createdAt: t3,
    updatedAt: t1,
  });

  await memberCol.insertMany([
    { id: `cm_${ipoConvId}_mem_1`, conversationId: ipoConvId, memberId: "mem_1", role: "OWNER", joinedAt: t3, lastReadAt: t1 },
    { id: `cm_${ipoConvId}_mem_2`, conversationId: ipoConvId, memberId: "mem_2", role: "MEMBER", joinedAt: t3, lastReadAt: t3 },
    { id: `cm_${ipoConvId}_mem_3`, conversationId: ipoConvId, memberId: "mem_3", role: "MEMBER", joinedAt: t3, lastReadAt: t3 },
  ]);

  await msgCol.insertMany([
    { id: "msg_1", conversationId: ipoConvId, senderId: "mem_2", text: "I think we should apply for 2 lots.", type: "TEXT", createdAt: new Date(t1.getTime() - 5 * 60 * 1000) },
    { id: "msg_2", conversationId: ipoConvId, senderId: "mem_1", text: "Agreed. I'll contribute ₹40,000.", type: "TEXT", createdAt: new Date(t1.getTime() - 3 * 60 * 1000) },
    { id: "msg_3", conversationId: ipoConvId, senderId: "mem_3", text: "Application submitted ✓", type: "TEXT", createdAt: t1 },
  ]);

  // 2. Direct Chat with Ashay (mem_2)
  const dir1Id = "conv_dir_mem_1_mem_2";
  await convCol.insertOne({
    id: dir1Id,
    type: "DIRECT",
    title: "Ashay",
    createdBy: "mem_1",
    directKey: "mem_1_mem_2",
    lastMessage: "Let's discuss the lot size.",
    lastMessageAt: t2,
    createdAt: t3,
    updatedAt: t2,
  });

  await memberCol.insertMany([
    { id: `cm_${dir1Id}_mem_1`, conversationId: dir1Id, memberId: "mem_1", role: "OWNER", joinedAt: t3, lastReadAt: t2 },
    { id: `cm_${dir1Id}_mem_2`, conversationId: dir1Id, memberId: "mem_2", role: "MEMBER", joinedAt: t3, lastReadAt: t3 },
  ]);

  await msgCol.insertOne({
    id: "msg_dir_1",
    conversationId: dir1Id,
    senderId: "mem_2",
    text: "Let's discuss the lot size.",
    type: "TEXT",
    createdAt: t2,
  });

  // 3. Direct Chat with Ranveer (mem_3)
  const dir2Id = "conv_dir_mem_1_mem_3";
  await convCol.insertOne({
    id: dir2Id,
    type: "DIRECT",
    title: "Ranveer",
    createdBy: "mem_1",
    directKey: "mem_1_mem_3",
    lastMessage: "Allotment results are out.",
    lastMessageAt: t3,
    createdAt: t3,
    updatedAt: t3,
  });

  await memberCol.insertMany([
    { id: `cm_${dir2Id}_mem_1`, conversationId: dir2Id, memberId: "mem_1", role: "OWNER", joinedAt: t3, lastReadAt: t3 },
    { id: `cm_${dir2Id}_mem_3`, conversationId: dir2Id, memberId: "mem_3", role: "MEMBER", joinedAt: t3, lastReadAt: t3 },
  ]);

  await msgCol.insertOne({
    id: "msg_dir_2",
    conversationId: dir2Id,
    senderId: "mem_3",
    text: "Allotment results are out.",
    type: "TEXT",
    createdAt: t3,
  });
}
