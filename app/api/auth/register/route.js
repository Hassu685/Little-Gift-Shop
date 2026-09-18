import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { getSessionCookieOptions } from "@/lib/session";

export async function POST(request) {
  const { name, email, password, phone } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, phone: phone || null, passwordHash },
    select: { id: true, name: true, email: true, role: true },
  });

  const token = await signToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({ user }, { status: 201 });
  const { name: cookieName, ...opts } = getSessionCookieOptions();
  res.cookies.set(cookieName, token, opts);
  return res;
}
