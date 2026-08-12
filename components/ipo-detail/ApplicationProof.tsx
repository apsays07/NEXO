"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import { MaskedPAN } from "../ui/MaskedPAN";
import { UploadZone } from "../ui/UploadZone";
import { IPOOpportunity } from "@/types/nexo";
import { LockKey, CheckCircle, Eye, Swap } from "@phosphor-icons/react";

interface ApplicationProofProps {
  ipo: IPOOpportunity;
}

export function ApplicationProof({ ipo }: ApplicationProofProps) {
  const [proofUploaded, setProofUploaded] = useState(true);
  const [showReplaceUpload, setShowReplaceUpload] = useState(false);

  return (
    <Card id="application" className="p-6 bg-white border-[#E2E8F0] shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle size={20} className="text-[#2563EB]" />
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight uppercase">
              APPLICATION PROOF & PAN VAULT
            </h3>
            <p className="text-xs text-[#64748B] font-medium">
              Encrypted document proof & authorized PAN access
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#64748B] font-medium">
          <LockKey size={14} className="text-[#059669]" /> Private Document
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Screenshot Document Vault */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold text-[#0F172A]">
              Application Screenshot
            </span>
            <span className="text-[#059669] font-bold flex items-center gap-1">
              <CheckCircle size={14} /> Uploaded 12 Aug, 4:38 PM
            </span>
          </div>

          {showReplaceUpload ? (
            <div className="space-y-2">
              <UploadZone
                onUploadComplete={() => {
                  setProofUploaded(true);
                  setShowReplaceUpload(false);
                }}
              />
              <button
                onClick={() => setShowReplaceUpload(false)}
                className="text-xs text-[#64748B] underline font-medium"
              >
                Cancel replace
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-xs border border-[#BFDBFE]">
                  PNG
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">
                    dhoot_application_proof.png
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    1.4 MB • Encrypted Syndicate Vault
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowReplaceUpload(true)}
                  className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-bold transition-colors"
                >
                  Replace
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Masked PAN Security Vault */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-between">
          <div>
            <div className="text-xs font-extrabold text-[#0F172A] mb-1">
              Applicant PAN Security
            </div>
            <p className="text-xs text-[#64748B] font-medium mb-3">
              PAN numbers are masked by default and require authorized reveal permission.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
            <MaskedPAN panMasked="XXXXX2741D" panFull="ABCDE2741D" />
          </div>
        </div>
      </div>
    </Card>
  );
}
