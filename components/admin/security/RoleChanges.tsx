"use client";

import React from "react";
import { 
  ShieldCheck, ShieldWarning, ArrowRight, Clock, UserCircle, 
  CaretRight, ArrowSquareOut
} from "@phosphor-icons/react";

interface RoleChangeEvent {
  id: string;
  actorName: string;
  actorUsername: string;
  actorRole: string;
  targetName: string;
  createdAt: string;
  previousRole: string;
  newRole: string;
}

interface Props {
  roleEvents: RoleChangeEvent[];
  isLoading: boolean;
  onViewMember?: (id: string) => void;
}

export function RoleChanges({ roleEvents, isLoading, onViewMember }: Props) {
  return (
    <div className="space-y-4 text-xs">
      <h3 className="text-xs font-extrabold text-slate-800 dark:text-[#F5F7FA] uppercase tracking-wider block select-none">Role Privilege Changes</h3>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/40 rounded"></div>
          ))}
        </div>
      ) : roleEvents.length === 0 ? (
        <div className="p-5 text-center text-slate-400 bg-slate-50/20 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-[#252931] rounded-xl select-none">
          No privilege changes recorded.
        </div>
      ) : (
        <div className="space-y-2.5">
          {roleEvents.map((evt) => (
            <div 
              key={evt.id} 
              className="p-3.5 bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-xl flex items-center justify-between shadow-3xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/25">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-slate-850 dark:text-slate-100">{evt.actorName}</span>
                    <span className="text-slate-400 font-medium">changed role for</span>
                    <span className="font-extrabold text-slate-850 dark:text-slate-100">{evt.targetName}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px]">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">{evt.previousRole || "MEMBER"}</span>
                    <ArrowRight size={10} className="text-slate-400" />
                    <span className="px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-600 dark:text-[#6B93FF] uppercase font-bold">{evt.newRole}</span>
                  </div>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <span className="font-mono text-[9px] text-slate-400 dark:text-[#626A75] flex items-center gap-1">
                  <Clock size={11} />
                  <span>
                    {new Date(evt.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short"
                    })}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
