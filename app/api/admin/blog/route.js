import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/utils/format";

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(request) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const { title, excerpt, content, featuredImage, author, isPublished } = await request.json();
  if (!title || !content || !author) {
    return NextResponse.json({ error: "Title, content and author are required." }, { status: 400 });
  }

  let slug = slugify(title);
  let suffix = 1;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${slugify(title)}-${suffix++}`;
  }

  const post = await prisma.blogPost.create({
    data: {
      title, slug, excerpt: excerpt || null, content,
      featuredImage: featuredImage || null, author, isPublished: !!isPublished,
    },
  });
  return NextResponse.json({ post }, { status: 201 });
}
