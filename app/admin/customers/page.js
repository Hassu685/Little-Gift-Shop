"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { formatPrice } from "@/utils/format";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/customers?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setCustomers(data.customers || []);
    setLoading(false);
  }, [q]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <h1 className="mb-5 font-heading text-2xl font-semibold text-ink">Customers</h1>

      <div className="relative mb-4 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full rounded-lg border border-lavender/40 bg-white py-2 pl-8 pr-3 text-sm outline-none focus:border-primary/50"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-lavender/40 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-lavender/40 bg-lavender-light text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total Spent</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-primary/50"><Loader2 className="mx-auto animate-spin" size={18} /></td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-primary/50">No customers found.</td></tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-b border-lavender-light last:border-0 hover:bg-lavender-light">
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-medium text-ink hover:text-primary">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{c.email}</td>
                  <td className="px-4 py-3 text-ink/60">{c.orderCount}</td>
                  <td className="px-4 py-3 font-medium text-ink">{formatPrice(c.totalSpent)}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {new Date(c.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
