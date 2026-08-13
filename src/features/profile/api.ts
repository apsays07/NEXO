import { UserProfile, UpdateProfileDTO } from "./types";

const BASE = "/api/profile";

export async function getProfile(): Promise<{ profile: UserProfile | null }> {
  try {
    const res = await fetch(BASE, { cache: "no-store" });
    if (!res.ok) {
      return { profile: null };
    }
    return await res.json();
  } catch (err) {
    console.warn("getProfile warning:", err);
    return { profile: null };
  }
}

export async function updateProfile(
  dto: UpdateProfileDTO
): Promise<{ success: boolean; profile: UserProfile | null }> {
  try {
    const res = await fetch(BASE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, profile: null };
    }
    return await res.json();
  } catch (err) {
    console.warn("updateProfile warning:", err);
    return { success: false, profile: null };
  }
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
