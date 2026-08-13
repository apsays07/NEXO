"use client";

import React from "react";
import { ShieldCheck, Key, Lock, CheckCircle } from "@phosphor-icons/react";

export function SecurityTab() {
  return (
    <div className="space-y-5 font-sans text-ink pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">Security & Audit Logs</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Admin session security, audit trails, active tokens, and workspace authorization controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck size={14} weight="fill" />
            <span>SESSION ENCRYPTED</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl bg-surface border border-line p-5 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-line/60 pb-2">
            RECENT SECURITY EVENTS
          </h2>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-surface-alt/60 border border-line flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-emerald-500" weight="fill" />
                <div>
                  <span className="text-xs font-bold text-ink block">Admin Portal Authentication</span>
                  <span className="text-[10px] text-ink-tertiary">Niranjan • IP 127.0.0.1 • Chrome Windows</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-ink-tertiary">2m ago</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-line flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock size={16} className="text-amber-500" />
                <div>
                  <span className="text-xs font-bold text-ink block">Session Revoked</span>
                  <span className="text-[10px] text-ink-tertiary">Chrome Windows • Cookie invalidation</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-ink-tertiary">1h ago</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl bg-surface border border-line p-5 shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-line/60 pb-2">
            AUTHORIZATION STATUS
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-ink-secondary">Admin Role:</span>
              <span className="font-mono font-bold text-emerald-500">SUPER_ADMIN</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-secondary">Database:</span>
              <span className="font-mono font-bold text-emerald-500">MongoDB Atlas</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-secondary">HTTPS/TLS:</span>
              <span className="font-mono font-bold text-emerald-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
