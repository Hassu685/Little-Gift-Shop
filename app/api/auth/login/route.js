import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { getSessionCookieOptions } from "@/lib/session";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await signToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  const { name: cookieName, ...opts } = getSessionCookieOptions();
  res.cookies.set(cookieName, token, opts);
  return res;
}
