"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthShell, FormField } from "@/components/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to view your orders and wishlist.">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Email" type="email" name="email" value={form.email} onChange={onChange} required />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
        />
        <div className="text-right">
          <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
          {loading && <Loader2 size={15} className="animate-spin" />}
          Sign In
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        New here?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
