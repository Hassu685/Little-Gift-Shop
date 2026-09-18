"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatPrice } from "@/utils/format";

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-sky-50 text-sky-700",
  PROCESSING: "bg-sky-50 text-sky-700",
  SHIPPED: "bg-lavender-light text-primary-dark",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-600",
};

export default function AdminCustomerDetailPage({ params }) {
  const { id } = params;
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/customers/${id}`).then((r) => r.json()).then((d) => setCustomer(d.customer));
  }, [id]);

  if (!customer) {
    return <p className="text-sm text-primary/50"><Loader2 className="inline animate-spin" size={14} /> Loading customer…</p>;
  }

  const totalSpent = customer.orders.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <Link href="/admin/customers" className="mb-4 flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
        <ArrowLeft size={14} /> Back to Customers
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-lavender/40 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink">Customer Details</h2>
          <div className="space-y-1 text-sm text-ink/75">
            <p className="font-medium text-ink">{customer.name}</p>
            <p>{customer.email}</p>
            {customer.phone && <p>{customer.phone}</p>}
            <p className="text-primary/50">
              Joined {new Date(customer.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-lavender-light pt-4">
            <div>
              <p className="text-lg font-semibold text-ink">{customer.orders.length}</p>
              <p className="text-xs text-primary/50">Orders</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-ink">{formatPrice(totalSpent)}</p>
              <p className="text-xs text-primary/50">Total Spent</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-ink">Order History</h2>
          {customer.orders.length === 0 ? (
            <p className="text-sm text-primary/50">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {customer.orders.map((o) => (
                <div key={o.id} className="rounded-xl border border-lavender/40 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-ink hover:text-primary">
                      #{o.id.slice(-8).toUpperCase()}
                    </Link>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[o.status]}`}>{o.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-primary/50">
                    {new Date(o.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">{formatPrice(o.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
