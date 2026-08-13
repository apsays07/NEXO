"use client";

import React from "react";
import { Gear, Database, SlidersHorizontal } from "@phosphor-icons/react";

export function SettingsTab() {
  return (
    <div className="space-y-5 font-sans text-ink pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">NEXO Workspace Settings</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Configure default pool contribution sizes, notification hooks, and database sync preferences
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-line p-5 shadow-2xs space-y-6">
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-line/60 pb-2">
            GROUP DEFAULTS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Default Combo Allocation (₹)</label>
              <input
                type="number"
                defaultValue={100000}
                className="w-full h-9 px-3 rounded-lg bg-surface border border-line text-xs font-mono font-bold text-ink"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ink block mb-1">Auto-Allotment Check Interval</label>
              <select className="w-full h-9 px-3 rounded-lg bg-surface border border-line text-xs font-semibold text-ink">
                <option>Every 15 Minutes</option>
                <option>Every Hour</option>
                <option>Manual Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-line/60">
          <button className="h-9 px-4 rounded-lg bg-accent text-white text-xs font-bold hover:bg-accent/90 cursor-pointer shadow-2xs">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
