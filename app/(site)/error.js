"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function SiteError({ error, reset }) {
  useEffect(() => {
    console.error("Storefront error:", error);
  }, [error]);

  return (
    <section className="container-x flex flex-col items-center justify-center gap-4 py-28 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle size={26} />
      </span>
      <h1 className="font-heading text-2xl font-semibold text-primary-dark">Something Went Wrong</h1>
      <p className="max-w-sm text-sm text-ink/60">
        We couldn&apos;t load this page — it might be a temporary connection issue. Please try again.
      </p>
      <button onClick={reset} className="btn-primary mt-2">
        Try Again
      </button>
    </section>
  );
}
