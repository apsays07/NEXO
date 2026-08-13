import { UserPresenceStatus } from "@/types/nexo";

export interface UserPresenceDocument {
  _id?: any;
  memberId: string;
  status: UserPresenceStatus;
  lastSeenAt: Date | string;
  updatedAt: Date | string;
}
