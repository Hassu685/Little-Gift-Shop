"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/utils/format";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

export default function ProductCard({ product, onAddToCart, onToggleWishlist }) {
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const image = product.images?.[0]?.url || "/images/placeholder-product.jpg";
  const rating = product.avgRating ?? 4.8;
  const reviewCount = product.reviewCount ?? 0;
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(100 - (product.price / product.comparePrice) * 100)
      : null;

  const toggleWishlist = async () => {
    await toggle(product);
    onToggleWishlist?.(product);
  };

  const handleAddToCart = async () => {
    await addItem(product, 1);
    onAddToCart?.(product);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-square overflow-hidden bg-lavender-light">
        <Link href={`/shop/${product.slug}`}>
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            New
          </span>
        )}

        <button
          onClick={toggleWishlist}
          aria-label="Toggle wishlist"
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink/60 shadow-sm transition-all hover:scale-110 hover:text-pink"
        >
          <Heart
            size={15}
            className={wishlisted ? "text-pink" : ""}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Link
          href={`/shop/${product.slug}`}
          className="line-clamp-2 min-h-[40px] font-heading text-[15px] font-semibold text-ink hover:text-primary"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-xs text-ink/50">
          <Star size={12} className="text-gold" fill="currentColor" />
          <span className="font-medium text-ink/70">{rating}</span>
          <span>({reviewCount})</span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <span className="font-heading text-base font-semibold text-primary-dark">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && (
            <span className="text-xs text-ink/40 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
          {discount && (
            <span className="text-xs font-medium text-emerald-600">-{discount}%</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="mt-auto flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-primary-dark active:scale-95"
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}