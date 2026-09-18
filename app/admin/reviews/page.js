"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Check, X, Trash2, Loader2, Star } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Toast from "@/components/Toast";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/reviews?status=${filter}`);
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const setApproval = async (id, isApproved) => {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved }),
    });
    setToast(isApproved ? "Review approved" : "Review rejected");
    load();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    await fetch(`/api/admin/reviews/${deleteTarget.id}`, { method: "DELETE" });
    setToast("Review deleted successfully");
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-ink">Reviews</h1>
        <div className="flex gap-2">
          {[["pending", "Pending"], ["approved", "Approved"], ["", "All"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium ${filter === val ? "bg-primary text-white" : "bg-white text-ink/60 border border-lavender/40"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-primary/50"><Loader2 className="inline animate-spin" size={14} /> Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-primary/50">No reviews here.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-lavender/40 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/shop/${r.product.slug}`} className="text-sm font-medium text-ink hover:text-primary">
                    {r.product.name}
                  </Link>
                  <p className="text-xs text-primary/50">{r.user.name} · {r.user.email}</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={11} className="text-amber-400" fill="currentColor" />)}
                  </div>
                  <p className="mt-2 text-sm text-ink/75">{r.comment}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!r.isApproved && (
                    <button onClick={() => setApproval(r.id, true)} aria-label="Approve" className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                      <Check size={15} />
                    </button>
                  )}
                  {r.isApproved && (
                    <button onClick={() => setApproval(r.id, false)} aria-label="Reject" className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100">
                      <X size={15} />
                    </button>
                  )}
                  <button onClick={() => setDeleteTarget(r)} aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Review"
        description="Are you sure you want to permanently delete this review?"
      />
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
