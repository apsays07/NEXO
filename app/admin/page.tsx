"use client";

import React, { useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { useRouter } from "next/navigation";
import { AdminIPOManagement } from "@/components/admin/AdminIPOManagement";

export default function AdminPage() {
  const { currentMember, currentUser, currentUserRole, isAuthLoaded } = useNexo();
  const router = useRouter();

  const activeRole = currentMember?.role || currentUser?.role || currentUserRole;
  const isAdmin = activeRole === "ADMIN";

  useEffect(() => {
    if (isAuthLoaded && !isAdmin) {
      router.replace("/");
    }
  }, [isAuthLoaded, isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
        <div className="p-6 max-w-sm w-full bg-white border border-rose-200 rounded-3xl shadow-xl text-center space-y-3">
          <h2 className="text-base font-extrabold text-slate-900">Unauthorized Access</h2>
          <p className="text-xs text-slate-500">Redirecting to user website...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <AdminIPOManagement />
    </div>
  );
}
