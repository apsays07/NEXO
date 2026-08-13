import { ConversationMemberRole } from "@/types/nexo";

export interface ConversationMemberDocument {
  _id?: any;
  id: string;
  conversationId: string;
  memberId: string;
  role: ConversationMemberRole;
  joinedAt: Date | string;
  lastReadAt?: Date | string;
  isMuted?: boolean;
  isArchived?: boolean;
}
