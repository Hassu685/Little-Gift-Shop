"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/format";

export default function CartPage() {
  const { items, ready, updateQuantity, removeItem, subtotal } = useCart();

  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5;
  const total = subtotal + shipping;

  if (!ready) {
    return <div className="container-x py-24 text-center text-sm text-ink/50">Loading your cart…</div>;
  }

  if (items.length === 0) {
    return (
      <section className="container-x flex flex-col items-center justify-center gap-4 py-28 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lavender-light text-primary">
          <ShoppingBag size={26} />
        </span>
        <h1 className="font-heading text-2xl font-semibold text-primary-dark">Your cart is empty</h1>
        <p className="max-w-sm text-sm text-ink/60">
          Looks like you haven&apos;t added any gifts yet — let&apos;s find something thoughtful.
        </p>
        <Link href="/shop" className="btn-primary mt-2">
          Browse Gifts
        </Link>
      </section>
    );
  }

  return (
    <section className="container-x py-12 lg:py-16">
      <h1 className="font-heading text-3xl font-semibold text-primary-dark">Your Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-2xl border border-primary/10 bg-white p-4 shadow-card"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-lavender-light">
                <Image
                  src={item.product?.images?.[0]?.url || "/images/placeholder-product.jpg"}
                  alt={item.product?.name || "Product"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/shop/${item.product?.slug}`}
                    className="font-heading text-sm font-semibold text-ink hover:text-primary"
                  >
                    {item.product?.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remove item"
                    className="text-ink/40 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-primary/20">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-primary"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-primary"
                      aria-label="Increase quantity"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="font-heading text-sm font-semibold text-primary-dark">
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-primary/10 bg-white p-6 shadow-card">
          <h2 className="font-heading text-lg font-semibold text-primary-dark">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-ink/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-primary/10 pt-4 font-heading text-base font-semibold text-primary-dark">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Checkout <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
