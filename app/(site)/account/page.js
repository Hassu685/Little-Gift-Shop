import Link from "next/link";
import { Package, Heart, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();

  const [orderCount, wishlistCount] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.wishlist
      .findUnique({ where: { userId: user.id }, include: { items: true } })
      .then((w) => w?.items.length || 0),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary/10 bg-white p-6 shadow-card">
        <h2 className="font-heading text-lg font-semibold text-primary-dark">Account Details</h2>
        <div className="mt-3 space-y-1 text-sm text-ink/70">
          <p><span className="text-ink/50">Name:</span> {user.name}</p>
          <p><span className="text-ink/50">Email:</span> {user.email}</p>
          {user.phone && <p><span className="text-ink/50">Phone:</span> {user.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/account/orders"
          className="group flex items-center justify-between rounded-2xl border border-primary/10 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lavender-light text-primary">
              <Package size={18} />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-ink">{orderCount} Orders</p>
              <p className="text-xs text-ink/50">View order history</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-primary/40 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/account/wishlist"
          className="group flex items-center justify-between rounded-2xl border border-primary/10 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lavender-light text-primary">
              <Heart size={18} />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-ink">{wishlistCount} Saved Items</p>
              <p className="text-xs text-ink/50">View your wishlist</p>
            </div>
          </div>
          <ArrowRight size={16} className="text-primary/40 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
