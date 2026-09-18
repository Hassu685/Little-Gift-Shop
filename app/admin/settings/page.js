"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminSettingsPage() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setForm({ name: user.name || "", phone: user.phone || "" });
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await refresh();
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-ink">Settings</h1>

      <div className="rounded-xl border border-lavender/40 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-ink">Admin Profile</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/75">Name</span>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/75">Email</span>
            <input value={user.email} disabled className="w-full rounded-lg border border-lavender-light bg-lavender-light px-3 py-2 text-sm text-primary/50" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink/75">Phone</span>
            <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50" />
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {status === "success" && <p className="flex items-center gap-1.5 text-xs text-emerald-600"><CheckCircle2 size={13} /> Saved</p>}
          <button type="submit" disabled={status === "loading"} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-ink disabled:opacity-70">
            {status === "loading" && <Loader2 size={13} className="animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-lavender/40 bg-white p-6">
        <h2 className="mb-2 text-sm font-semibold text-ink">Store Info</h2>
        <p className="text-sm text-ink/60">
          Little Gift Shop · Lahore, Pakistan · support@littlegiftshop.com
        </p>
        <p className="mt-2 text-xs text-primary/50">
          To change store-wide details (name, contact info, shipping rules), edit the values in
          <code className="mx-1 rounded bg-lavender-light px-1 py-0.5">components/Footer.js</code>
          and the checkout/cart shipping logic directly — there isn&apos;t a dedicated settings
          table for these yet.
        </p>
      </div>
    </div>
  );
}
