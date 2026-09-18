import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "lgs_session";

export function getSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}

export async function getCurrentUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
  });
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    const err = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
  return user;
}

export { COOKIE_NAME };
