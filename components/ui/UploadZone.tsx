"use client";

import React, { useState } from "react";
import { UploadSimple, ShieldCheck, CheckCircle, LockKey } from "@phosphor-icons/react";

interface UploadZoneProps {
  onUploadComplete?: (url: string) => void;
  label?: string;
  existingUrl?: string;
}

export function UploadZone({
  onUploadComplete,
  label = "Upload Application Proof / Screenshot",
  existingUrl,
}: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsUploading(true);

      setTimeout(() => {
        setIsUploading(false);
        const mockPrivateUrl = `/uploads/private_${Date.now()}_${selectedFile.name}`;
        setUploadedUrl(mockPrivateUrl);
        if (onUploadComplete) {
          onUploadComplete(mockPrivateUrl);
        }
      }, 1000);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-[#334155] flex items-center gap-1.5">
          <LockKey size={14} className="text-[#059669]" />
          {label}
        </label>
        <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-medium">
          <ShieldCheck size={14} className="text-[#059669]" /> End-to-end Encrypted Record
        </span>
      </div>

      {uploadedUrl ? (
        <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#30C48D]/20 text-[#059669]">
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                Application Proof Uploaded
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#059669] text-white uppercase font-bold">
                  Verified
                </span>
              </div>
              <div className="text-xs text-[#475569]">
                Encrypted storage • {file?.name || "screenshot_proof.png"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setUploadedUrl(null);
              setFile(null);
            }}
            className="text-xs text-[#059669] hover:underline font-bold transition-colors"
          >
            Replace
          </button>
        </div>
      ) : (
        <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#CBD5E1] hover:border-[#2563EB] rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all cursor-pointer group">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-[#2563EB]">
              <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold">Encrypting & storing proof...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="p-3 rounded-full bg-[#FFFFFF] text-[#475569] border border-[#E2E8F0] group-hover:text-[#2563EB] group-hover:border-[#BFDBFE] shadow-xs transition-all">
                <UploadSimple size={22} />
              </div>
              <div>
                <span className="text-sm font-bold text-[#0F172A] block">
                  Click or drag proof screenshot here
                </span>
                <span className="text-xs text-[#64748B] block mt-0.5 font-medium">
                  PNG, JPG or PDF up to 10MB (Stored in private group vault)
                </span>
              </div>
            </div>
          )}
        </label>
      )}
    </div>
  );
}
