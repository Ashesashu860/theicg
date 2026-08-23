/** HttpOnly Firebase session cookie (signed JWT, not a presence flag). */
export const AUTH_COOKIE = "__session";

/** 5 days — under Firebase session cookie max of 14 days. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5;

export type SessionCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge: number;
};

export function getSessionCookieOptions(
  maxAgeSeconds = SESSION_MAX_AGE_SECONDS,
): SessionCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export function getClearedSessionCookieOptions(): SessionCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  };
}
