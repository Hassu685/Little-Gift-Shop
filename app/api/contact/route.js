import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  const { name, email, phone, subject, message } = await request.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Name, email, subject and message are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const saved = await prisma.contactMessage.create({
    data: { name, email, phone: phone || null, subject, message },
  });

  return NextResponse.json({ message: saved }, { status: 201 });
}
