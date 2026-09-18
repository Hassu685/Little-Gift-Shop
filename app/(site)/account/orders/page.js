import Image from "next/image";
import { Package } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/utils/format";

const statusStyles = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-sky-50 text-sky-700",
  PROCESSING: "bg-sky-50 text-sky-700",
  SHIPPED: "bg-primary/10 text-primary",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-600",
};

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: { include: { images: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary/20 py-16 text-center">
        <Package size={28} className="text-primary/40" />
        <p className="text-sm text-ink/60">You haven&apos;t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <div key={order.id} className="rounded-2xl border border-primary/10 bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/10 pb-3">
            <div>
              <p className="font-heading text-sm font-semibold text-ink">
                Order #{order.id.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-ink/50">
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: "numeric", month: "short", day: "numeric",
                })}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
              {order.status}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-lavender-light">
                  <Image
                    src={item.product?.images?.[0]?.url || "/images/placeholder-product.jpg"}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-sm text-ink/70">
                  {item.product?.name} × {item.quantity}
                </div>
                <span className="text-sm font-medium text-ink">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex justify-end border-t border-primary/10 pt-3 text-sm font-semibold text-primary-dark">
            Total: {formatPrice(order.total)}
          </div>
        </div>
      ))}
    </div>
  );
}
