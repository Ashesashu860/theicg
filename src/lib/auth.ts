export const AUTH_COOKIE = "icg_auth";
export const AUTH_COOKIE_VALUE = "1";

export function buildAuthCookie(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return `${AUTH_COOKIE}=${AUTH_COOKIE_VALUE}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

export function clearAuthCookie() {
  return `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
