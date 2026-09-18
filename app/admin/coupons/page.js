"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Toast from "@/components/Toast";

const emptyForm = { code: "", discountType: "PERCENTAGE", discountValue: "", minimumOrder: "", expiresAt: "", isActive: true };

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
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
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data.coupons || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setModalOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code, discountType: c.discountType, discountValue: c.discountValue,
      minimumOrder: c.minimumOrder || "", expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "", isActive: c.isActive,
    });
    setError("");
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(editing ? `/api/admin/coupons/${editing.id}` : "/api/admin/coupons", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setModalOpen(false);
      setToast(editing ? "Coupon updated successfully" : "Coupon created successfully");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    await fetch(`/api/admin/coupons/${deleteTarget.id}`, { method: "DELETE" });
    setToast("Coupon deleted successfully");
    setDeleting(false);
    setDeleteTarget(null);
    load();
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-ink">Coupons</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-ink">
          <Plus size={15} /> Add Coupon
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-lavender/40 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-lavender/40 bg-lavender-light text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Min. Order</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-primary/50"><Loader2 className="mx-auto animate-spin" size={18} /></td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-primary/50">No coupons yet.</td></tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="border-b border-lavender-light last:border-0 hover:bg-lavender-light">
                  <td className="px-4 py-3 font-mono font-medium text-ink">{c.code}</td>
                  <td className="px-4 py-3 text-ink/75">
                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `$${c.discountValue}`}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{c.minimumOrder ? `$${c.minimumOrder}` : "—"}</td>
                  <td className="px-4 py-3 text-ink/60">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.isActive ? "bg-emerald-50 text-emerald-700" : "bg-lavender-light text-ink/60"}`}>
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(c)} aria-label="Edit" className="text-primary/50 hover:text-ink"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteTarget(c)} aria-label="Delete" className="text-primary/50 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Coupon" : "Add Coupon"}>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/75">Code</span>
            <input required disabled={!!editing} value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50 disabled:bg-lavender-light" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Discount Type</span>
              <select value={form.discountType} onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50">
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed Amount</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Value</span>
              <input required type="number" step="0.01" value={form.discountValue} onChange={(e) => setForm((f) => ({ ...f, discountValue: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Minimum Order</span>
              <input type="number" step="0.01" value={form.minimumOrder} onChange={(e) => setForm((f) => ({ ...f, minimumOrder: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Expires On</span>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/75">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-primary" />
            Active
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex justify-end gap-2 border-t border-lavender-light pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-lavender/40 px-4 py-2 text-sm font-medium text-ink/75 hover:bg-lavender-light">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-ink disabled:opacity-70">
              {saving && <Loader2 size={13} className="animate-spin" />}
              {editing ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Coupon"
        description={`Delete coupon "${deleteTarget?.code}"? This cannot be undone.`}
      />
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
