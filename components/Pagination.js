"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i + 1)}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
            page === i + 1 ? "bg-primary text-white" : "text-ink/60 hover:bg-lavender-light"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
