"use client";

import React, { useState } from "react";
import { useNexo } from "@/context/NexoContext";
import { archiveIPO as archiveIPOApi } from "@/src/features/ipo/api";
import { Archive, CircleNotch } from "@phosphor-icons/react";
import { IPOOpportunity } from "@/types/nexo";

interface ArchiveIPOModalProps {
  ipo: IPOOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ArchiveIPOModal({
  ipo,
  isOpen,
  onClose,
  onSuccess,
}: ArchiveIPOModalProps) {
  const { refreshIpos } = useNexo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !ipo) return null;

  const handleArchive = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await archiveIPOApi(ipo.id);
      if (refreshIpos) {
        await refreshIpos();
      }
      setIsSubmitting(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to archive IPO opportunity");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-sm bg-surface border border-line rounded-2xl p-5 shadow-2xl space-y-4 animate-modal-pop-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-caution-soft border border-caution/30 flex items-center justify-center text-caution shrink-0">
            <Archive size={20} weight="bold" />
          </div>
          <div>
            <h3 className="text-h4 font-semibold text-ink tracking-tight">
              Archive {ipo.name}?
            </h3>
            <p className="text-caption text-ink-tertiary font-medium">
              Soft-delete record from active workspace
            </p>
          </div>
        </div>

        <p className="text-small text-ink-secondary font-medium leading-relaxed">
          This will remove <strong className="text-ink font-semibold">{ipo.name}</strong> from your active views while preserving the record in MongoDB Atlas.
        </p>

        {error && (
          <div className="p-2.5 rounded-xl bg-negative-soft text-negative text-caption font-semibold">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3.5 py-2 rounded-xl border border-line text-small font-medium text-ink-secondary hover:bg-surface-alt transition-colors cursor-pointer select-none"
          >
            Cancel
          </button>
          <button
            onClick={handleArchive}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-small shadow-xs transition-all active:scale-98 cursor-pointer select-none flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <CircleNotch size={14} className="animate-spin" />
                <span>Archiving...</span>
              </>
            ) : (
              "Archive IPO"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
