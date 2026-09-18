import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const { isApproved } = await request.json();
  const review = await prisma.review.update({
    where: { id: params.id },
    data: { isApproved: !!isApproved },
  });
  return NextResponse.json({ review });
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  await prisma.review.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
