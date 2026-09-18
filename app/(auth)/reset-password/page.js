"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthShell, FormField } from "@/components/AuthShell";

function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="text-sm text-red-500">This reset link is missing or invalid.</p>;
  }

  if (success) {
    return <p className="text-sm text-emerald-600">Password updated — redirecting to sign in…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        label="New Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={8}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-70">
        {loading && <Loader2 size={15} className="animate-spin" />}
        Update Password
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Set a New Password">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
