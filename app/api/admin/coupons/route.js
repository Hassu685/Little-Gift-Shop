import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  const coupons = await prisma.coupon.findMany({ orderBy: { code: "asc" } });
  return NextResponse.json({ coupons });
}

export async function POST(request) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const { code, discountType, discountValue, minimumOrder, expiresAt, isActive } = await request.json();
  if (!code || !discountType || !discountValue) {
    return NextResponse.json({ error: "Code, discount type and value are required." }, { status: 400 });
  }

  const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (existing) {
    return NextResponse.json({ error: "A coupon with this code already exists." }, { status: 409 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      minimumOrder: minimumOrder ? parseFloat(minimumOrder) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: isActive !== false,
    },
  });
  return NextResponse.json({ coupon }, { status: 201 });
}
