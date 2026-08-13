import { UserProfile, UpdateProfileDTO } from "./types";

const BASE = "/api/profile";

export async function getProfile(): Promise<{ profile: UserProfile }> {
  const res = await fetch(BASE, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function updateProfile(
  dto: UpdateProfileDTO
): Promise<{ success: boolean; profile: UserProfile }> {
  const res = await fetch(BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update profile");
  }
  return res.json();
}

/* Avatar: converts file to base64 data-URL and saves it as the avatar field */
export async function uploadAvatar(
  file: File
): Promise<{ success: boolean; avatarUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve({ success: true, avatarUrl: reader.result as string });
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}
