import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success so we don't leak which emails are registered.
  if (!user) {
    return NextResponse.json({ success: true });
  }

  const resetToken = await signToken({ userId: user.id, purpose: "reset" }, "30m");
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

  // No email provider is configured yet — log the link so the flow is
  // fully testable locally. Wire up a real provider (e.g. Resend, SendGrid)
  // here before going to production.
  console.log(`[password reset] ${email} -> ${resetUrl}`);

  return NextResponse.json({
    success: true,
    ...(process.env.NODE_ENV !== "production" ? { devResetUrl: resetUrl } : {}),
  });
}
