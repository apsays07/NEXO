"use client";

import React from "react";
import { Users, ArrowRight } from "@phosphor-icons/react";

interface GroupMembershipProps {
  syndicateName?: string;
  membersCount?: number;
  role?: string;
  joinedDate?: string;
  onViewGroup: () => void;
}

export function GroupMembership({
  syndicateName = "NEXO Private Wealth Syndicate",
  membersCount = 5,
  role = "Admin",
  joinedDate = "August 2026",
  onViewGroup,
}: GroupMembershipProps) {
  return (
    <div className="p-5 sm:p-6 bg-surface border border-line rounded-2xl space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-alt border border-line-strong text-ink flex items-center justify-center font-bold">
            <Users size={18} />
          </div>
          <div>
            <h3 className="text-h4 font-semibold text-ink">Group Membership</h3>
            <p className="text-caption text-ink-tertiary font-medium">
              Private syndicate affiliation
            </p>
          </div>
        </div>

        <button
          onClick={onViewGroup}
          className="text-caption font-semibold text-accent hover:underline cursor-pointer flex items-center gap-1"
        >
          View Group <ArrowRight size={12} />
        </button>
      </div>

      <div className="p-4 rounded-xl bg-surface-alt/60 border border-line-subtle space-y-3">
        <div>
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider block mb-0.5">
            Syndicate
          </span>
          <p className="text-small font-semibold text-ink">{syndicateName}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line text-caption">
          <div>
            <span className="text-ink-tertiary block font-medium">Members</span>
            <span className="font-semibold text-ink">{membersCount} Active</span>
          </div>
          <div>
            <span className="text-ink-tertiary block font-medium">Your Role</span>
            <span className="font-semibold text-accent">{role}</span>
          </div>
          <div>
            <span className="text-ink-tertiary block font-medium">Joined</span>
            <span className="font-semibold text-ink">{joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
