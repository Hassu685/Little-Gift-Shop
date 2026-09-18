import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: { include: { images: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request) {
  const user = await getCurrentUser(); // may be null for guest checkout
  const body = await request.json();
  const {
    items, // [{ productId, quantity }]
    couponCode,
    paymentMethod,
    shippingName,
    shippingPhone,
    shippingAddress,
    shippingCity,
    shippingPostalCode,
  } = body;

  if (!items?.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (!shippingName || !shippingPhone || !shippingAddress || !shippingCity || !shippingPostalCode) {
    return NextResponse.json({ error: "All shipping fields are required." }, { status: 400 });
  }
  if (!paymentMethod) {
    return NextResponse.json({ error: "Select a payment method." }, { status: 400 });
  }

  // Re-fetch products server-side. Never trust client-submitted prices or stock.
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const line of items) {
    const product = productMap.get(line.productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ error: "One of the items in your cart is no longer available." }, { status: 400 });
    }
    if (product.stock < line.quantity) {
      return NextResponse.json(
        { error: `Only ${product.stock} left of "${product.name}". Please adjust the quantity.` },
        { status: 400 }
      );
    }
  }

  const subtotal = items.reduce((sum, line) => sum + productMap.get(line.productId).price * line.quantity, 0);

  let discount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (coupon && coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())) {
      if (!coupon.minimumOrder || subtotal >= coupon.minimumOrder) {
        discount =
          coupon.discountType === "PERCENTAGE"
            ? Number(((subtotal * coupon.discountValue) / 100).toFixed(2))
            : Math.min(coupon.discountValue, subtotal);
      }
    }
  }

  const shipping = subtotal - discount > 50 ? 0 : 5;
  const total = Number((subtotal - discount + shipping).toFixed(2));

  let order;
  try {
    order = await prisma.$transaction(
      async (tx) => {
        const created = await tx.order.create({
          data: {
            userId: user?.id || null,
            status: "PENDING",
            subtotal,
            discount,
            shipping,
            total,
            paymentMethod,
            paymentStatus: "PENDING",
            shippingName,
            shippingPhone,
            shippingAddress,
            shippingCity,
            shippingPostalCode,
            items: {
              create: items.map((line) => ({
                productId: line.productId,
                quantity: line.quantity,
                price: productMap.get(line.productId).price,
              })),
            },
          },
          include: { items: true },
        });

        // Run stock decrements in parallel instead of sequentially — this was
        // the main cause of the transaction timeout (one round-trip per item,
        // one after another). The `stock: { gte: line.quantity }` guard makes
        // each decrement race-condition-safe: if two orders try to buy the
        // last unit at the same time, only one update will actually match a row.
        const updateResults = await Promise.all(
          items.map((line) =>
            tx.product.updateMany({
              where: {
                id: line.productId,
                stock: { gte: line.quantity },
              },
              data: { stock: { decrement: line.quantity } },
            })
          )
        );

        // updateMany returns { count }. If count is 0 for any line, someone
        // else bought the remaining stock between our initial check and now —
        // abort the whole transaction so nothing is left half-applied.
        const soldOutIndex = updateResults.findIndex((r) => r.count === 0);
        if (soldOutIndex !== -1) {
          const line = items[soldOutIndex];
          const product = productMap.get(line.productId);
          throw new Error(`OUT_OF_STOCK:${product?.name || line.productId}`);
        }

        if (user) {
          const cart = await tx.cart.findUnique({ where: { userId: user.id } });
          if (cart) await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        return created;
      },
      {
        maxWait: 5000, // time allowed to acquire a DB connection/slot
        timeout: 15000, // time allowed for the whole transaction to run
      }
    );
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("OUT_OF_STOCK:")) {
      const productName = err.message.split(":")[1];
      return NextResponse.json(
        { error: `"${productName}" just sold out. Please remove it from your cart and try again.` },
        { status: 409 }
      );
    }

    console.error("Order creation failed:", err);
    return NextResponse.json(
      { error: "Something went wrong while placing your order. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ order }, { status: 201 });
}