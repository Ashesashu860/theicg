---
name: nextjs-firebase
description: >-
  Enforces Next.js 16 App Router and Firebase (client SDK + Admin) best
  practices for this repo. Apply on every prompt: routing, Server/Client
  Components, proxy, Route Handlers, auth, Firestore, env vars, and any
  TypeScript or React change.
---

# Next.js + Firebase

This repo is **Next.js 16 App Router** (`src/app`) + **React 19** + **Firebase client SDK** + **firebase-admin**. Training-data Next.js (Pages Router, `middleware.ts`, sync `params`) is wrong here.

Before writing Next.js APIs that might have changed, read the matching guide in `node_modules/next/dist/docs/01-app/`.

## Always

1. Default to **Server Components**. Add `"use client"` only for state, effects, event handlers, or browser APIs.
2. Reuse existing modules — do not invent parallel Firebase or auth helpers:
   - Client: `@/lib/firebase`, `@/lib/auth-client`
   - Admin/session: `@/lib/firebase-admin`, `@/lib/admin-session`, `@/lib/auth`
3. **Never** import `firebase-admin`, `@/lib/firebase-admin`, or `@/lib/admin-session` from a Client Component.
4. **Never** put secrets in `NEXT_PUBLIC_*`. Admin private keys, SMTP passwords, and `ADMIN_EMAILS` stay server-only.
5. Auth for protected data is `await getAdminSession()` (verified session cookie + email allowlist). Cookie *presence* in `proxy.ts` is optimistic only.
6. `params` / `searchParams` are `Promise`s — `await` them. `cookies()` / `headers()` are async — `await` them.
7. Request interception lives in `src/proxy.ts` (`export function proxy`). Do not create `middleware.ts`.

## Decision tree

| Need | Put it here |
| --- | --- |
| Data, secrets, session, metadata | Server Component, Route Handler, or `src/lib/*` (no `"use client"`) |
| Clicks, forms, `onAuthStateChanged`, Firestore from the browser | Client Component |
| Gate `/portal` before render | `src/proxy.ts` (cookie presence) **and** `getAdminSession()` in the layout/route |
| Create/clear login session | `src/app/api/auth/session/route.ts` (`runtime = "nodejs"`) |

## Additional resources

- Next.js 16 conventions: [nextjs.md](nextjs.md)
- Firebase client, Admin, auth, Firestore: [firebase.md](firebase.md)
