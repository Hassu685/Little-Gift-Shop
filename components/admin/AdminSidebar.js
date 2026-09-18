"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, FolderTree, Gift, ShoppingCart, Users,
  Star, Ticket, Newspaper, Mail, MessageSquare, Settings, X,
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/occasions", label: "Occasions", icon: Gift },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();

  const isActive = (link) => (link.exact ? pathname === link.href : pathname.startsWith(link.href));

  const Nav = (
    <nav className="flex flex-col gap-0.5 p-3">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onClose}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            isActive(l)
              ? "bg-primary text-white shadow-soft"
              : "text-ink/75 hover:bg-lavender-light hover:text-primary"
          }`}
        >
          <l.icon size={16} />
          {l.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-lavender/40 bg-white lg:block">
        <div className="flex h-16 items-center gap-2.5 border-b border-lavender/40 px-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white shadow-soft">
            LG
          </span>
          <span className="font-heading text-lg font-semibold text-ink">Admin Panel</span>
        </div>
        {Nav}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full w-64 overflow-y-auto bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-lavender/40 px-5">
              <span className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white shadow-soft">
                  LG
                </span>
                <span className="font-heading text-lg font-semibold text-ink">Admin Panel</span>
              </span>
              <button onClick={onClose} aria-label="Close menu" className="text-ink/60 hover:text-primary">
                <X size={18} />
              </button>
            </div>
            {Nav}
          </div>
        </div>
      )}
    </>
  );
}
