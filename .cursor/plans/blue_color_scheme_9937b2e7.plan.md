---
name: Blue color scheme
overview: Retheme the app from the current green Material tokens to the Stitch “ICG Design System Overview” palette (primary `#144AA4` + slate neutrals), by updating CSS variables so existing Tailwind token classes recolor the whole site.
todos:
  - id: update-css-tokens
    content: "Remap globals.css :root + @theme hexes to #144AA4 / slate palette; fix hardcoded helper colors"
    status: completed
  - id: fix-hardcoded-docs
    content: Update about-page.tsx gradients; sync DESIGN.md colors; remove probe screenshot
    status: completed
isProject: false
---

# Apply Stitch ICG color scheme

## Source of truth

[Stitch: ICG Design System Overview](https://stitch.withgoogle.com/projects/5514221718318762932?node-id=32c1b5a9ed8543bbb4cd8e83f2d94098) (`32c1b5a9ed8543bbb4cd8e83f2d94098`)

Measured / labeled colors from that screen:

| Role | Hex |
|------|-----|
| Primary | `#144AA4` |
| Neutral 1 (page) | `#F5F7FA` |
| Neutral 2 | `#E2E8F0` |
| Neutral 3 | `#94A3B8` |
| Neutral 4 (text/slate) | `#475569` |
| Success | `#16A34A` |
| Error | `#DC2626` |

Note: Stitch’s API `list_design_systems` still returns the old green “Executive Perspective” JSON. The linked overview screen is the new brand — we will **not** sync from that outdated API payload.

Scope: **colors only** (token hexes + hardcoded color literals). Keep existing Source Serif 4 / Hanken Grotesk and sharp (0px) corners; the overview also shows Merriweather/Inter and rounded controls, but those are typography/shape changes outside “color coding.”

## Approach

Update [`src/app/globals.css`](src/app/globals.css) `:root` tokens in place, keeping Material-style names (`primary`, `primary-container`, `secondary-fixed`, surfaces, etc.) so classes like `bg-primary`, `text-secondary`, `border-outline-variant` recolor automatically across pages.

### Token mapping (locked)

Brand / interactive:

- `--primary`: `#0B2F6B` (deeper navy for text / strong fills)
- `--primary-container`: `#144AA4` (brand blue — primary buttons)
- `--on-primary` / `--on-secondary`: `#ffffff`
- `--on-primary-container`: `#D6E4F7`
- `--inverse-primary` / `--primary-fixed-dim`: `#8FB0E0`
- `--primary-fixed`: `#C5D8F0`
- `--on-primary-fixed`: `#0B2F6B`
- `--on-primary-fixed-variant`: `#144AA4`
- `--secondary`: `#475569`
- `--secondary-container`: `#E2E8F0` (secondary button fill)
- `--on-secondary-container`: `#144AA4`
- `--secondary-fixed`: `#94A3B8` (replaces mint hover accent)
- `--secondary-fixed-dim`: `#64748B`
- `--surface-tint`: `#144AA4`

Surfaces / neutrals:

- `--background` / `--surface` / `--surface-bright` / `--off-white`: `#F5F7FA`
- `--surface-container-lowest` / `--pure-white`: `#ffffff`
- `--surface-container-low`: `#F5F7FA`
- `--surface-container` / `--surface-variant`: `#E2E8F0`
- `--surface-container-high`: `#D5DEE9`
- `--surface-container-highest` / `--surface-dim`: `#C8D3E0`
- `--on-surface` / `--foreground` / `--on-background`: `#475569`
- `--on-surface-variant`: `#64748B`
- `--outline`: `#94A3B8`
- `--outline-variant`: `#E2E8F0`
- `--inverse-surface`: `#334155`
- `--inverse-on-surface`: `#F5F7FA`

Semantic:

- `--error`: `#DC2626`
- `--error-container`: `#FEE2E2`
- `--on-error-container`: `#991B1B`
- Add `--success`: `#16A34A` (+ `@theme` `--color-success`) for the new success swatch (optional utility; no mass class rewrites)

Also rewrite hardcoded greens in the same file:

- `.bg-gradient-hero` → rgba of `#0B2F6B` / `#144AA4`
- `.hover-border-expand:hover` → `#0B2F6B`
- `.hover-btn-primary:hover` inset → `#94A3B8` (was mint)
- `.input-minimal` border/focus → `#94A3B8` / `#144AA4`

### Component / docs follow-ups

- [`src/components/about-page.tsx`](src/components/about-page.tsx): replace decorative gradient hexes `#144622`, `#98fa7a`, `#f1eeea`, `#c1c9be` with the new primary/neutrals.
- Sync the color YAML + color narrative in [`docs/stitch/DESIGN.md`](docs/stitch/DESIGN.md) to this palette (Deep Emerald → ICG Blue `#144AA4`; drop mint accent language).
- Delete planning probe [`docs/stitch/design-system-overview.png`](docs/stitch/design-system-overview.png) so it is not committed.

## Out of scope

- Font swap to Merriweather/Inter
- Rounded buttons/inputs from the overview
- Favicon / OG assets
- Updating Stitch’s remote design-system JSON via API

## Verification

Spot-check with `npm run dev`: header/nav, home hero gradient, primary button hover accent, login/portal accents, About decorative panel, form focus/error states — all should read blue/slate with no remaining green/mint.