"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import AdminModal from "@/components/admin/AdminModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUploader from "@/components/admin/ImageUploader";
import Toast from "@/components/Toast";
import { formatPrice } from "@/utils/format";

const emptyForm = {
  name: "", description: "", shortDescription: "", price: "", comparePrice: "",
  stock: "", sku: "", categoryId: "", occasionId: "", featured: false, isActive: true,
  videoUrl: "", images: [],
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/products?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }, [q]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
    fetch("/api/admin/occasions").then((r) => r.json()).then((d) => setOccasions(d.occasions || []));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, description: p.description || "", shortDescription: p.shortDescription || "",
      price: p.price, comparePrice: p.comparePrice || "", stock: p.stock, sku: p.sku,
      categoryId: p.categoryId || "", occasionId: p.occasionId || "",
      featured: p.featured, isActive: p.isActive, videoUrl: p.videoUrl || "",
      images: p.images?.map((i) => i.url) || [],
    });
    setError("");
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(editing ? `/api/admin/products/${editing.id}` : "/api/admin/products", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setModalOpen(false);
      setToast(editing ? "Product updated successfully" : "Product created successfully");
      loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setToast("Product deleted successfully");
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      setToast(err.message);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-ink">Products</h1>
        <button onClick={openCreate} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-ink">
          <Plus size={15} /> Add Product
        </button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products or SKU..."
          className="w-full rounded-lg border border-lavender/40 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-primary/50"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-lavender/40 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-lavender/40 bg-lavender-light text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-primary/50"><Loader2 className="mx-auto animate-spin" size={18} /></td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-primary/50">No products found.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-lavender-light last:border-0 hover:bg-lavender-light">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-lavender-light">
                      {p.images?.[0] && <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />}
                    </div>
                    <div>
                      <p className="font-medium text-ink">{p.name}</p>
                      <p className="text-xs text-primary/50">{p.category?.name || "Uncategorized"}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{p.sku}</td>
                  <td className="px-4 py-3 text-ink">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock <= 5 ? "text-amber-600" : "text-ink"}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-lavender-light text-ink/60"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} aria-label="Edit" className="text-primary/50 hover:text-ink">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(p)} aria-label="Delete" className="text-primary/50 hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "Add Product"} maxWidth="max-w-2xl">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Product Name</span>
              <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">SKU</span>
              <input required value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Price</span>
              <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Compare Price</span>
              <input type="number" step="0.01" value={form.comparePrice} onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Stock</span>
              <input required type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Video URL (optional)</span>
              <input value={form.videoUrl} onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                placeholder="/videos/products/example.mp4"
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Category</span>
              <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50">
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink/75">Occasion</span>
              <select value={form.occasionId} onChange={(e) => setForm((f) => ({ ...f, occasionId: e.target.value }))}
                className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50">
                <option value="">None</option>
                {occasions.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/75">Short Description</span>
            <input value={form.shortDescription} onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
              className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/75">Description</span>
            <textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
          </label>

          <div>
            <span className="mb-2 block text-xs font-medium text-ink/75">Images</span>
            <ImageUploader images={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-ink/75">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="accent-primary" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-ink/75">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="accent-primary" />
              Active
            </label>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 border-t border-lavender-light pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-lavender/40 px-4 py-2 text-sm font-medium text-ink/75 hover:bg-lavender-light">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-ink disabled:opacity-70">
              {saving && <Loader2 size={13} className="animate-spin" />}
              {editing ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
