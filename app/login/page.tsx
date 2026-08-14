"use client";

import React, { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080B] flex items-center justify-center text-xs text-slate-400 font-sans">
          Loading NEXO Workspace...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
