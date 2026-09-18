import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const { email } = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Could not subscribe right now." }, { status: 500 });
  }
}
