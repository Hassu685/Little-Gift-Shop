import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Blog",
  description: "Gift ideas, guides and stories from the Little Gift Shop team.",
};

async function getPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Blog fetch failed:", err.message);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <section className="container-x py-12 lg:py-16">
      <div className="mb-10 text-center">
        <span className="section-label">From Our Journal</span>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
          The Little Gift Shop Blog
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink/60">
          Gift ideas, wrapping guides and stories worth sharing.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-sm text-ink/50">No posts published yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-lavender-light">
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <p className="text-xs text-ink/40">
                  {new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · {post.author}
                </p>
                <h2 className="mt-1 font-heading text-base font-semibold text-ink group-hover:text-primary">
                  {post.title}
                </h2>
                {post.excerpt && <p className="mt-2 text-sm text-ink/60">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
