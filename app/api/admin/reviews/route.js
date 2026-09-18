import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(request) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // "pending" | "approved"

  const where =
    status === "pending" ? { isApproved: false } : status === "approved" ? { isApproved: true } : {};

  const reviews = await prisma.review.findMany({
    where,
    include: { user: { select: { name: true, email: true } }, product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}
