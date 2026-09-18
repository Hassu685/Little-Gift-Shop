import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  const { isRead } = await request.json();
  const message = await prisma.contactMessage.update({
    where: { id: params.id },
    data: { isRead: !!isRead },
  });
  return NextResponse.json({ message });
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }
  await prisma.contactMessage.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
