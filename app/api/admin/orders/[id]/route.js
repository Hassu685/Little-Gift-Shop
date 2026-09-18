import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { product: { include: { images: true } } } },
    },
  });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const { status, paymentStatus } = await request.json();
  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
    },
  });
  return NextResponse.json({ order });
}
