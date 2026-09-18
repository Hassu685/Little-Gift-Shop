import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  const { discountType, discountValue, minimumOrder, expiresAt, isActive } = await request.json();
  const coupon = await prisma.coupon.update({
    where: { id: params.id },
    data: {
      ...(discountType !== undefined && { discountType }),
      ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
      ...(minimumOrder !== undefined && { minimumOrder: minimumOrder ? parseFloat(minimumOrder) : null }),
      ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      ...(isActive !== undefined && { isActive: !!isActive }),
    },
  });
  return NextResponse.json({ coupon });
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  await prisma.coupon.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
