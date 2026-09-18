import Hero from "@/components/Hero";
import OccasionSection from "@/components/OccasionSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import OfferBanner from "@/components/OfferBanner";
import StorySection from "@/components/StorySection";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import InstagramGallery from "@/components/InstagramGallery";
import Newsletter from "@/components/Newsletter";
import { prisma } from "@/lib/prisma";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: { images: true, reviews: { where: { isApproved: true } } },
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    return products.map((p) => ({
      ...p,
      avgRating: p.reviews.length
        ? Number((p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1))
        : 4.8,
      reviewCount: p.reviews.length,
    }));
  } catch (err) {
    // DATABASE_URL not configured yet — fall back to empty state gracefully
    console.error("Could not load featured products:", err.message);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <OccasionSection />
      <FeaturedProducts products={featuredProducts} />
      <OfferBanner />
      <StorySection />
      <Benefits />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
