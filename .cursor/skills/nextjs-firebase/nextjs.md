# Next.js 16 (this repo)

Stack: `next@16`, App Router under `src/app`, `src/proxy.ts`, typed routes, Tailwind 4. Do **not** use Pages Router APIs (`getServerSideProps`, `pages/api`, `_app`).

Read `node_modules/next/dist/docs/01-app/` when unsure. Heed deprecation notices.

## File conventions

| File | Role |
| --- | --- |
| `src/app/**/page.tsx` | Route UI. Prefer a thin async server page that renders a component. |
| `src/app/**/layout.tsx` | Shared chrome. Root layout already wraps `AuthProvider` + `SiteHeader`. |
| `src/app/**/route.ts` | Route Handler (API). Cannot sit next to `page.tsx` in the same segment. |
| `src/proxy.ts` | Request proxy (formerly middleware). One file only. |

## Server vs Client

```tsx
// Server page — default, can be async, can await cookies/params
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ClientWidget slug={slug} />;
}

// Client island — only this file needs "use client"
"use client";
```

- Pass serializable props from Server → Client. Do not pass functions, class instances, or Firebase Admin objects.
- Do not import a `"use client"` module into a server file unless that import *is* the client boundary.
- `LayoutProps<"/">` (and typed route props) are the Next 16 pattern — keep using them when adding layouts.

## Proxy vs authorization

`src/proxy.ts` runs before render. Use it for redirects when `__session` is missing. It must **not**:

- Call `firebase-admin` / `verifySessionCookie` (Edge-incompatible, too slow)
- Be treated as real authorization

Real authorization: `await getAdminSession()` in server layouts, pages, and Route Handlers. Example: `src/app/portal/layout.tsx`.

Export `proxy`, not `middleware`. Keep `config.matcher` narrow so static assets are not intercepted.

## Route Handlers

- `src/app/api/<name>/route.ts` with `GET` / `POST` / `DELETE` / …
- Auth-sensitive handlers: `export const runtime = "nodejs"` and `await getAdminSession()` first.
- Validate JSON with type guards (`typeof x === "string"`). Do not trust the client body.
- Return `NextResponse.json({ error }, { status })`. Do not leak stack traces, tokens, or PEM parse internals to the client beyond the existing session-route mapping.

## Env vars

- `NEXT_PUBLIC_*` is inlined into the browser bundle. Firebase web config only.
- Server secrets: `FIREBASE_ADMIN_*`, `ADMIN_EMAILS`, SMTP. Read them only in server modules.
- `.env*` is gitignored. Never commit keys or service-account JSON.

## Data and navigation

- Use `next/link` and `next/image`. Remote image hosts go in `next.config.ts` `images.remotePatterns`.
- Mutations that need secrets or admin privileges belong in Route Handlers (or Server Actions), not in Client Components talking to Admin APIs.
- Colocate UI in `src/components/`; shared logic in `src/lib/`. Match existing naming (`*-page.tsx` for route views).
