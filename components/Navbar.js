"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Home as HomeIcon,
  Store,
  PartyPopper,
  Info,
  Mail,
  LogIn,
  LayoutDashboard,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/occasions", label: "Occasions", icon: PartyPopper },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const searchInputRef = useRef(null);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    // Throttled with rAF so we don't fire a state update on every scroll
    // pixel, and the threshold is raised so the header doesn't shrink the
    // instant you nudge the page — that's what made it feel like it went
    // "patli" (thin) abruptly.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Needed because createPortal requires document, which isn't available during SSR.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (menuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [menuOpen]);

  // Focus the input as soon as the search bar opens.
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Close the search bar on outside click or Escape.
  useEffect(() => {
    if (!searchOpen) return;

    const onClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  const submitSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  // The mobile drawer is portaled straight to <body>. It MUST live outside
  // <header>, because the header always carries backdrop-blur-*, and any
  // backdrop-filter/filter/transform on an ancestor creates a new CSS
  // containing block for position:fixed descendants. That was breaking the
  // drawer's "fixed + h-full" sizing (it was sizing itself against the
  // header's own small height instead of the viewport), so the white panel
  // only covered the top strip and the nav links spilled out over the page
  // with no background. Portaling to body sidesteps that entirely.
  const mobileMenu = (
    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-primary-dark/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed right-0 top-0 z-[80] h-[100dvh] w-[80%] max-w-xs overflow-y-auto bg-white p-6 shadow-2xl lg:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-primary-dark">Menu</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={submitSearch} className="relative mb-6">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full border border-primary/20 bg-lavender-light/50 py-2.5 pl-9 pr-4 text-sm text-ink outline-none focus:border-primary focus:bg-white"
              />
            </form>

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-lavender-light hover:text-primary"
                >
                  <link.icon size={18} className="text-primary/60" />
                  {link.label}
                </Link>
              ))}
              <Link
                href={user ? "/admin" : "/login"}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-lavender-light hover:text-primary"
              >
                {user ? <LayoutDashboard size={18} className="text-primary/60" /> : <LogIn size={18} className="text-primary/60" />}
                {user ? "Admin" : "Login"}
              </Link>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[padding,background-color,box-shadow,border-color] duration-500 ease-out ${scrolled
          ? "bg-white/90 backdrop-blur-md border-primary/10 py-2 shadow-sm"
          : "bg-white/70 backdrop-blur-sm border-transparent py-4"
        }`}
    >
      <div className="container-x flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-light text-primary transition-transform group-hover:-rotate-6">
            <Gift size={20} />
          </span>
          <span>
            <span className="block font-heading text-lg font-semibold leading-tight text-primary-dark">
              Little Gift Shop
            </span>
            <span className="block font-script text-sm leading-none text-primary/70">
              Small Gifts · Big Smiles
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-ink/80 transition-colors hover:text-primary group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <div ref={searchBoxRef} className="relative hidden sm:block">
            <AnimatePresence initial={false} mode="wait">
              {searchOpen ? (
                <motion.form
                  key="search-input"
                  onSubmit={submitSearch}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="relative overflow-hidden"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="h-9 w-full rounded-full border border-primary/20 bg-white py-2 pl-9 pr-8 text-sm text-ink outline-none focus:border-primary"
                  />
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary/50" />
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/40 hover:text-primary"
                  >
                    <X size={14} />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  key="search-toggle"
                  type="button"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-lavender-light hover:text-primary"
                >
                  <Search size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <Link
            href={user ? "/admin" : "/login"}
            aria-label="Admin"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-lavender-light hover:text-primary"
          >
            <User size={18} />
          </Link>
          <Link
            href="/account/wishlist"
            aria-label="Wishlist"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-lavender-light hover:text-primary"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 min-w-[18px] items-center justify-center rounded-full bg-pink px-1 text-[10px] font-semibold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-lavender-light hover:text-primary"
          >
            <motion.span
              key={cartCount}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.3 }}
              className="contents"
            >
              <ShoppingBag size={18} />
            </motion.span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/70 hover:bg-lavender-light hover:text-primary lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {mounted && createPortal(mobileMenu, document.body)}
    </header>
  );
}