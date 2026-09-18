import Link from "next/link";
import { Gift } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-x flex flex-col items-center justify-center gap-4 py-28 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lavender-light text-primary">
        <Gift size={26} />
      </span>
      <h1 className="font-heading text-3xl font-semibold text-primary-dark">Page Not Found</h1>
      <p className="max-w-sm text-sm text-ink/60">
        We couldn&apos;t find what you were looking for — it may have been moved or no longer exists.
      </p>
      <Link href="/shop" className="btn-primary mt-2">
        Continue Shopping
      </Link>
    </section>
  );
}
