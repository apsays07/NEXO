"use client";

import React from "react";
import { User, EnvelopeSimple, Phone, IdentificationCard } from "@phosphor-icons/react";

interface PersonalInformationProps {
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  onEdit: () => void;
}

export function PersonalInformation({
  fullName,
  displayName,
  email,
  phone,
  onEdit,
}: PersonalInformationProps) {
  return (
    <div className="p-5 sm:p-6 bg-surface border border-line rounded-2xl space-y-4 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div>
          <h3 className="text-h4 font-semibold text-ink">Personal Information</h3>
          <p className="text-caption text-ink-tertiary font-medium">
            Identity details and contact channels
          </p>
        </div>
        <button
          onClick={onEdit}
          className="text-caption font-semibold text-accent hover:underline cursor-pointer"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-small">
        <div className="p-3 rounded-xl bg-surface-alt/60 border border-line-subtle space-y-1">
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <User size={14} /> Full Name
          </span>
          <p className="font-semibold text-ink">{fullName}</p>
        </div>

        <div className="p-3 rounded-xl bg-surface-alt/60 border border-line-subtle space-y-1">
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <IdentificationCard size={14} /> Display Name
          </span>
          <p className="font-semibold text-ink">{displayName || fullName}</p>
        </div>

        <div className="p-3 rounded-xl bg-surface-alt/60 border border-line-subtle space-y-1">
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <EnvelopeSimple size={14} /> Email Address
          </span>
          <p className="font-semibold text-ink">{email}</p>
        </div>

        <div className="p-3 rounded-xl bg-surface-alt/60 border border-line-subtle space-y-1">
          <span className="text-caption font-semibold text-ink-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <Phone size={14} /> Phone Number
          </span>
          <p className="font-semibold text-ink">{phone || "Not specified"}</p>
        </div>
      </div>
    </div>
  );
}
