import { cookies } from "next/headers";
import type { DecodedIdToken } from "firebase-admin/auth";
import {
  AUTH_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  getClearedSessionCookieOptions,
  getSessionCookieOptions,
} from "@/lib/auth";
import {
  createSessionCookie,
  isFirebaseAdminConfigured,
  revokeRefreshTokens,
  verifyIdToken,
  verifySessionCookie,
} from "@/lib/firebase-admin";

export type AdminSession = {
  uid: string;
  email: string;
  claims: DecodedIdToken;
};

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) {
    return false;
  }

  const allowlist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (allowlist.length === 0) {
    return false;
  }

  return allowlist.includes(email.trim().toLowerCase());
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE)?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const claims = await verifySessionCookie(sessionCookie, true);
    const email = typeof claims.email === "string" ? claims.email : "";

    if (!isAdminEmail(email)) {
      return null;
    }

    return {
      uid: claims.uid,
      email,
      claims,
    };
  } catch {
    return null;
  }
}

export async function createAdminSessionCookie(idToken: string): Promise<{
  sessionCookie: string;
  maxAge: number;
}> {
  const decoded = await verifyIdToken(idToken);
  const email = typeof decoded.email === "string" ? decoded.email : "";

  if (!email || !isAdminEmail(email)) {
    throw new AdminAuthError("Forbidden.", 403);
  }

  // Allowlisted Console-created admins are often emailVerified=false;
  // ADMIN_EMAILS is the access gate for this app.

  const maxAge = SESSION_MAX_AGE_SECONDS;
  const sessionCookie = await createSessionCookie(idToken, maxAge * 1000);

  return { sessionCookie, maxAge };
}

export async function clearAdminSession(
  options: { revoke?: boolean } = {},
): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE)?.value;

  if (options.revoke && sessionCookie && isFirebaseAdminConfigured()) {
    try {
      const claims = await verifySessionCookie(sessionCookie, false);
      await revokeRefreshTokens(claims.uid);
    } catch {
      // Cookie may already be invalid; still clear it below.
    }
  }

  cookieStore.set(AUTH_COOKIE, "", getClearedSessionCookieOptions());
}

export async function setAdminSessionCookie(
  sessionCookie: string,
  maxAge = SESSION_MAX_AGE_SECONDS,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, sessionCookie, getSessionCookieOptions(maxAge));
}

export class AdminAuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminAuthError";
    this.status = status;
  }
}
