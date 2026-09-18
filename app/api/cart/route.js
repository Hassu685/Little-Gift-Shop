import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

async function getOrCreateCart(userId) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });
  return cart;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ items: [] });

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: { include: { images: true } } } } },
  });

  return NextResponse.json({ items: cart?.items || [] });
}

// Add or increase an item. Also accepts a `merge` array to fold in a guest cart on login.
export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = await request.json();
  const cart = await getOrCreateCart(user.id);

  if (Array.isArray(body.merge)) {
    for (const line of body.merge) {
      const existing = await prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId: line.productId },
      });
      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + line.quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: { cartId: cart.id, productId: line.productId, quantity: line.quantity },
        });
      }
    }
  } else if (body.productId) {
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: body.productId },
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (body.quantity || 1) },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId: body.productId, quantity: body.quantity || 1 },
      });
    }
  }

  const updated = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: { include: { images: true } } } } },
  });
  return NextResponse.json({ items: updated.items });
}

// Set an exact quantity
export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { productId, quantity } = await request.json();
  const cart = await getOrCreateCart(user.id);
  const item = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
  if (!item) return NextResponse.json({ error: "Item not in cart." }, { status: 404 });

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
  }

  const updated = await prisma.cart.findUnique({
    where: { id: cart.id },
    include: { items: { include: { product: { include: { images: true } } } } },
  });
  return NextResponse.json({ items: updated.items });
}

export async function DELETE(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { productId, clear } = await request.json();
  const cart = await getOrCreateCart(user.id);

  if (clear) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  } else if (productId) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
  }

  return NextResponse.json({ success: true });
}
