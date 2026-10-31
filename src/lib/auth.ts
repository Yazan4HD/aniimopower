import crypto from "crypto";

const getSecret = () =>
  process.env.SESSION_SECRET ||
  process.env.ADMIN_PASSWORD ||
  "aniimo-power-internal-auth-secret-key-42";

export interface SessionData {
  username: string;
  role: "admin";
  issuedAt: number;
  expiresAt: number;
}

export function createSessionToken(username: string): string {
  const now = Date.now();
  const session: SessionData = {
    username,
    role: "admin",
    issuedAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string | undefined): SessionData | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  const expectedSignature = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");

  if (signature.length !== expectedSignature.length) return null;

  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!isMatch) return null;

    const session: SessionData = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (Date.now() > session.expiresAt) return null;
    return session;
  } catch {
    return null;
  }
}

