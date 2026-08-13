import { ConversationType } from "@/types/nexo";

export interface ConversationDocument {
  _id?: any;
  id: string;
  type: ConversationType;
  title: string;
  avatar?: string;
  ipoId?: string;
  createdBy: string;
  directKey?: string; // Deterministic key for DIRECT chats: min(idA, idB) + "_" + max(idA, idB)
  lastMessage?: string;
  lastMessageAt?: Date | string;
  lastMessageSenderId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isArchived?: boolean;
}
