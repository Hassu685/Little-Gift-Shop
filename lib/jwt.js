import { SignJWT, jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");

export async function signToken(payload, expiresIn = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
}
