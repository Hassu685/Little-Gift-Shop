import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/utils/format";

export async function GET(request) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 15;

  const where = q
    ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] }
    : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true, category: true, occasion: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / perPage) });
}

export async function POST(request) {
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

  if (!name || !price || !sku) {
    return NextResponse.json({ error: "Name, price and SKU are required." }, { status: 400 });
  }

  const existingSku = await prisma.product.findUnique({ where: { sku } });
  if (existingSku) {
    return NextResponse.json({ error: "A product with this SKU already exists." }, { status: 409 });
  }

  let slug = slugify(name);
  let suffix = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slugify(name)}-${suffix++}`;
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || "",
      shortDescription: shortDescription || null,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      stock: parseInt(stock, 10) || 0,
      sku,
      categoryId: categoryId || null,
      occasionId: occasionId || null,
      featured: !!featured,
      isActive: isActive !== false,
      videoUrl: videoUrl || null,
      images: {
        create: (images || []).map((url, i) => ({ url, alt: name, sortOrder: i })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}
