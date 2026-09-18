"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/format";

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary/20 py-16 text-center">
        <Heart size={28} className="text-primary/40" />
        <p className="text-sm text-ink/60">Your wishlist is empty.</p>
        <Link href="/shop" className="btn-primary mt-1 text-xs">Browse Gifts</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map(({ product }) => (
        <div key={product.id} className="flex gap-4 rounded-2xl border border-primary/10 bg-white p-4 shadow-card">
          <Link href={`/shop/${product.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-lavender-light">
            <Image
              src={product.images?.[0]?.url || "/images/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </Link>
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex items-start justify-between">
              <Link href={`/shop/${product.slug}`} className="font-heading text-sm font-semibold text-ink hover:text-primary">
                {product.name}
              </Link>
              <button onClick={() => toggle(product)} aria-label="Remove from wishlist" className="text-ink/40 hover:text-red-500">
                <Trash2 size={15} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-semibold text-primary-dark">
                {formatPrice(product.price)}
              </span>
              <button
                onClick={() => addItem(product, 1)}
                className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
              >
                <ShoppingCart size={12} /> Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
