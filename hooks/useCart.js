"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";

const CartContext = createContext(null);
const STORAGE_KEY = "lgs_guest_cart";

function readGuestCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeGuestCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Normalize both DB cart items ({ productId, quantity, product }) and
// guest cart items ({ productId, quantity, product }) into one shape.
export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const mergedRef = useRef(false);

  const loadDbCart = useCallback(async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(
      data.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        product: i.product,
      }))
    );
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setItems(readGuestCart());
      setReady(true);
      return;
    }

    // Logged in: merge any guest cart into the DB cart once, then load from DB.
    const guestItems = readGuestCart();
    (async () => {
      if (guestItems.length && !mergedRef.current) {
        mergedRef.current = true;
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merge: guestItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          }),
        });
        localStorage.removeItem(STORAGE_KEY);
      }
      await loadDbCart();
      setReady(true);
    })();
  }, [user, authLoading, loadDbCart]);

  const addItem = async (product, quantity = 1) => {
    if (!user) {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === product.id);
        const next = existing
          ? prev.map((i) =>
              i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
            )
          : [...prev, { productId: product.id, quantity, product }];
        writeGuestCart(next);
        return next;
      });
      return;
    }
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity }),
    });
    await loadDbCart();
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) {
      setItems((prev) => {
        const next =
          quantity <= 0
            ? prev.filter((i) => i.productId !== productId)
            : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i));
        writeGuestCart(next);
        return next;
      });
      return;
    }
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    await loadDbCart();
  };

  const removeItem = async (productId) => updateQuantity(productId, 0);

  const clearCart = async () => {
    if (!user) {
      setItems([]);
      writeGuestCart([]);
      return;
    }
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clear: true }),
    });
    setItems([]);
  };

  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, ready, addItem, updateQuantity, removeItem, clearCart, subtotal, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
