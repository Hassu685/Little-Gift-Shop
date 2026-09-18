import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category");
  const occasion = searchParams.get("occasion");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 12;

  const where = {
    isActive: true,
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    }),
    ...(category && { category: { slug: category } }),
    ...(occasion && { occasion: { slug: occasion } }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      },
    }),
  };

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : sort === "name"
      ? { name: "asc" }
      : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true, reviews: { where: { isApproved: true } } },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  let enriched = products.map((p) => ({
    ...p,
    avgRating: p.reviews.length
      ? Number((p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1))
      : null,
    reviewCount: p.reviews.length,
  }));

  if (minRating) {
    enriched = enriched.filter((p) => (p.avgRating || 0) >= parseFloat(minRating));
  }

  return NextResponse.json({
    products: enriched,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  });
}
