import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <section className="container-x flex flex-col items-center justify-center gap-4 py-28 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <ShieldAlert size={26} />
      </span>
      <h1 className="font-heading text-3xl font-semibold text-primary-dark">403 — Access Denied</h1>
      <p className="max-w-sm text-sm text-ink/60">
        You don&apos;t have permission to view this page.
      </p>
      <Link href="/" className="btn-primary mt-2">
        Back to Home
      </Link>
    </section>
  );
}
