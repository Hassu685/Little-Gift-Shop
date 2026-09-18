import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, Truck, RotateCcw, BadgeCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/utils/format";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ProductCard from "@/components/ProductCard";
import ReviewForm from "@/components/ReviewForm";

export async function generateMetadata({ params }) {
  try {
    const product = await prisma.product.findUnique({ where: { slug: params.slug } });
    if (!product) return { title: "Product Not Found | Little Gift Shop" };
    return {
      title: `${product.name} | Little Gift Shop`,
      description: product.shortDescription || product.description?.slice(0, 150),
    };
  } catch {
    return { title: "Little Gift Shop" };
  }
}

async function getProduct(slug) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        occasion: true,
        reviews: { where: { isApproved: true }, include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
      },
    });
    if (!product) return null;

    const related = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        OR: [{ categoryId: product.categoryId }, { occasionId: product.occasionId }],
      },
      include: { images: true, reviews: { where: { isApproved: true } } },
      take: 4,
    });

    return {
      product,
      related: related.map((p) => ({
        ...p,
        avgRating: p.reviews.length
          ? Number((p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1))
          : null,
        reviewCount: p.reviews.length,
      })),
    };
  } catch (err) {
    console.error("Product fetch failed:", err.message);
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const data = await getProduct(params.slug);
  if (!data) notFound();
  const { product, related } = data;

  const avgRating = product.reviews.length
    ? (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  return (
    <section className="container-x py-12 lg:py-16">
      <nav className="mb-6 text-xs text-ink/50">
        <Link href="/shop" className="hover:text-primary">Shop</Link> /{" "}
        {product.category && <>{product.category.name} / </>}
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} videoUrl={product.videoUrl} productName={product.name} />

        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary-dark sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-ink/60">
            {avgRating ? (
              <>
                <Star size={14} className="text-gold" fill="currentColor" />
                <span className="font-medium text-ink/80">{avgRating}</span>
                <span>({product.reviews.length} reviews)</span>
              </>
            ) : (
              <span>No reviews yet</span>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-heading text-2xl font-semibold text-primary-dark">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-ink/40 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink/70">
            {product.description}
          </p>

          <div className="mt-6">
            <ProductPurchasePanel product={product} />
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 border-t border-primary/10 pt-6 text-sm text-ink/60 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Truck size={15} className="text-primary" /> Free shipping over $50
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={15} className="text-primary" /> 7-day easy returns
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck size={15} className="text-primary" /> SKU: {product.sku}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 max-w-2xl">
        <h2 className="font-heading text-2xl font-semibold text-primary-dark">Reviews</h2>
        <div className="mt-6 space-y-5">
          {product.reviews.length === 0 && (
            <p className="text-sm text-ink/50">Be the first to review this product.</p>
          )}
          {product.reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-primary/10 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{r.user.name}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={11} className="text-gold" fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="mt-1.5 text-sm text-ink/70">{r.comment}</p>
            </div>
          ))}
        </div>
        <div className="mt-7">
          <h3 className="mb-3 font-heading text-base font-semibold text-ink">Write a Review</h3>
          <ReviewForm productId={product.id} />
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-heading text-2xl font-semibold text-primary-dark">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
