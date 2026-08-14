"use client";

import React, { useState } from "react";
import { 
  SignIn, SignOut, ShieldWarning, Warning, Monitor, 
  CaretRight, X, Info
} from "@phosphor-icons/react";

interface LoginEvent {
  id: string;
  eventType: string;
  category: string;
  severity: string;
  actorName: string;
  actorUsername: string;
  actorRole: string;
  deviceName: string;
  ipAddress: string;
  createdAt: string;
  success: boolean;
  context: string;
}

interface Props {
  loginEvents: LoginEvent[];
  isLoading: boolean;
}

export function LoginActivity({ loginEvents, isLoading }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<LoginEvent | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-extrabold text-slate-800 dark:text-[#F5F7FA] uppercase tracking-wider block select-none">Authentication Logs</h3>

      {isLoading ? (
        <div className="space-y-3.5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800/40 shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="w-1/2 h-3.5 bg-slate-100 dark:bg-slate-800/40 rounded"></div>
                <div className="w-1/3 h-2.5 bg-slate-100 dark:bg-slate-800/40 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : loginEvents.length === 0 ? (
        <div className="p-8 text-center text-[10px] text-slate-400 bg-slate-50/20 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-[#252931] rounded-xl select-none">
          No authentication logs available.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-[#252931]/60">
          {loginEvents.map((evt) => {
            const isFailed = !evt.success;
            return (
              <div 
                key={evt.id} 
                onClick={() => setSelectedEvent(evt)}
                className="py-3 flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isFailed 
                      ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
                      : evt.eventType.includes("LOGOUT") 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-[#32C98B] border border-emerald-500/20"
                  }`}>
                    {isFailed ? <ShieldWarning size={14} /> : evt.eventType.includes("LOGOUT") ? <SignOut size={14} /> : <SignIn size={14} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                        {isFailed ? "Failed sign-in attempt" : evt.actorName}
                      </span>
                      {!isFailed && (
                        <span className="text-[9px] font-mono text-slate-400 dark:text-[#858D99]">
                          @{evt.actorUsername}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-[#626A75] mt-0.5 leading-snug">
                      {isFailed ? `${evt.context} LOGIN FAILED` : evt.eventType.includes("LOGOUT") ? "Signed out" : "Signed in"} · {evt.deviceName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-slate-400 dark:text-[#626A75] select-none text-right">
                    {new Date(evt.createdAt).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}
                  </span>
                  <CaretRight size={12} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── DETAIL DRAWER ── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-[#090A0C]/80 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full max-w-sm h-full bg-white dark:bg-[#14161A] border-l border-slate-200 dark:border-[#252931] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-[#252931] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Authentication Detail</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Audit log parameters for the sign-in event</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs">
              <div className="space-y-4">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 font-medium">Event Type</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-[#AEB5C0]">{selectedEvent.eventType}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 font-medium">Actor Account</span>
                  <span className="font-bold text-slate-700 dark:text-[#AEB5C0]">{selectedEvent.actorName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 font-medium">Authentication Context</span>
                  <span className="font-mono font-black text-slate-700 dark:text-[#AEB5C0]">{selectedEvent.context}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 font-medium">Browser / Device</span>
                  <span className="font-bold text-slate-700 dark:text-[#AEB5C0]">{selectedEvent.deviceName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 font-medium">IP Address</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-[#AEB5C0]">{selectedEvent.ipAddress}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 font-medium">Timestamp</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-[#AEB5C0]">
                    {new Date(selectedEvent.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 font-medium">Status Result</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                    selectedEvent.success ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500 animate-pulse"
                  }`}>
                    {selectedEvent.success ? "SUCCESS" : "FAILED / ACCESS DENIED"}
                  </span>
                </div>
              </div>

              {!selectedEvent.success && (
                <div className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-600 dark:text-[#FF6B6B] rounded-xl flex items-start gap-2 text-[10px] leading-relaxed">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <span>Failed login attempts are monitored. Multiple sequential failures will trigger temporary IP address rate limits.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
