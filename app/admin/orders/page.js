"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/utils/format";

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-sky-50 text-sky-700",
  PROCESSING: "bg-sky-50 text-sky-700",
  SHIPPED: "bg-lavender-light text-primary-dark",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders${status ? `?status=${status}` : ""}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, [status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-ink">Orders</h1>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-lavender/40 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-lavender/40 bg-lavender-light text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-primary/50"><Loader2 className="mx-auto animate-spin" size={18} /></td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-primary/50">No orders found.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-lavender-light last:border-0 hover:bg-lavender-light">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-ink hover:text-primary">
                      #{o.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink/75">{o.user?.name || o.shippingName}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {new Date(o.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-ink/60">{o.items.length}</td>
                  <td className="px-4 py-3 font-medium text-ink">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3 text-ink/60">{o.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[o.status]}`}>{o.status}</span>
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
