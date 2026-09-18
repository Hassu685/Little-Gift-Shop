"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthShell, FormField } from "@/components/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create Your Account" subtitle="Join us for faster checkout and order tracking.">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Full Name" name="name" value={form.name} onChange={onChange} required />
        <FormField label="Email" type="email" name="email" value={form.email} onChange={onChange} required />
        <FormField label="Phone (optional)" name="phone" value={form.phone} onChange={onChange} />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
          minLength={8}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
          {loading && <Loader2 size={15} className="animate-spin" />}
          Create Account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
