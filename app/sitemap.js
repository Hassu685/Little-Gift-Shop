import { prisma } from "@/lib/prisma";

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "", "/shop", "/occasions", "/about", "/blog", "/contact",
    "/faq", "/shipping-policy", "/returns", "/terms", "/privacy",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  let productRoutes = [];
  let occasionRoutes = [];
  let blogRoutes = [];

  try {
    const [products, occasions, posts] = await Promise.all([
      prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.occasion.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ]);

    productRoutes = products.map((p) => ({
      url: `${siteUrl}/shop/${p.slug}`,
      lastModified: p.updatedAt,
    }));
    occasionRoutes = occasions.map((o) => ({
      url: `${siteUrl}/occasions/${o.slug}`,
      lastModified: o.updatedAt,
    }));
    blogRoutes = posts.map((b) => ({
      url: `${siteUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt,
    }));
  } catch (err) {
    // Database not reachable at build/request time — fall back to static routes only.
    console.error("Sitemap: could not load dynamic routes:", err.message);
  }

  return [...staticRoutes, ...productRoutes, ...occasionRoutes, ...blogRoutes];
}
