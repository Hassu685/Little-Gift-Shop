import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true, name: true, email: true, phone: true, createdAt: true,
      orders: {
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!user) return NextResponse.json({ error: "Customer not found." }, { status: 404 });
  return NextResponse.json({ customer: user });
}
