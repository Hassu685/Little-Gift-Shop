"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";

const WishlistContext = createContext(null);
const STORAGE_KEY = "lgs_guest_wishlist";

function readGuestWishlist() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeGuestWishlist(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const mergedRef = useRef(false);

  const loadDbWishlist = useCallback(async () => {
    const res = await fetch("/api/wishlist");
    const data = await res.json();
    setItems(data.items.map((i) => ({ productId: i.productId, product: i.product })));
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setItems(readGuestWishlist());
      return;
    }

    const guestItems = readGuestWishlist();
    (async () => {
      if (guestItems.length && !mergedRef.current) {
        mergedRef.current = true;
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ merge: guestItems.map((i) => i.productId) }),
        });
        localStorage.removeItem(STORAGE_KEY);
      }
      await loadDbWishlist();
    })();
  }, [user, authLoading, loadDbWishlist]);

  const isWishlisted = (productId) => items.some((i) => i.productId === productId);

  const toggle = async (product) => {
    const already = isWishlisted(product.id);

    if (!user) {
      setItems((prev) => {
        const next = already
          ? prev.filter((i) => i.productId !== product.id)
          : [...prev, { productId: product.id, product }];
        writeGuestWishlist(next);
        return next;
      });
      return !already;
    }

    if (already) {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
    } else {
      await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
    }
    await loadDbWishlist();
    return !already;
  };

  return (
    <WishlistContext.Provider value={{ items, isWishlisted, toggle, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
