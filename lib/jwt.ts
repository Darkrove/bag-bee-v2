import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!; // same as your NextAuth secret

export function signJwt(payload: object, expiresIn = "1h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}