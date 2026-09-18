import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to leave a review." }, { status: 401 });
  }

  const { productId, rating, comment } = await request.json();
  if (!productId || !rating || !comment) {
    return NextResponse.json({ error: "Rating and comment are required." }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: { userId: user.id, productId, rating, comment, isApproved: false },
  });

  return NextResponse.json({
    review,
    message: "Thanks! Your review will appear once it's approved.",
  }, { status: 201 });
}
