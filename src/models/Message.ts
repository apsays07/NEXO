import { MessageType } from "@/types/nexo";

export interface MessageDocument {
  _id?: any;
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  type: MessageType;
  replyToMessageId?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  isEdited?: boolean;
  isDeleted?: boolean;
}
