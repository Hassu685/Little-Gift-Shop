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
  const q = searchParams.get("q") || "";
  const format = searchParams.get("format");

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: q ? { email: { contains: q, mode: "insensitive" } } : {},
    orderBy: { createdAt: "desc" },
  });

  if (format === "csv") {
    const csv = ["email,subscribed_at", ...subscribers.map((s) => `${s.email},${s.createdAt.toISOString()}`)].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=newsletter-subscribers.csv",
      },
    });
  }

  return NextResponse.json({ subscribers });
}
