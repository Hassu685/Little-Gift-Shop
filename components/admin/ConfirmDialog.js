"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import AdminModal from "./AdminModal";

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }) {
  return (
    <AdminModal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertTriangle size={16} />
        </span>
        <p className="text-sm text-ink/75">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-lavender/40 px-4 py-2 text-sm font-medium text-ink/75 hover:bg-lavender-light"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-70"
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          Delete
        </button>
      </div>
    </AdminModal>
  );
}
