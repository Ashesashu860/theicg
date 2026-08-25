# Firebase (this repo)

Two SDKs, two trust boundaries. Mixing them is the most common failure.

| Layer | Module | Runs where | Holds |
| --- | --- | --- | --- |
| Web SDK | `@/lib/firebase`, `@/lib/auth-client` | Browser / Client Components | Public Firebase config |
| Admin SDK | `@/lib/firebase-admin`, `@/lib/admin-session` | Node server only | Service account |

## Client SDK

- Initialize once via `getApps()` / `getApp()` (already in `getFirebaseApp()`).
- Call `isFirebaseConfigured()` before Auth/Firestore. Surface a user-safe error if unset.
- Analytics: `getFirebaseAnalytics()` only — it no-ops on the server and when `isSupported()` is false.
- Do not call `initializeApp` in components. Do not create extra Firebase apps.

## Admin SDK

- Use `getFirebaseAdminAuth()` / `verifyIdToken` / `createSessionCookie` / `verifySessionCookie` from `@/lib/firebase-admin`.
- Keep `runtime = "nodejs"` on any route that imports Admin. Never Edge.
- Private key: prefer existing `normalizePrivateKey` + `FIREBASE_ADMIN_PRIVATE_KEY` / `_BASE64` / `FIREBASE_ADMIN_CREDENTIALS`. Do not invent a fourth credential path.
- Never log `idToken`, session cookies, or private keys.

## Auth flow (required)

1. Client: `signInWithEmailAndPassword` → `user.getIdToken()` → `POST /api/auth/session` with `{ idToken }`.
2. Server: `verifyIdToken` → `isAdminEmail` (`ADMIN_EMAILS`) → `createSessionCookie` → HttpOnly `__session` (`AUTH_COOKIE` from `@/lib/auth`).
3. Client UI: `onAuthStateChanged` via `subscribeToAuth` / `useAuth()` for display only.
4. Sign-out: `DELETE /api/auth/session` (revokes refresh tokens) then `signOut`.

Rules:

- Session cookie is **httpOnly**, `secure` in production, `sameSite: "lax"`, path `/`. Max age ≤ 5 days (`SESSION_MAX_AGE_SECONDS`).
- Do not store ID tokens in `localStorage` / `sessionStorage` as the session.
- Do not treat `cookies().get(AUTH_COOKIE)` as proof of admin. Always `verifySessionCookie` + `isAdminEmail` (`getAdminSession`).
- `proxy.ts` may check cookie presence for redirects; layouts/APIs must still call `getAdminSession()`.
- Unauthorized allowlist miss → 403 `"Forbidden."` (see `AdminAuthError`), then client signs out.

## Firestore

- Collection names live in `src/lib/*` (e.g. `CONTACT_REQUESTS_COLLECTION`). Reuse them.
- Client writes: `addDoc` / `updateDoc` + `serverTimestamp()` for `createdAt`.
- Guard with `isFirebaseConfigured()`. Catch errors and show a generic user message; log details on the server only.
- New collections need Firestore security rules that match the intended access (public write vs admin-only). Do not rely on hidden collection names.
- Privileged reads/writes that rules cannot express go through a Node Route Handler using Admin — not the web SDK with a loosened rule.

## Security checklist

- [ ] No Admin imports in `"use client"` files
- [ ] No `NEXT_PUBLIC_` on Admin/SMTP/`ADMIN_EMAILS`
- [ ] Protected Route Handlers call `getAdminSession()` before side effects
- [ ] Tokens and PEM keys never appear in responses, commits, or `console.log`
- [ ] New auth surfaces follow the session-cookie flow above
