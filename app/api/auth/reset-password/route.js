import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyToken } from "@/lib/auth";

export async function POST(request) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Token and new password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const payload = await verifyToken(token);
  if (!payload || payload.purpose !== "reset") {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: payload.userId },
    data: { passwordHash },
  });

  return NextResponse.json({ success: true });
}
