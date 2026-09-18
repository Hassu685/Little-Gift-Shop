"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/utils/format";

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export default function AdminOrderDetailPage({ params }) {
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => {
    fetch(`/api/admin/orders/${id}`).then((r) => r.json()).then((d) => setOrder(d.order));
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (field, value) => {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    load();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!order) {
    return <p className="text-sm text-primary/50"><Loader2 className="inline animate-spin" size={14} /> Loading order…</p>;
  }

  return (
    <div>
      <Link href="/admin/orders" className="mb-4 flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink">
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-ink">Order #{order.id.slice(-8).toUpperCase()}</h1>
        {saved && <span className="flex items-center gap-1 text-xs text-emerald-600"><CheckCircle2 size={13} /> Saved</span>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-lavender/40 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-lavender-light">
                    {item.product?.images?.[0] && (
                      <Image src={item.product.images[0].url} alt={item.product.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 text-sm text-ink">{item.product?.name} × {item.quantity}</div>
                  <span className="text-sm font-medium text-ink">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-lavender-light pt-4 text-sm">
              <div className="flex justify-between text-ink/60"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between text-ink/60"><span>Shipping</span><span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span></div>
              <div className="flex justify-between text-base font-semibold text-ink"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          <div className="rounded-xl border border-lavender/40 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Shipping Address</h2>
            <div className="space-y-1 text-sm text-ink/75">
              <p>{order.shippingName}</p>
              <p>{order.shippingPhone}</p>
              <p>{order.shippingAddress}, {order.shippingCity} {order.shippingPostalCode}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-lavender/40 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Customer</h2>
            <p className="text-sm text-ink/75">{order.user?.name || order.shippingName}</p>
            {order.user?.email && <p className="text-sm text-ink/60">{order.user.email}</p>}
          </div>

          <div className="rounded-xl border border-lavender/40 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Order Status</h2>
            <select
              value={order.status}
              disabled={saving}
              onChange={(e) => updateStatus("status", e.target.value)}
              className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
            >
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="rounded-xl border border-lavender/40 bg-white p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Payment</h2>
            <p className="mb-2 text-sm text-ink/60">{order.paymentMethod}</p>
            <select
              value={order.paymentStatus}
              disabled={saving}
              onChange={(e) => updateStatus("paymentStatus", e.target.value)}
              className="w-full rounded-lg border border-lavender/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
            >
              {paymentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
