import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { MessageDocument } from "@/src/models/Message";
import { ConversationDocument } from "@/src/models/Conversation";
import { ConversationMemberDocument } from "@/src/models/ConversationMember";
import { MemberDocument } from "@/src/models/Member";
import { broadcastRealtimeEvent } from "@/app/api/realtime/route";

const DB = "nexo";
const COL_CONV = "conversations";
const COL_MEMBERS = "conversationMembers";
const COL_MSG = "messages";
const COL_USERS = "members";

/* ────────────────────────────────────────────────────────────────
   GET /api/conversations/[id]/messages
   Fetches paginated messages for a conversation (limit default 50).
──────────────────────────────────────────────────────────────── */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const { searchParams } = new URL(req.url);
    const currentMemberId = searchParams.get("memberId") || "mem_1";
    const before = searchParams.get("before"); // ISO date string or timestamp for pagination
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const client = await clientPromise;
    const db = client.db(DB);
    const convCol = db.collection<ConversationDocument>(COL_CONV);
    const memberCol = db.collection<ConversationMemberDocument>(COL_MEMBERS);
    const msgCol = db.collection<MessageDocument>(COL_MSG);
    const userCol = db.collection<MemberDocument>(COL_USERS);

    /* Security & Membership Check with Auto-Enrollment */
    let isMember = await memberCol.findOne({
      conversationId,
      memberId: currentMemberId,
    });

    if (!isMember) {
      const conv = await convCol.findOne({ id: conversationId });
      if (conv) {
        await memberCol.insertOne({
          id: `cm_${conversationId}_${currentMemberId}`,
          conversationId,
          memberId: currentMemberId,
          role: "MEMBER",
          joinedAt: new Date(),
          lastReadAt: new Date(),
        });
      }
    }

    const query: any = { conversationId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const rawMessages = await msgCol
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    // Reverse so oldest is first
    rawMessages.reverse();

    const allUsers = await userCol.find({}).toArray();
    const userMap = new Map(allUsers.map((u) => [u.id, u]));

    // Find other members' lastReadAt to compute read receipt
    const otherMemberships = await memberCol
      .find({ conversationId, memberId: { $ne: currentMemberId } })
      .toArray();

    const maxOtherLastRead = otherMemberships.reduce((max, m) => {
      const t = m.lastReadAt ? new Date(m.lastReadAt).getTime() : 0;
      return Math.max(max, t);
    }, 0);

    const messages = rawMessages.map((msg) => {
      const sender = userMap.get(msg.senderId);
      const msgTime = new Date(msg.createdAt).getTime();

      let status: "SENT" | "DELIVERED" | "READ" = "SENT";
      if (msg.senderId === currentMemberId) {
        status = maxOtherLastRead >= msgTime ? "READ" : "SENT";
      }

      return {
        ...msg,
        senderName: sender?.name || "Member",
        senderUsername: sender?.username || sender?.name.toLowerCase(),
        senderAvatar: sender?.avatar || "/oggy.png",
        status,
      };
    });

    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    console.error("GET /api/conversations/[id]/messages error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────────
   POST /api/conversations/[id]/messages
   Sends a new text message.
──────────────────────────────────────────────────────────────── */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const body = await req.json();
    const senderId = body.senderId || body.currentMemberId || "mem_1";
    const text = (body.text || "").trim();

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Message text cannot be empty" },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Message exceeds maximum 5000 character limit" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB);
    const convCol = db.collection<ConversationDocument>(COL_CONV);
    const memberCol = db.collection<ConversationMemberDocument>(COL_MEMBERS);
    const msgCol = db.collection<MessageDocument>(COL_MSG);
    const userCol = db.collection<MemberDocument>(COL_USERS);

    /* Security check with Auto-Provisioning for seamless 1-on-1 chatting */
    let isMember = await memberCol.findOne({
      conversationId,
      memberId: senderId,
    });

    if (!isMember) {
      const conv = await convCol.findOne({ id: conversationId });
      if (conv) {
        await memberCol.insertOne({
          id: `cm_${conversationId}_${senderId}`,
          conversationId,
          memberId: senderId,
          role: "MEMBER",
          joinedAt: new Date(),
          lastReadAt: new Date(),
        });
      } else {
        // Provision conversation document if missing
        await convCol.insertOne({
          id: conversationId,
          type: "DIRECT",
          title: "Direct Chat",
          createdBy: senderId,
          lastMessage: text,
          lastMessageAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        await memberCol.insertOne({
          id: `cm_${conversationId}_${senderId}`,
          conversationId,
          memberId: senderId,
          role: "OWNER",
          joinedAt: new Date(),
          lastReadAt: new Date(),
        });
      }
    }

    const now = new Date();
    const msgId = `msg_${Date.now()}`;

    const newMsg: MessageDocument = {
      id: msgId,
      conversationId,
      senderId,
      text,
      type: body.type || "TEXT",
      replyToMessageId: body.replyToMessageId,
      createdAt: now,
      isEdited: false,
      isDeleted: false,
    };

    await msgCol.insertOne(newMsg as any);

    /* Update Conversation lastMessage & lastMessageAt */
    await convCol.updateOne(
      { id: conversationId },
      {
        $set: {
          lastMessage: text,
          lastMessageAt: now,
          lastMessageSenderId: senderId,
          updatedAt: now,
        },
      }
    );

    /* Update sender's lastReadAt */
    await memberCol.updateOne(
      { conversationId, memberId: senderId },
      { $set: { lastReadAt: now } }
    );

    const sender = await userCol.findOne({ id: senderId });

    const fullMsg = {
      ...newMsg,
      senderName: sender?.name || "Member",
      senderUsername: sender?.username || sender?.name.toLowerCase(),
      senderAvatar: sender?.avatar || "/oggy.png",
      status: "SENT",
    };

    /* Broadcast real-time SSE event */
    broadcastRealtimeEvent("message:new", fullMsg);

    return NextResponse.json({ success: true, message: fullMsg });
  } catch (err: any) {
    console.error("POST /api/conversations/[id]/messages error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}

/* ────────────────────────────────────────────────────────────────
   PUT /api/conversations/[id]/messages
   Edits or soft-deletes an existing message.
──────────────────────────────────────────────────────────────── */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const body = await req.json();
    const messageId = body.messageId;
    const senderId = body.senderId || "mem_1";
    const action = body.action; // "edit" | "delete"
    const newText = (body.text || "").trim();

    if (!messageId) {
      return NextResponse.json(
        { success: false, error: "messageId is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB);
    const msgCol = db.collection<MessageDocument>(COL_MSG);

    const existingMsg = await msgCol.findOne({ id: messageId, conversationId });
    if (!existingMsg) {
      return NextResponse.json(
        { success: false, error: "Message not found" },
        { status: 404 }
      );
    }

    /* Security check: only author can edit/delete */
    if (existingMsg.senderId !== senderId) {
      return NextResponse.json(
        { success: false, error: "You can only edit or delete your own messages" },
        { status: 403 }
      );
    }

    const now = new Date();
    if (action === "delete") {
      await msgCol.updateOne(
        { id: messageId },
        { $set: { isDeleted: true, updatedAt: now } }
      );
    } else if (action === "edit") {
      if (!newText) {
        return NextResponse.json(
          { success: false, error: "Edited text cannot be empty" },
          { status: 400 }
        );
      }
      await msgCol.updateOne(
        { id: messageId },
        { $set: { text: newText, isEdited: true, updatedAt: now } }
      );
    }

    const updated = await msgCol.findOne({ id: messageId });

    broadcastRealtimeEvent("message:update", updated);

    return NextResponse.json({ success: true, message: updated });
  } catch (err: any) {
    console.error("PUT /api/conversations/[id]/messages error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update message" },
      { status: 500 }
    );
  }
}
