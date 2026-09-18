import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
    if (!post) return { title: "Post Not Found" };
    return { title: post.title, description: post.excerpt || post.content.slice(0, 150) };
  } catch {
    return { title: "Little Gift Shop Blog" };
  }
}

async function getPost(slug) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post || !post.isPublished) return null;
    return post;
  } catch (err) {
    console.error("Blog post fetch failed:", err.message);
    return null;
  }
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="container-x max-w-2xl py-12 lg:py-16">
      <Link href="/blog" className="mb-6 flex items-center gap-1.5 text-sm text-ink/50 hover:text-primary">
        <ArrowLeft size={14} /> Back to Blog
      </Link>

      <p className="text-xs text-ink/40">
        {new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} · {post.author}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">{post.title}</h1>

      {post.featuredImage && (
        <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl bg-lavender-light">
          <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div className="prose prose-sm mt-8 max-w-none whitespace-pre-line text-[15px] leading-relaxed text-ink/75">
        {post.content}
      </div>
    </article>
  );
}
