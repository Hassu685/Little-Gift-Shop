import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  const { title, excerpt, content, featuredImage, author, isPublished } = await request.json();
  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title }),
      ...(excerpt !== undefined && { excerpt }),
      ...(content !== undefined && { content }),
      ...(featuredImage !== undefined && { featuredImage }),
      ...(author !== undefined && { author }),
      ...(isPublished !== undefined && { isPublished: !!isPublished }),
    },
  });
  return NextResponse.json({ post });
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
