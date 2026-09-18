"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import Toast from "./Toast";

export default function ProductPurchasePanel({ product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);
  const wishlisted = isWishlisted(product.id);

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  const clampQuantity = (n) => Math.max(1, Math.min(product.stock, n));

  const handleAddToCart = async () => {
    await addItem(product, quantity);
    setToast("Added to cart");
  };

  const handleBuyNow = async () => {
    await addItem(product, quantity);
    router.push("/checkout");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-primary/20">
          <button
            onClick={() => setQuantity((q) => clampQuantity(q - 1))}
            className="flex h-10 w-10 items-center justify-center text-primary disabled:opacity-30"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => clampQuantity(q + 1))}
            className="flex h-10 w-10 items-center justify-center text-primary disabled:opacity-30"
            disabled={quantity >= product.stock}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <span
          className={`text-xs font-medium ${
            !inStock ? "text-red-500" : lowStock ? "text-amber-600" : "text-emerald-600"
          }`}
        >
          {!inStock ? "Out of Stock" : lowStock ? `Only ${product.stock} left` : "In Stock"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={15} /> Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className="btn-outline flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap size={15} /> Buy Now
        </button>
        <button
          onClick={() => toggle(product)}
          aria-label="Toggle wishlist"
          aria-pressed={wishlisted}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 text-ink/60 transition-colors hover:text-pink"
        >
          <Heart size={17} className={wishlisted ? "text-pink" : ""} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
