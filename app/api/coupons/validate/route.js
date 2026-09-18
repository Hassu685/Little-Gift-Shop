import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const { code, subtotal } = await request.json();

  if (!code) {
    return NextResponse.json({ error: "Enter a coupon code." }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.isActive) {
    return NextResponse.json({ error: "This coupon code is invalid." }, { status: 404 });
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
  }
  if (coupon.minimumOrder && subtotal < coupon.minimumOrder) {
    return NextResponse.json(
      { error: `This coupon requires a minimum order of $${coupon.minimumOrder.toFixed(2)}.` },
      { status: 400 }
    );
  }

  const discount =
    coupon.discountType === "PERCENTAGE"
      ? Number(((subtotal * coupon.discountValue) / 100).toFixed(2))
      : Math.min(coupon.discountValue, subtotal);

  return NextResponse.json({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount,
  });
}
