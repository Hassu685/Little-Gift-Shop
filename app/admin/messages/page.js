"use client";

import { useEffect, useState, useCallback } from "react";
import { Mail, MailOpen, Trash2, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Toast from "@/components/Toast";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/messages${filter ? `?filter=${filter}` : ""}`);
    const data = await res.json();
    setMessages(data.messages || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const toggleRead = async (m) => {
    await fetch(`/api/admin/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !m.isRead }),
    });
    load();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    await fetch(`/api/admin/messages/${deleteTarget.id}`, { method: "DELETE" });
    setToast("Message deleted");
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-ink">Contact Messages</h1>
        <div className="flex gap-2">
          {[["", "All"], ["unread", "Unread"]].map(([val, label]) => (
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
      ) : messages.length === 0 ? (
        <p className="text-sm text-primary/50">No messages here.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`rounded-xl border p-4 ${m.isRead ? "border-lavender/40 bg-white" : "border-lavender bg-lavender-light/40"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{m.subject}</p>
                  <p className="text-xs text-primary/50">{m.name} · {m.email}{m.phone ? ` · ${m.phone}` : ""}</p>
                  <p className="mt-2 text-sm text-ink/75">{m.message}</p>
                  <p className="mt-2 text-xs text-primary/50">
                    {new Date(m.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => toggleRead(m)} aria-label="Toggle read" className="flex h-8 w-8 items-center justify-center rounded-lg bg-lavender-light text-ink/60 hover:bg-lavender/40">
                    {m.isRead ? <Mail size={14} /> : <MailOpen size={14} />}
                  </button>
                  <button onClick={() => setDeleteTarget(m)} aria-label="Delete" className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100">
                    <Trash2 size={14} />
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
        title="Delete Message"
        description="Are you sure you want to permanently delete this message?"
      />
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
