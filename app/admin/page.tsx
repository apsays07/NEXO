"use client";

import React, { useEffect } from "react";
import { useNexo } from "@/context/NexoContext";
import { useRouter } from "next/navigation";
import { AdminConsole } from "@/src/features/admin/AdminConsole";
import { ShieldCheck } from "@phosphor-icons/react";

export default function AdminPage() {
  const { currentMember, currentUser, currentUserRole, isAuthLoaded, isAuthenticated } = useNexo();
  const router = useRouter();

  const activeUser = currentMember || currentUser;
  const activeRole = activeUser?.role || currentUserRole;
  const isAdmin = activeRole === "ADMIN" || activeRole === "SUPER_ADMIN";

  useEffect(() => {
    if (isAuthLoaded && (!isAuthenticated || !isAdmin)) {
      router.replace("/admin/login");
    }
  }, [isAuthLoaded, isAuthenticated, isAdmin, router]);

  if (!isAuthLoaded || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 font-sans p-4">
        <div className="p-6 max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-xl text-center space-y-3">
          <ShieldCheck size={32} className="text-blue-500 mx-auto animate-pulse" weight="fill" />
          <h2 className="text-base font-extrabold text-white">Verifying Admin Access...</h2>
          <p className="text-xs text-slate-400">Redirecting to Admin Portal Login...</p>
        </div>
      </div>
    );
  }

  return <AdminConsole />;
}
