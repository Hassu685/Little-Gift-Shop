import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ShopFilters, { SortSelect } from "@/components/ShopFilters";
import Pagination from "@/components/Pagination";
import { PackageSearch } from "lucide-react";

export const metadata = {
  title: "Shop | Little Gift Shop",
  description: "Browse handmade gifts for every occasion — gift boxes, flowers, teddy bears, chocolates and more.",
};

const PER_PAGE = 12;

async function getProducts(searchParams) {
  const q = searchParams.q || "";
  const category = searchParams.category;
  const occasion = searchParams.occasion;
  const minPrice = searchParams.minPrice;
  const maxPrice = searchParams.maxPrice;
  const minRating = searchParams.minRating;
  const sort = searchParams.sort || "newest";
  const page = parseInt(searchParams.page || "1", 10);

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

  try {
    const [products, total, categories, occasions] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: true, reviews: { where: { isApproved: true } } },
        orderBy,
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
      prisma.occasion.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
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

    return { products: enriched, total, page, totalPages: Math.ceil(total / PER_PAGE), categories, occasions };
  } catch (err) {
    console.error("Shop query failed:", err.message);
    return { products: [], total: 0, page: 1, totalPages: 0, categories: [], occasions: [] };
  }
}

export default async function ShopPage({ searchParams }) {
  const { products, total, page, totalPages, categories, occasions } = await getProducts(searchParams);

  return (
    <section className="container-x py-12 lg:py-16">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">Shop All Gifts</h1>
        <p className="mt-2 text-sm text-ink/60">{total} product{total === 1 ? "" : "s"} found</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <ShopFilters categories={categories} occasions={occasions} />

        <div className="flex-1">
          <div className="mb-6 flex justify-end">
            <SortSelect />
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary/20 py-20 text-center">
              <PackageSearch size={32} className="text-primary/40" />
              <p className="text-sm text-ink/60">
                No products match your filters yet. Try adjusting your search.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
