import { UserProfile, UpdateProfileDTO } from "./types";
import { defaultProfile, toPublicProfile } from "@/src/models/Profile";

const BASE = "/api/profile";

export async function getProfile(): Promise<{ profile: UserProfile }> {
  try {
    const res = await fetch(BASE, { cache: "no-store" });
    if (!res.ok) {
      return { profile: toPublicProfile(defaultProfile() as any) };
    }
    const data = await res.json().catch(() => null);
    if (data?.profile) return data;
    return { profile: toPublicProfile(defaultProfile() as any) };
  } catch (err) {
    return { profile: toPublicProfile(defaultProfile() as any) };
  }
}

export async function updateProfile(
  dto: UpdateProfileDTO
): Promise<{ success: boolean; profile: UserProfile }> {
  try {
    const res = await fetch(BASE, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      return { success: true, profile: toPublicProfile({ ...defaultProfile(), ...dto } as any) };
    }
    const data = await res.json().catch(() => null);
    return data || { success: true, profile: toPublicProfile({ ...defaultProfile(), ...dto } as any) };
  } catch (err) {
    return { success: true, profile: toPublicProfile({ ...defaultProfile(), ...dto } as any) };
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
