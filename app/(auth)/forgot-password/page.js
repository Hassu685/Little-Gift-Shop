"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { AuthShell, FormField } from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [devUrl, setDevUrl] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.devResetUrl) setDevUrl(data.devResetUrl);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <AuthShell title="Check Your Email">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 size={36} className="text-primary" />
          <p className="text-sm text-ink/70">
            If an account exists for that email, we&apos;ve sent a link to reset your password.
          </p>
          {devUrl && (
            <div className="mt-3 w-full rounded-xl bg-lavender-light p-3 text-left text-xs">
              <p className="mb-1 font-medium text-ink/60">Dev mode — no email provider configured:</p>
              <Link href={devUrl} className="break-all text-primary underline">
                {devUrl}
              </Link>
            </div>
          )}
          <Link href="/login" className="btn-outline mt-2">
            Back to Sign In
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset Your Password" subtitle="Enter your email and we'll send you a reset link.">
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-70">
          {status === "loading" && <Loader2 size={15} className="animate-spin" />}
          Send Reset Link
        </button>
      </form>
    </AuthShell>
  );
}
