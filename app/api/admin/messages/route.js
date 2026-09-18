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
  const filter = searchParams.get("filter"); // "unread"
  const messages = await prisma.contactMessage.findMany({
    where: filter === "unread" ? { isRead: false } : {},
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ messages });
}
