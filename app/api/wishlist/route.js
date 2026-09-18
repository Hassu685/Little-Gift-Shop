import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

async function getOrCreateWishlist(userId) {
  let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (!wishlist) wishlist = await prisma.wishlist.create({ data: { userId } });
  return wishlist;
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ items: [] });

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: { include: { images: true } } } } },
  });
  return NextResponse.json({ items: wishlist?.items || [] });
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = await request.json();
  const wishlist = await getOrCreateWishlist(user.id);

  if (Array.isArray(body.merge)) {
    for (const productId of body.merge) {
      const existing = await prisma.wishlistItem.findFirst({
        where: { wishlistId: wishlist.id, productId },
      });
      if (!existing) {
        await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
      }
    }
  } else if (body.productId) {
    const existing = await prisma.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId: body.productId },
    });
    if (!existing) {
      await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId: body.productId } });
    }
  }

  const updated = await prisma.wishlist.findUnique({
    where: { id: wishlist.id },
    include: { items: { include: { product: { include: { images: true } } } } },
  });
  return NextResponse.json({ items: updated.items });
}

export async function DELETE(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { productId } = await request.json();
  const wishlist = await getOrCreateWishlist(user.id);
  await prisma.wishlistItem.deleteMany({ where: { wishlistId: wishlist.id, productId } });

  return NextResponse.json({ success: true });
}
