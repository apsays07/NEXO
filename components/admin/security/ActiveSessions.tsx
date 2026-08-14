"use client";

import React, { useState, useMemo } from "react";
import { 
  Monitor, Phone, Laptop, MagnifyingGlass, Funnel, 
  X, ShieldCheck, UserCircle, DotsThreeOutlineVertical, Keyhole,
  Warning, Info, Trash
} from "@phosphor-icons/react";

interface Session {
  id: string;
  userId: string;
  memberId: string;
  memberName: string;
  username: string;
  avatar: string;
  role: string;
  deviceType: string;
  browser: string;
  os: string;
  deviceName: string;
  ipAddress: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  status: string; // ACTIVE, EXPIRED, REVOKED
  isCurrent: boolean;
}

interface Props {
  sessions: Session[];
  onRevoke: (id: string) => Promise<void>;
  isLoading: boolean;
}

export function ActiveSessions({ sessions, onRevoke, isLoading }: Props) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [deviceFilter, setDeviceFilter] = useState("ALL");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [activeDropdownRow, setActiveDropdownRow] = useState<string | null>(null);

  // Filters
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch = 
        s.memberName.toLowerCase().includes(search.toLowerCase()) ||
        s.username.toLowerCase().includes(search.toLowerCase()) ||
        s.deviceName.toLowerCase().includes(search.toLowerCase()) ||
        s.ipAddress.includes(search);
      
      const matchesRole = roleFilter === "ALL" || s.role === roleFilter;
      const matchesDevice = deviceFilter === "ALL" || s.deviceType.toUpperCase() === deviceFilter;

      return matchesSearch && matchesRole && matchesDevice;
    });
  }, [sessions, search, roleFilter, deviceFilter]);

  const handleRevokeClick = (sess: Session) => {
    setActiveDropdownRow(null);
    if (sess.isCurrent) {
      alert("You cannot revoke your own active session from the list. To sign out, please use the logout option in the navbar.");
      return;
    }
    if (confirm(`Revoke session on ${sess.deviceName} for ${sess.memberName}? The user will be signed out immediately.`)) {
      onRevoke(sess.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
        <h3 className="text-xs font-extrabold text-slate-800 dark:text-[#F5F7FA] uppercase tracking-wider block">Active Sessions ({filteredSessions.length})</h3>
        
        {/* Compact filters row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter sessions…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40 pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] text-[11px] placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <MagnifyingGlass size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Role */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2 py-1.5 rounded-lg bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] text-[11px] font-bold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
          </select>

          {/* Device */}
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="px-2 py-1.5 rounded-lg bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] text-[11px] font-bold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Devices</option>
            <option value="DESKTOP">Desktop</option>
            <option value="MOBILE">Mobile</option>
            <option value="TABLET">Tablet</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400 dark:text-[#858D99] space-y-3 animate-pulse">
          <Monitor size={24} className="mx-auto text-slate-500" />
          <p>Retrieving active device sessions...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="p-8 text-center text-[11px] text-slate-400 bg-slate-50/20 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-[#252931] rounded-xl select-none">
          No active sessions match the chosen filters.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-[#14161A]/50 border-b border-slate-200 dark:border-[#252931] text-[9px] font-extrabold text-slate-400 dark:text-[#858D99] uppercase tracking-wider">
                    <th className="py-2.5 px-4">User</th>
                    <th className="py-2.5 px-4">Device</th>
                    <th className="py-2.5 px-4">Browser</th>
                    <th className="py-2.5 px-4">Last Active</th>
                    <th className="py-2.5 px-4">IP Address</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 w-12 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#252931]/60 text-xs">
                  {filteredSessions.map((sess) => (
                    <tr key={sess.id} className={`hover:bg-slate-50/30 dark:hover:bg-[#14161A] ${sess.isCurrent ? "bg-blue-500/5" : ""}`}>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <img src={sess.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                          <div>
                            <span className="font-extrabold text-slate-800 dark:text-slate-200 block leading-tight">{sess.memberName}</span>
                            <span className="text-[9px] text-slate-400">@{sess.username} · {sess.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <span className="flex items-center gap-1 font-medium">
                          {sess.deviceType === "mobile" ? <Phone size={13} /> : <Laptop size={13} />}
                          <span>{sess.os}</span>
                        </span>
                      </td>
                      <td className="py-2 px-4 text-slate-500">{sess.browser}</td>
                      <td className="py-2 px-4 font-mono text-[10px] text-slate-400">
                        {sess.isCurrent ? "Active now" : new Date(sess.lastActiveAt).toLocaleString("en-IN", { hour: "numeric", minute: "numeric", day: "numeric", month: "short" })}
                      </td>
                      <td className="py-2 px-4 font-mono text-[10px] text-slate-400">{sess.ipAddress}</td>
                      <td className="py-2 px-4">
                        {sess.isCurrent ? (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase">
                            Current
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-center relative">
                        <button
                          onClick={() => setActiveDropdownRow(activeDropdownRow === sess.id ? null : sess.id)}
                          className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <DotsThreeOutlineVertical size={15} weight="bold" />
                        </button>
                        
                        {activeDropdownRow === sess.id && (
                          <>
                            <div
                              className="fixed inset-0 z-30 cursor-default"
                              onClick={() => setActiveDropdownRow(null)}
                            />
                            <div className="absolute right-4 mt-1.5 w-40 bg-white/95 dark:bg-[#15171D]/95 backdrop-blur-md border border-slate-200/90 dark:border-[#272B35] rounded-2xl shadow-2xl p-1.5 z-40 text-left animate-in fade-in zoom-in-95 duration-150">
                              <button
                                onClick={() => { setSelectedSession(sess); setActiveDropdownRow(null); }}
                                className="w-full px-3 py-2 hover:bg-slate-100/80 dark:hover:bg-[#20242F] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 rounded-xl transition-all duration-150 cursor-pointer group"
                              >
                                <Info size={15} className="text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors" />
                                <span>View details</span>
                              </button>
                              {!sess.isCurrent && (
                                <button
                                  onClick={() => { setActiveDropdownRow(null); handleRevokeClick(sess); }}
                                  className="w-full px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-2 rounded-xl transition-all duration-150 cursor-pointer group mt-0.5 border-t border-slate-100 dark:border-[#252931]/80 pt-2"
                                >
                                  <Keyhole size={15} className="shrink-0" />
                                  <span>Revoke session</span>
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid grid-cols-1 gap-2.5 md:hidden">
            {filteredSessions.map((sess) => (
              <div 
                key={sess.id} 
                className={`p-4 bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-xl space-y-3 shadow-3xs ${sess.isCurrent ? "border-blue-500/40" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={sess.avatar} className="w-7 h-7 rounded-full object-cover" alt="" />
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block text-xs">{sess.memberName}</span>
                      <span className="text-[9px] text-slate-400">@{sess.username} · {sess.role}</span>
                    </div>
                  </div>
                  
                  {sess.isCurrent ? (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Current
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRevokeClick(sess)}
                      className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-2.5 text-[10px]">
                  <div>
                    <span className="text-slate-400 block uppercase text-[8px] tracking-wider font-semibold">Device</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                      {sess.deviceType === "mobile" ? <Phone size={12} /> : <Laptop size={12} />}
                      <span>{sess.deviceName}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block uppercase text-[8px] tracking-wider font-semibold">Last Active</span>
                    <span className="font-mono font-bold text-slate-600 dark:text-slate-400 block mt-0.5">
                      {sess.isCurrent ? "Active now" : new Date(sess.lastActiveAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── SESSION DRAWER ── */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-[#090A0C]/80 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full max-w-md h-full bg-white dark:bg-[#14161A] border-l border-slate-200 dark:border-[#252931] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 dark:border-[#252931] flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Session Details</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Metadata and properties for this active token</p>
              </div>
              <button onClick={() => setSelectedSession(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6 text-xs">
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#101114]/50 p-4 border border-slate-200 dark:border-[#252931]/60 rounded-2xl">
                <img src={selectedSession.avatar} className="w-12 h-12 rounded-full object-cover border" alt="" />
                <div>
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm leading-snug">{selectedSession.memberName}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">@{selectedSession.username}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">Role Privilege</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-[#AEB5C0]">{selectedSession.role}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">Operating System</span>
                  <span className="font-bold text-slate-700 dark:text-[#AEB5C0]">{selectedSession.os}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">Web Browser</span>
                  <span className="font-bold text-slate-700 dark:text-[#AEB5C0]">{selectedSession.browser}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">IP Address</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-[#AEB5C0]">{selectedSession.ipAddress}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">Session Started</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-[#AEB5C0]">
                    {new Date(selectedSession.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">Last Session Activity</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-[#AEB5C0]">
                    {new Date(selectedSession.lastActiveAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400">Token Absolute Expiry</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-[#AEB5C0]">
                    {new Date(selectedSession.expiresAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Status</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                    selectedSession.status === "ACTIVE" ? "bg-blue-500/10 text-blue-500" : "bg-rose-500/10 text-rose-500"
                  }`}>
                    {selectedSession.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            {!selectedSession.isCurrent && (
              <div className="p-5 border-t border-slate-100 dark:border-[#252931] bg-slate-55/35 dark:bg-[#101114]/50 shrink-0">
                <button
                  onClick={() => {
                    const sess = selectedSession;
                    setSelectedSession(null);
                    handleRevokeClick(sess);
                  }}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Keyhole size={14} />
                  <span>Revoke Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
