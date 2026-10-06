---
name: ICG Brand
colors:
  navy: '#0b1b33'
  navy-800: '#142a4a'
  navy-700: '#1f3a60'
  cream: '#f4f1ea'
  primary: '#0b1b33'
  on-primary: '#ffffff'
  primary-container: '#1f3a60'
  on-primary-container: '#c3cad6'
  surface: '#f4f1ea'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#efebe2'
  surface-container: '#e8e3d8'
  surface-container-high: '#dfd9cc'
  surface-container-highest: '#d6cfc0'
  on-surface: '#2b3445'
  on-surface-variant: '#5a6372'
  outline: '#8f8a7e'
  outline-variant: '#dcd5c7'
  secondary-fixed: '#c8b48c'
  error: '#b42318'
  success: '#2f7d4f'
typography:
  fontFamily: Inter
  display-lg: { fontSize: 64px, fontWeight: '600', lineHeight: '1.04', letterSpacing: -0.035em }
  headline-lg: { fontSize: 44px, fontWeight: '600', lineHeight: '1.1', letterSpacing: -0.03em }
  headline-lg-mobile: { fontSize: 32px, fontWeight: '600', lineHeight: '1.15', letterSpacing: -0.025em }
  headline-md: { fontSize: 26px, fontWeight: '600', lineHeight: '1.25', letterSpacing: -0.02em }
  body-lg: { fontSize: 18px, fontWeight: '400', lineHeight: '1.65' }
  body-md: { fontSize: 16px, fontWeight: '400', lineHeight: '1.6' }
  label-md: { fontSize: 12px, fontWeight: '600', lineHeight: '1.3', letterSpacing: 0.12em }
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system embodies the "Professional Intellectual" persona—authoritative, visionary, and meticulously structured. It is designed for global decision-makers who value clarity over decoration. 

The aesthetic is **Corporate Modern with Editorial influence**. It draws inspiration from high-end broadsheet journalism and luxury business publications. The style relies on high-contrast color pairings, precise typographic scales, and an expansive use of whitespace to signify prestige and focus. Visual interest is generated through the contrast between deep navy and warm cream, and crisp, functional layouts, rather than superfluous UI embellishments.

## Colors

The palette is two colours: **ICG Navy (#0B1B33)** and **Cream (#F4F1EA)**. Everything else is a tint of one of them.

- **Navy:** headings, primary buttons, heroes, closing call-to-action bands and the footer. Navy panels carry a faint 64px square grid that echoes the ICG mark (`.bg-grid-navy`).
- **Cream:** the page background. White (`surface-container-lowest`) is used for cards that sit on cream.
- **Ink:** body copy is `#2B3445`, secondary copy `#5A6372`. Never pure black.
- **Sand (#C8B48C):** a restrained accent for eyebrows and icons on navy only. Do not use it for text on cream.
- **Success / Error:** reserved for form states.

## Typography

**Inter** is used for everything, loaded through `next/font` (`--font-inter`). Hierarchy comes from size, weight (600 for headings) and tight negative tracking on large sizes, not from a second typeface.

- Page titles use `display-lg`; section titles `headline-lg`; card titles 20–26px.
- Eyebrows (`.eyebrow`) are 12px uppercase semibold with wide tracking and a short leading rule.
- Buttons (`.btn` + `.btn-primary` / `.btn-outline` / `.btn-light` / `.btn-outline-light`) are 13px uppercase semibold, 48px tall, square corners.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1280px central track on desktop to maintain line-length readability for long-form reports.

- **The 8px Grid:** All internal spacing (padding, margins between elements) must be multiples of 8px.
- **Section Breathing Room:** Use generous vertical margins (80px–120px) between major content sections to create a sense of premium "breathing room."
- **Data Grids:** Use a 12-column grid. On tablet, collapse to 8 columns. On mobile, use a single column with 20px side margins. 
- **Asymmetry:** Occasionally break the grid with "Editorial Insets"—images or quotes that span 8 columns but are offset to the right—to mimic high-end magazine layouts.

## Elevation & Depth

This design system avoids heavy drop shadows and skeuomorphism. Depth is achieved through **Tonal Layering** and **Line Work**.

- **Surface Tiers:** Use cream (#F4F1EA) as the "base" layer, with pure white cards sitting on top to indicate interactivity.
- **The "Ghost Border":** Rather than shadows, use thin (1px) borders in a slightly darker version of the background color to define containers.
- **Elevation-by-Color:** Interactive states should be signaled by a color shift to navy or a subtle scale-up (102%) rather than a shadow increase.
- **Glassmorphism:** Not used; the header is a solid cream bar.

## Shapes

The design system utilizes a **Sharp (0px)** aesthetic. 

The use of 90-degree angles conveys precision, discipline, and corporate rigor. Avoid rounded corners on buttons, cards, or input fields. The only exception to the "sharp" rule is for data visualization (e.g., circular pie charts) or team headshots, which should be contained within square frames to maintain the system's structural integrity.

## Components

- **Buttons:** Primary buttons are solid navy with cream text, 0px radius; secondary buttons are a 1px navy outline. On navy, use the cream (`btn-light`) and outline-light variants.
- **Input Fields:** Minimalist design with only a bottom border (2px) that turns navy on focus. Labels use the uppercase label style.
- **Cards:** Cards should have no shadow and a 1px border. On hover, the border changes to navy (`.card-hover`).
- **Lists:** Use navy check icons to highlight value propositions. Bullet points are replaced with thin horizontal rules between items.
- **Breadcrumbs & Labels:** Use Inter in uppercase with wide letter spacing for a "metadata" look.
- **Photography:** Use black-and-white or high-contrast, desaturated color photography. Subject matter should focus on global infrastructure, abstract architectural patterns, or candid "in-the-room" leadership moments.