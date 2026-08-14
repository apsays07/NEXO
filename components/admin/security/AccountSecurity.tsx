"use client";

import React from "react";
import { 
  Prohibit, CheckCircle, Warning, Key, ShieldCheck, 
  UserCircle, ArrowsClockwise, Eye
} from "@phosphor-icons/react";

interface StatusMetrics {
  active: number;
  suspended: number;
  disabled: number;
  passwordChangeRequired: number;
  emailUnverified: number;
}

interface SuspendedAccount {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  suspendedAt: string;
  reason: string;
}

interface PasswordRequiredAccount {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
}

interface Props {
  metrics: StatusMetrics | null;
  suspendedAccounts: SuspendedAccount[];
  passwordRequiredAccounts: PasswordRequiredAccount[];
  onReactivate: (id: string) => Promise<void>;
  onViewMember: (id: string) => void;
  isLoading: boolean;
}

export function AccountSecurity({
  metrics,
  suspendedAccounts,
  passwordRequiredAccounts,
  onReactivate,
  onViewMember,
  isLoading
}: Props) {

  const handleReactivateClick = (account: SuspendedAccount) => {
    if (confirm(`Reactivate account access for ${account.name} (@${account.username})?`)) {
      onReactivate(account.id);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      
      {/* Aggregate metrics */}
      <div className="bg-slate-50/50 dark:bg-[#14161A]/35 border border-slate-200 dark:border-[#252931]/60 rounded-2xl p-4 select-none">
        <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-[#626A75] uppercase tracking-wider mb-3">System Directory Statuses</h4>
        
        {isLoading ? (
          <div className="h-10 bg-slate-100 dark:bg-slate-800/40 rounded animate-pulse"></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px]">ACTIVE</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{metrics?.active ?? 0}</span>
            </div>
            <div className="border-l border-slate-200 dark:border-[#252931]/40 pl-4">
              <span className="text-amber-500 block font-semibold text-[10px]">SUSPENDED</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{metrics?.suspended ?? 0}</span>
            </div>
            <div className="border-l border-slate-200 dark:border-[#252931]/40 pl-4">
              <span className="text-rose-500 block font-semibold text-[10px]">DISABLED</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{metrics?.disabled ?? 0}</span>
            </div>
            <div className="border-l border-slate-200 dark:border-[#252931]/40 pl-4">
              <span className="text-blue-500 block font-semibold text-[10px]">RESET REQUIRED</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{metrics?.passwordChangeRequired ?? 0}</span>
            </div>
            <div className="border-l border-slate-200 dark:border-[#252931]/40 pl-4">
              <span className="text-slate-400 block font-semibold text-[10px]">EMAIL UNVERIFIED</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5 block">{metrics?.emailUnverified ?? 0}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Suspended Accounts List */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-[#626A75] uppercase tracking-wider block select-none">Suspended Accounts</h4>
          
          {isLoading ? (
            <div className="h-20 bg-slate-100 dark:bg-slate-800/40 rounded animate-pulse"></div>
          ) : suspendedAccounts.length === 0 ? (
            <div className="p-5 text-center text-slate-400 bg-slate-50/20 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-[#252931] rounded-xl select-none">
              No suspended member accounts.
            </div>
          ) : (
            <div className="space-y-2">
              {suspendedAccounts.map((account) => (
                <div key={account.id} className="p-3.5 bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-xl flex items-center justify-between shadow-3xs">
                  <div className="flex items-center gap-2.5">
                    <img src={account.avatar} className="w-8 h-8 rounded-full object-cover border" alt="" />
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block leading-tight">{account.name}</span>
                      <span className="text-[9px] text-slate-400">@{account.username} · {account.role}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewMember(account.id)}
                      className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-[#AEB5C0] cursor-pointer"
                      title="View workspace"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => handleReactivateClick(account)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold text-[9px] cursor-pointer"
                    >
                      Reactivate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Password Reset Required Accounts */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-extrabold text-slate-400 dark:text-[#626A75] uppercase tracking-wider block select-none">Forced Password Changes</h4>
          
          {isLoading ? (
            <div className="h-20 bg-slate-100 dark:bg-slate-800/40 rounded animate-pulse"></div>
          ) : passwordRequiredAccounts.length === 0 ? (
            <div className="p-5 text-center text-slate-400 bg-slate-50/20 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-[#252931] rounded-xl select-none">
              No outstanding mandatory password resets.
            </div>
          ) : (
            <div className="space-y-2">
              {passwordRequiredAccounts.map((account) => (
                <div key={account.id} className="p-3.5 bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#252931] rounded-xl flex items-center justify-between shadow-3xs">
                  <div className="flex items-center gap-2.5">
                    <img src={account.avatar} className="w-8 h-8 rounded-full object-cover border" alt="" />
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 block leading-tight">{account.name}</span>
                      <span className="text-[9px] text-slate-400">@{account.username} · {account.role}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewMember(account.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-[#AEB5C0] font-bold text-[9px] cursor-pointer"
                  >
                    View Member
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
