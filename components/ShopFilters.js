"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search, Star } from "lucide-react";

export default function ShopFilters({ categories, occasions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [q, setQ] = useState(searchParams.get("q") || "");

  const current = {
    category: searchParams.get("category") || "",
    occasion: searchParams.get("occasion") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
    sort: searchParams.get("sort") || "newest",
  };

  const applyParam = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    applyParam("q", q);
  };

  const clearAll = () => {
    setQ("");
    router.push(pathname);
  };

  const FilterBody = (
    <div className="space-y-7">
      <form onSubmit={submitSearch} className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-full border border-primary/15 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary"
        />
      </form>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">Category</h4>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input
                type="radio"
                name="category"
                checked={current.category === c.slug}
                onChange={() => applyParam("category", c.slug)}
                className="accent-primary"
              />
              {c.name}
            </label>
          ))}
          {current.category && (
            <button onClick={() => applyParam("category", "")} className="text-xs text-primary underline">
              Clear category
            </button>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">Occasion</h4>
        <div className="space-y-2">
          {occasions.map((o) => (
            <label key={o.slug} className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
              <input
                type="radio"
                name="occasion"
                checked={current.occasion === o.slug}
                onChange={() => applyParam("occasion", o.slug)}
                className="accent-primary"
              />
              {o.name}
            </label>
          ))}
          {current.occasion && (
            <button onClick={() => applyParam("occasion", "")} className="text-xs text-primary underline">
              Clear occasion
            </button>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">Price</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={current.minPrice}
            onBlur={(e) => applyParam("minPrice", e.target.value)}
            className="w-full rounded-lg border border-primary/15 px-2.5 py-1.5 text-xs outline-none focus:border-primary"
          />
          <span className="text-ink/40">–</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={current.maxPrice}
            onBlur={(e) => applyParam("maxPrice", e.target.value)}
            className="w-full rounded-lg border border-primary/15 px-2.5 py-1.5 text-xs outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink/50">Rating</h4>
        <div className="space-y-2">
          {[4, 3].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-1.5 text-sm text-ink/70">
              <input
                type="radio"
                name="rating"
                checked={current.minRating === String(r)}
                onChange={() => applyParam("minRating", String(r))}
                className="accent-primary"
              />
              {Array.from({ length: r }).map((_, i) => (
                <Star key={i} size={12} className="text-gold" fill="currentColor" />
              ))}
              <span className="ml-1">&amp; up</span>
            </label>
          ))}
          {current.minRating && (
            <button onClick={() => applyParam("minRating", "")} className="text-xs text-primary underline">
              Clear rating
            </button>
          )}
        </div>
      </div>

      <button onClick={clearAll} className="btn-outline w-full text-xs">
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">{FilterBody}</aside>

      {/* Mobile trigger + drawer */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-full border border-primary/20 px-4 py-2 text-sm font-medium text-primary lg:hidden"
      >
        <SlidersHorizontal size={14} /> Filters
      </button>

      {drawerOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-primary-dark/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-primary-dark">Filters</h3>
              <button onClick={() => setDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>
            {FilterBody}
          </div>
        </div>
      )}
    </>
  );
}

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "newest";

  const onChange = (e) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-ink/50">Sort by</label>
      <select
        value={sort}
        onChange={onChange}
        className="rounded-lg border border-primary/15 px-2 py-1.5 text-xs outline-none focus:border-primary"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name</option>
      </select>
    </div>
  );
}
