"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle size={22} />
      </span>
      <h1 className="text-lg font-semibold text-ink">Something went wrong</h1>
      <p className="max-w-sm text-sm text-ink/60">
        This section couldn&apos;t load — likely a database connection issue. Try again, or check
        your Neon connection.
      </p>
      <button onClick={reset} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-ink">
        Try Again
      </button>
    </div>
  );
}
