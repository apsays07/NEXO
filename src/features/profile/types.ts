export interface UserProfile {
  _id?: string;

  /* ── Identity ── */
  userId?: string;
  name: string;
  displayName: string;
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;

  /* ── Role ── */
  role: "ADMIN" | "MEMBER";
  isVerified: boolean;

  /* ── Private Credentials (masked only — raw never reaches client) ── */
  panMasked?: string;
  dematBroker?: string;

  /* ── Preferences ── */
  preferences?: {
    theme?: "light" | "dark" | "system";
    currency?: string;
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
  };

  /* ── Security ── */
  security?: {
    lastPasswordChange?: string;
    twoFactorEnabled?: boolean;
    activeSessionsCount?: number;
  };

  /* ── Timestamps ── */
  createdAt?: string;
  updatedAt?: string;
}

/* Fields allowed in a PUT request from the client */
export interface UpdateProfileDTO {
  name?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  panMasked?: string;
  preferences?: UserProfile["preferences"];
}
