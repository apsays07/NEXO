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
          <h2 className="nexo-h2 text-[#111318]">
            Group Members
          </h2>
          <p className="text-xs text-[#5F6673] font-normal mt-0.5">
            5 verified group members participating in private IPO opportunities
          </p>
        </div>

        <Button size="sm" variant="primary">
          <UserPlus size={14} /> Invite Trusted Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {members.map((member) => (
          <Card key={member.id} className="flex flex-col justify-between space-y-4 border-[#E2E8F0]">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#BFDBFE]"
                  />
                  <div>
                    <h3 className="text-[18px] leading-[26px] font-semibold text-[#111318] flex items-center gap-1.5">
                      {member.name}
                      {member.role === "ADMIN" && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold uppercase font-mono">
                          Admin
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-[#5F6673] font-normal">{member.email}</div>
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#5F6673] font-medium">Registered PAN</span>
                  <MaskedPAN panMasked={member.panMasked} panFull={member.panFull} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5F6673] font-medium">Default Lot Allocation</span>
                  <span className="font-semibold text-[#111318] num-tabular">
                    {formatINR(member.defaultContribution)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5F6673] font-medium">Member Since</span>
                  <span className="text-[#111318] font-medium">{member.joinedAt}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="text-[#059669] font-medium flex items-center gap-1">
                <ShieldCheck size={14} /> KYC & PAN Verified
              </span>
              <button className="text-[#2563EB] hover:underline font-semibold cursor-pointer">
                Edit Limits
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
