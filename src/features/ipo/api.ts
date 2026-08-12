import { IPO, CreateIPODTO, UpdateIPODTO } from "./types";

export async function getIPOs(): Promise<IPO[]> {
  const res = await fetch("/api/ipos", { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch IPOs");
  }
  const data = await res.json();
  return data.ipos || [];
}

export async function getIPO(id: string): Promise<IPO> {
  const res = await fetch(`/api/ipos/${id}`, { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "IPO opportunity not found");
  }
  const data = await res.json();
  return data.ipo;
}

export async function createIPO(dto: CreateIPODTO): Promise<IPO> {
  const res = await fetch("/api/ipos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create IPO");
  }
  return data.ipo;
}

export async function updateIPO(id: string, dto: UpdateIPODTO): Promise<IPO> {
  const res = await fetch(`/api/ipos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update IPO");
  }
  return data.ipo;
}

export async function archiveIPO(id: string): Promise<boolean> {
  const res = await fetch(`/api/ipos/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to archive IPO");
  }
  return data.success;
}
