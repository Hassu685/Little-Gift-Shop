import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/session";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  try {
    await requireAdmin();
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: err.status || 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, WebP and GIF images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be under 5MB." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split(".").pop().toLowerCase();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");

  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);
  } catch (err) {
    // On read-only serverless filesystems (e.g. Vercel) this write will fail —
    // swap this route for a real object-storage provider (S3, Cloudinary,
    // Vercel Blob) before deploying there.
    return NextResponse.json(
      { error: "Could not save file. If deploying to a serverless platform, wire up object storage instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: `/uploads/products/${filename}` }, { status: 201 });
}
