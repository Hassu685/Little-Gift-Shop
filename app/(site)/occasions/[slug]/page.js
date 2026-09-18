import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({ params }) {
  try {
    const occasion = await prisma.occasion.findUnique({ where: { slug: params.slug } });
    if (!occasion) return { title: "Occasion Not Found" };
    return {
      title: occasion.name,
      description: occasion.description || `Shop handmade gifts for ${occasion.name}.`,
    };
  } catch {
    return { title: "Little Gift Shop" };
  }
}

async function getOccasionWithProducts(slug) {
  try {
    const occasion = await prisma.occasion.findUnique({ where: { slug } });
    if (!occasion) return null;

    const products = await prisma.product.findMany({
      where: { occasionId: occasion.id, isActive: true },
      include: { images: true, reviews: { where: { isApproved: true } } },
      orderBy: { createdAt: "desc" },
    });

    return {
      occasion,
      products: products.map((p) => ({
        ...p,
        avgRating: p.reviews.length
          ? Number((p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1))
          : null,
        reviewCount: p.reviews.length,
      })),
    };
  } catch (err) {
    console.error("Occasion fetch failed:", err.message);
    return null;
  }
}

export default async function OccasionDetailPage({ params }) {
  const data = await getOccasionWithProducts(params.slug);
  if (!data) notFound();
  const { occasion, products } = data;

  return (
    <section className="container-x py-12 lg:py-16">
      <div className="mb-8 text-center">
        <span className="section-label">{occasion.name}</span>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
          Gifts for {occasion.name}
        </h1>
        {occasion.description && (
          <p className="mx-auto mt-3 max-w-lg text-sm text-ink/60">{occasion.description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <p className="text-center text-sm text-ink/50">No gifts found for this occasion yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
