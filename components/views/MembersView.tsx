"use client";

import React from "react";
import { useNexo } from "@/context/NexoContext";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { MaskedPAN } from "../ui/MaskedPAN";
import { formatINR } from "@/lib/mockData";
import { UserPlus, ShieldCheck } from "@phosphor-icons/react";

export function MembersView() {
  const { members } = useNexo();

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="nexo-h2 text-ink">
            Group Members
          </h2>
          <p className="text-xs text-ink-secondary font-normal mt-0.5">
            5 verified group members participating in private IPO opportunities
          </p>
        </div>

        <Button size="sm" variant="primary">
          <UserPlus size={14} /> Invite Trusted Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((member) => (
          <Card key={member.id} className="flex flex-col justify-between space-y-4 border-line">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#BFDBFE]"
                  />
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-ink flex items-center gap-1.5">
                      {member.name}
                      {member.role === "ADMIN" && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-caution-soft text-caution font-semibold uppercase font-mono">
                          Admin
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-ink-secondary font-normal">{member.email}</div>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="mt-4 p-3 rounded-xl bg-page border border-line space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary font-medium">Registered PAN</span>
                  <MaskedPAN panMasked={member.panMasked} panFull={member.panFull} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary font-medium">Default Lot Allocation</span>
                  <span className="font-semibold text-ink num-tabular">
                    {formatINR(member.defaultContribution)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ink-secondary font-medium">Member Since</span>
                  <span className="text-ink font-medium">{member.joinedAt}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
              <span className="text-positive font-medium flex items-center gap-1">
                <ShieldCheck size={14} /> KYC & PAN Verified
              </span>
              <button className="text-accent hover:underline font-semibold cursor-pointer">
                Edit Limits
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
