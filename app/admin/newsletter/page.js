"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Download, Trash2, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Toast from "@/components/Toast";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/newsletter?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setSubscribers(data.subscribers || []);
    setLoading(false);
  }, [q]);

  useEffect(() => { load(); }, [load]);

  const confirmDelete = async () => {
    setDeleting(true);
    await fetch(`/api/admin/newsletter/${deleteTarget.id}`, { method: "DELETE" });
    setToast("Subscriber removed");
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-ink">Newsletter Subscribers</h1>
        <a
          href="/api/admin/newsletter?format=csv"
          className="flex items-center gap-1.5 rounded-lg border border-lavender/40 bg-white px-4 py-2 text-sm font-medium text-ink/75 hover:bg-lavender-light"
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search email..."
          className="w-full rounded-lg border border-lavender/40 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-primary/50"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-lavender/40 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-lavender/40 bg-lavender-light text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Subscribed</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-primary/50"><Loader2 className="mx-auto animate-spin" size={18} /></td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-primary/50">No subscribers yet.</td></tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s.id} className="border-b border-lavender-light last:border-0 hover:bg-lavender-light">
                  <td className="px-4 py-3 text-ink">{s.email}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {new Date(s.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button onClick={() => setDeleteTarget(s)} aria-label="Delete" className="text-primary/50 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Remove Subscriber"
        description={`Remove "${deleteTarget?.email}" from the newsletter list?`}
      />
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
