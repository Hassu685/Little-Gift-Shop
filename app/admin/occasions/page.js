"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Toast from "@/components/Toast";

const emptyForm = { name: "", description: "", image: "", isActive: true };

export default function AdminOccasionsPage() {
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/occasions");
    const data = await res.json();
    setOccasions(data.occasions || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setModalOpen(true); };
  const openEdit = (o) => {
    setEditing(o);
    setForm({ name: o.name, description: o.description || "", image: o.image || "", isActive: o.isActive });
    setError("");
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(editing ? `/api/admin/occasions/${editing.id}` : "/api/admin/occasions", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setModalOpen(false);
      setToast(editing ? "Occasion updated successfully" : "Occasion created successfully");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/occasions/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToast("Occasion deleted successfully");
    } catch (err) {
      setToast(err.message);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
      load();
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-ink">Occasions</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-ink">
          <Plus size={15} /> Add Occasion
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-lavender/40 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-lavender/40 bg-lavender-light text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Products</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-primary/50"><Loader2 className="mx-auto animate-spin" size={18} /></td></tr>
            ) : occasions.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-primary/50">No occasions yet.</td></tr>
            ) : (
              occasions.map((o) => (
                <tr key={o.id} className="border-b border-lavender-light last:border-0 hover:bg-lavender-light">
                  <td className="px-4 py-3 font-medium text-ink">{o.name}</td>
                  <td className="px-4 py-3 text-ink/60">{o._count?.products ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${o.isActive ? "bg-emerald-50 text-emerald-700" : "bg-lavender-light text-ink/60"}`}>
                      {o.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(o)} aria-label="Edit" className="text-primary/50 hover:text-ink"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteTarget(o)} aria-label="Delete" className="text-primary/50 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Occasion" : "Add Occasion"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/75">Name</span>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/75">Description</span>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/75">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-primary" />
            Active
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end gap-2 border-t border-lavender-light pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-lavender/40 px-4 py-2 text-sm font-medium text-ink/75 hover:bg-lavender-light">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-ink disabled:opacity-70">
              {saving && <Loader2 size={13} className="animate-spin" />}
              {editing ? "Save Changes" : "Create Occasion"}
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Occasion"
        description={`Delete "${deleteTarget?.name}"? Products using it will keep their other data but lose this occasion.`}
      />
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
