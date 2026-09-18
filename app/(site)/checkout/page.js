"use client";

import { useState } from "react";
import { Loader2, Tag, CheckCircle2, Truck, Banknote } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/utils/format";
import { FormField } from "@/components/AuthShell";

export default function CheckoutPage() {
  const { items, subtotal, ready, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    shippingName: user?.name || "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingPostalCode: "",
    paymentMethod: "Cash on Delivery",
  });
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const discount = coupon?.discount || 0;
  const shipping = subtotal - discount > 50 || items.length === 0 ? 0 : 5;
  const total = Math.max(0, subtotal - discount + shipping);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const applyCoupon = async () => {
    setCouponError("");
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCoupon(data);
    } catch (err) {
      setCoupon(null);
      setCouponError(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          couponCode: coupon?.code,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place order.");
      setConfirmedOrder(data.order);
      await clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (!ready) {
    return <div className="container-x py-24 text-center text-sm text-ink/50">Loading…</div>;
  }

  if (confirmedOrder) {
    return (
      <section className="container-x flex flex-col items-center justify-center gap-4 py-28 text-center">
        <CheckCircle2 size={44} className="text-emerald-500" />
        <h1 className="font-heading text-2xl font-semibold text-primary-dark">Order Placed!</h1>
        <p className="max-w-sm text-sm text-ink/60">
          Thank you — your order <span className="font-medium text-ink">#{confirmedOrder.id.slice(-8).toUpperCase()}</span> has
          been received and is being prepared with care.
        </p>
        <a href="/shop" className="btn-primary mt-2">Continue Shopping</a>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="container-x flex flex-col items-center justify-center gap-4 py-28 text-center">
        <h1 className="font-heading text-2xl font-semibold text-primary-dark">Nothing to check out</h1>
        <p className="text-sm text-ink/60">Your cart is empty.</p>
        <a href="/shop" className="btn-primary mt-2">Browse Gifts</a>
      </section>
    );
  }

  return (
    <section className="container-x py-12 lg:py-16">
      <h1 className="font-heading text-3xl font-semibold text-primary-dark">Checkout</h1>

      <form onSubmit={placeOrder} className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-heading text-lg font-semibold text-primary-dark">Shipping Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Full Name" name="shippingName" value={form.shippingName} onChange={onChange} required />
              <FormField label="Phone" name="shippingPhone" value={form.shippingPhone} onChange={onChange} required />
              <div className="sm:col-span-2">
                <FormField label="Address" name="shippingAddress" value={form.shippingAddress} onChange={onChange} required />
              </div>
              <FormField label="City" name="shippingCity" value={form.shippingCity} onChange={onChange} required />
              <FormField
                label="Postal Code"
                name="shippingPostalCode"
                value={form.shippingPostalCode}
                onChange={onChange}
                required
              />
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-card">
            <h2 className="mb-4 font-heading text-lg font-semibold text-primary-dark">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-primary/15 p-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === "Cash on Delivery"}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: "Cash on Delivery" }))}
                  className="accent-primary"
                />
                <Banknote size={17} className="text-primary" />
                <span className="text-sm">Cash on Delivery</span>
              </label>
              <label className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-primary/10 p-3 opacity-50">
                <input type="radio" disabled className="accent-primary" />
                <Truck size={17} />
                <span className="text-sm">Online Payment — coming soon</span>
              </label>
            </div>
          </div>
        </div>

        <div className="h-fit space-y-4 rounded-2xl border border-primary/10 bg-white p-6 shadow-card">
          <h2 className="font-heading text-lg font-semibold text-primary-dark">Order Summary</h2>

          <div className="max-h-48 space-y-2 overflow-y-auto text-sm text-ink/70">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between">
                <span>{i.product?.name} × {i.quantity}</span>
                <span>{formatPrice((i.product?.price || 0) * i.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="w-full rounded-lg border border-primary/15 py-2 pl-8 pr-2 text-xs outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={applyCoupon}
              disabled={couponLoading || !couponCode}
              className="rounded-lg bg-primary px-3 text-xs font-medium text-white disabled:opacity-50"
            >
              {couponLoading ? <Loader2 size={13} className="animate-spin" /> : "Apply"}
            </button>
          </div>
          {couponError && <p className="text-xs text-red-500">{couponError}</p>}
          {coupon && <p className="text-xs text-emerald-600">Coupon &quot;{coupon.code}&quot; applied!</p>}

          <div className="space-y-2 border-t border-primary/10 pt-4 text-sm text-ink/70">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span><span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
          </div>
          <div className="flex justify-between border-t border-primary/10 pt-4 font-heading text-base font-semibold text-primary-dark">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button type="submit" disabled={placing} className="btn-primary w-full disabled:opacity-70">
            {placing && <Loader2 size={15} className="animate-spin" />}
            Place Order
          </button>
        </div>
      </form>
    </section>
  );
}
