import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true, category: true, occasion: true },
  });
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const body = await request.json();
  const {
    name, description, shortDescription, price, comparePrice, stock, sku,
    categoryId, occasionId, featured, isActive, videoUrl, images,
  } = body;

  const data = {
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(shortDescription !== undefined && { shortDescription }),
    ...(price !== undefined && { price: parseFloat(price) }),
    ...(comparePrice !== undefined && { comparePrice: comparePrice ? parseFloat(comparePrice) : null }),
    ...(stock !== undefined && { stock: parseInt(stock, 10) }),
    ...(sku !== undefined && { sku }),
    ...(categoryId !== undefined && { categoryId: categoryId || null }),
    ...(occasionId !== undefined && { occasionId: occasionId || null }),
    ...(featured !== undefined && { featured: !!featured }),
    ...(isActive !== undefined && { isActive: !!isActive }),
    ...(videoUrl !== undefined && { videoUrl: videoUrl || null }),
  };

  if (images) {
    await prisma.productImage.deleteMany({ where: { productId: params.id } });
    data.images = { create: images.map((url, i) => ({ url, alt: name, sortOrder: i })) };
  }

  try {
    const product = await prisma.product.update({
      where: { id: params.id },
      data,
      include: { images: true },
    });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: "Could not update product." }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not delete product — it may be referenced by existing orders." },
      { status: 400 }
    );
  }
}
