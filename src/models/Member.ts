import { ObjectId } from "mongodb";
import { MemberRole } from "@/types/nexo";

/* ─────────────────────────────────────────────────────────────
   MEMBER CREDENTIALS & USER SCHEMA (native MongoDB driver)
   Collection: "members"
   Stores admin-created group members and their login credentials
   (username & password assigned by Admin via Admin Panel).
───────────────────────────────────────────────────────────── */

export interface MemberDocument {
  _id?: ObjectId;
  id: string;                     // Unique Member ID (e.g. "mem_1", "mem_ashay")
  name: string;                   // Member Full Name (e.g. "Ankit", "Ashay")
  username: string;               // Assigned Login Username (e.g. "admin", "ashay")
  password: string;               // Assigned Login Password (e.g. "admin123", "user123")
  email: string;                  // Email Address
  avatar: string;                 // Avatar Image Path (e.g. "/oggy.png", "/jack.png")
  role: MemberRole;               // "ADMIN" or "MEMBER"
  panMasked: string;              // PAN Card Number (e.g. "ABCDE1234F")
  panFull: string;                // Full PAN Card Number
  defaultContribution: number;    // Default Lot Allocation Limit in ₹
  joinedAt: string;               // Join Date string
  phone?: string;
  upiId?: string;
  createdAt: Date;
  updatedAt: Date;
}
