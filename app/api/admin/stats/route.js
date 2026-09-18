import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalRevenueAgg,
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    completedOrders,
    lowStockProducts,
    recentOrders,
    topProductLines,
    categorySales,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
    prisma.order.findMany({ where: { createdAt: { gte: sixMonthsAgo } }, select: { createdAt: true, total: true, status: true } }),
    prisma.orderItem.groupBy({ by: ["productId"], _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 5 }),
    prisma.orderItem.findMany({
      include: { product: { include: { category: true } } },
    }),
  ]);

  // Revenue + orders by month (last 6 months) — built from real order rows
  const monthly = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" });
    monthly[key] = { month: key, revenue: 0, orders: 0 };
  }
  for (const order of recentOrders) {
    const key = order.createdAt.toLocaleString("en-US", { month: "short", year: "2-digit" });
    if (monthly[key]) {
      monthly[key].revenue += order.total;
      monthly[key].orders += 1;
    }
  }

  // Top products (join names from productId groupBy)
  const topProductIds = topProductLines.map((l) => l.productId);
  const topProductsInfo = await prisma.product.findMany({ where: { id: { in: topProductIds } } });
  const topProducts = topProductLines.map((l) => ({
    name: topProductsInfo.find((p) => p.id === l.productId)?.name || "Unknown",
    unitsSold: l._sum.quantity,
  }));

  // Sales by category
  const categoryTotals = {};
  for (const line of categorySales) {
    const name = line.product?.category?.name || "Uncategorized";
    categoryTotals[name] = (categoryTotals[name] || 0) + line.price * line.quantity;
  }
  const salesByCategory = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }));

  return NextResponse.json({
    totalRevenue: totalRevenueAgg._sum.total || 0,
    totalOrders,
    totalProducts,
    totalCustomers,
    pendingOrders,
    completedOrders,
    lowStockProducts,
    revenueOverview: Object.values(monthly),
    topProducts,
    salesByCategory,
  });
}
