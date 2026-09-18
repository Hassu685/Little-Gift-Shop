import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function PATCH(request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { name, phone } = await request.json();
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name, phone: phone || null },
    select: { id: true, name: true, email: true, phone: true, role: true },
  });

  return NextResponse.json({ user: updated });
}
