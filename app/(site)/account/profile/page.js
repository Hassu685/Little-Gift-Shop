"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FormField } from "@/components/AuthShell";

export default function ProfilePage() {
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
    <div className="max-w-md rounded-2xl border border-primary/10 bg-white p-6 shadow-card">
      <h2 className="font-heading text-lg font-semibold text-primary-dark">Edit Profile</h2>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <FormField
          label="Full Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink/70">Email</span>
          <input
            value={user.email}
            disabled
            className="w-full rounded-xl border border-primary/10 bg-lavender-light/50 px-4 py-2.5 text-sm text-ink/50"
          />
        </label>
        <FormField
          label="Phone"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />

        {error && <p className="text-xs text-red-500">{error}</p>}
        {status === "success" && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle2 size={13} /> Profile updated
          </p>
        )}

        <button type="submit" disabled={status === "loading"} className="btn-primary disabled:opacity-70">
          {status === "loading" && <Loader2 size={14} className="animate-spin" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
