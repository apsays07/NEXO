"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { MemberRole } from "@/types/nexo";
import { Users, UserPlus, ShieldCheck, CheckCircle, Shield } from "@phosphor-icons/react";

interface MembersTabProps {
  onOpenAddMember?: () => void;
}

export function MembersTab({ onOpenAddMember }: MembersTabProps) {
  const { members, currentMember, currentUser, updateMember } = useNexo();
  const [roleChangingId, setRoleChangingId] = useState<string | null>(null);

  const handleRoleChange = (memberId: string, newRole: MemberRole) => {
    setRoleChangingId(memberId);
    updateMember(memberId, { role: newRole });
    setTimeout(() => setRoleChangingId(null), 300);
  };

  return (
    <div className="space-y-5 font-sans text-ink pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line/60">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-ink">Members & Permissions</h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            Manage NEXO group participants, roles, default capital allocations, and security privileges
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAddMember && (
            <button
              onClick={onOpenAddMember}
              className="h-8.5 px-3 rounded-lg bg-accent hover:bg-accent/90 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <UserPlus size={15} />
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-line p-5 shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-line text-[11px] font-bold text-ink-tertiary uppercase tracking-wider">
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Email / Username</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">PAN Status</th>
                <th className="py-2.5 px-3 text-right">Default Pool</th>
                <th className="py-2.5 px-3 text-right">Role Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {members.map((mem) => (
                <tr key={mem.id} className="h-12 hover:bg-surface-hover transition-colors">
                  <td className="py-2 px-3 font-bold text-ink">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={mem.avatar || "/oggy.png"}
                        alt={mem.name}
                        className="w-7 h-7 rounded-full object-cover border border-line"
                      />
                      <div>
                        <span className="font-bold text-ink block leading-none">{mem.name}</span>
                        <span className="text-[10px] text-ink-tertiary font-normal">Joined {mem.joinedAt}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-ink-secondary">
                    <div>
                      <span className="block font-medium">{mem.email}</span>
                      <span className="text-[10px] font-mono text-ink-tertiary">@{mem.username || mem.name.toLowerCase()}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        mem.role === "ADMIN" || mem.role === "SUPER_ADMIN"
                          ? "bg-accent/10 text-accent border border-accent/20"
                          : "bg-surface-alt text-ink-secondary border border-line"
                      }`}
                    >
                      <Shield size={10} />
                      {mem.role}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-500 font-semibold">
                      <CheckCircle size={13} weight="fill" />
                      {mem.panMasked || "ABCDE1234F"}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-ink">
                    ₹{(mem.defaultContribution || 50000).toLocaleString("en-IN")}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <select
                      value={mem.role}
                      onChange={(e) => handleRoleChange(mem.id, e.target.value as MemberRole)}
                      disabled={roleChangingId === mem.id || mem.role === "SUPER_ADMIN"}
                      className="h-7 px-2 rounded-md bg-surface-alt border border-line text-[11px] font-semibold text-ink cursor-pointer"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="ADMIN">Admin</option>
                      {mem.role === "SUPER_ADMIN" && <option value="SUPER_ADMIN">Super Admin</option>}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
