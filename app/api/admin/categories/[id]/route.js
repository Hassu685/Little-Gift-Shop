import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  const { name, description, image, isActive } = await request.json();
  const category = await prisma.category.update({
    where: { id: params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(isActive !== undefined && { isActive: !!isActive }),
    },
  });
  return NextResponse.json({ category });
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Could not delete — products still reference this category." },
      { status: 400 }
    );
  }
}
