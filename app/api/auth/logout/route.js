import { NextResponse } from "next/server";
import { getSessionCookieOptions } from "@/lib/session";

export async function POST() {
  const res = NextResponse.json({ success: true });
  const { name: cookieName } = getSessionCookieOptions();
  res.cookies.set(cookieName, "", { path: "/", maxAge: 0 });
  return res;
}
