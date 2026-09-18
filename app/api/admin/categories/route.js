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
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ categories });
}

export async function POST(request) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const { name, description, image, isActive } = await request.json();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  let slug = slugify(name);
  let suffix = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${slugify(name)}-${suffix++}`;
  }

  const category = await prisma.category.create({
    data: { name, slug, description: description || null, image: image || null, isActive: isActive !== false },
  });
  return NextResponse.json({ category }, { status: 201 });
}
