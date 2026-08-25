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

## Best coding practices

### Composition and reuse

- Prefer one shared UI component for the same surface (e.g. `BlogCard` for every public blog card). Do not copy-paste card/list markup across pages.
- Thin routes: `page.tsx` loads data / metadata and renders a `*-page.tsx` (or feature component). Keep route files small.
- Colocate UI in `src/components/`; shared domain helpers in `src/lib/`. Match existing naming (`*-page.tsx` for route views, `blog-card.tsx` for reusable pieces).
- Reuse existing modules before adding new ones — especially auth, Firebase, session, and data path helpers. Do not invent parallel clients or path constants.
- Extract a component when the same markup/behavior appears in 2+ places, or when a page section has a clear single responsibility.

### Server Components first

- Default to Server Components. Add `"use client"` only for state, effects, event handlers, or browser APIs.
- Push client boundaries down: keep pages/layouts server; wrap only the interactive leaf in `"use client"`.
- Fetch data on the server in `page.tsx` / layouts / `src/lib/*-server.ts`. Pass serializable props into client islands.
- Prefer `async` server functions over client `useEffect` for initial reads.
- Use `generateMetadata` (or exported `metadata`) on public routes. Await `params` / `searchParams`.

### Data, mutations, and navigation

- Use `next/link` for internal navigation and `next/image` for images. Configure remote hosts in `next.config.ts` `images.remotePatterns`.
- Hide empty optional media (no placeholder image block when `imageUrl` is missing), unless the design explicitly needs a fallback.
- Mutations that need secrets or admin privileges belong in Route Handlers (or Server Actions), not Client Components calling Admin APIs.
- After create/update in the portal, reset form state and navigate to the list or canonical read URL (`router.push`), not a dead-end edit URL unless editing.
- Public entity URLs use stable slugs (`/capabilities/[slug]`, `/blogs/[slug]`), not Firestore document IDs.

### TypeScript and React

- Prefer explicit props types near the component. Reuse shared record types from `src/lib/*-data.ts`.
- Keep components pure where possible: derive UI from props/data; avoid hidden global UI state.
- Do not add `useMemo` / `useCallback` by default (React Compiler). Use them only when profiling or an existing pattern already requires them.
- Prefer modern patterns already in the repo (`startTransition`, etc.) only when they fit the interaction.

### UX and accessibility (routing UI)

- Interactive cards that open a resource should be a single `Link` (or button) wrapping the card, with a real `href`.
- Loading and empty states: show a clear message; do not leave broken `href="#"` placeholders.
- Forms: disable submit while saving; surface errors with `role="alert"`; success via existing toast patterns.

### Performance and safety

- Avoid shipping Firebase Admin or secrets to the client bundle.
- Keep `"use client"` trees small so less JS hydrates.
- Use `dynamic = "force-dynamic"` only when the route must always read fresh server/Firestore data (already used on capability/blog routes).
- Never commit `.env*` or service-account JSON. Never put secrets in `NEXT_PUBLIC_*`.

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
