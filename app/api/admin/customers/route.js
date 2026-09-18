import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(request) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  const users = await prisma.user.findMany({
    where: {
      role: "USER",
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    include: { orders: { select: { total: true } } },
    orderBy: { createdAt: "desc" },
  });

  const customers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    createdAt: u.createdAt,
    orderCount: u.orders.length,
    totalSpent: u.orders.reduce((s, o) => s + o.total, 0),
  }));

  return NextResponse.json({ customers });
}
