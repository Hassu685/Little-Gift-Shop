import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Re-exported so existing imports of signToken/verifyToken from "@/lib/auth"
// keep working. Edge contexts (middleware) should import from "@/lib/jwt"
// directly to avoid pulling in bcryptjs, which needs the Node runtime.
export { signToken, verifyToken } from "./jwt";
