---
name: Executive Perspective
colors:
  surface: '#f5f7fa'
  surface-dim: '#c8d3e0'
  surface-bright: '#f5f7fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f7fa'
  surface-container: '#e2e8f0'
  surface-container-high: '#d5dee9'
  surface-container-highest: '#c8d3e0'
  on-surface: '#475569'
  on-surface-variant: '#64748b'
  inverse-surface: '#334155'
  inverse-on-surface: '#f5f7fa'
  outline: '#94a3b8'
  outline-variant: '#e2e8f0'
  surface-tint: '#144aa4'
  primary: '#0b2f6b'
  on-primary: '#ffffff'
  primary-container: '#144aa4'
  on-primary-container: '#d6e4f7'
  inverse-primary: '#8fb0e0'
  secondary: '#475569'
  on-secondary: '#ffffff'
  secondary-container: '#e2e8f0'
  on-secondary-container: '#144aa4'
  tertiary: '#481423'
  on-tertiary: '#ffffff'
  tertiary-container: '#632a38'
  on-tertiary-container: '#df92a1'
  error: '#dc2626'
  on-error: '#ffffff'
  error-container: '#fee2e2'
  on-error-container: '#991b1b'
  success: '#16a34a'
  primary-fixed: '#c5d8f0'
  primary-fixed-dim: '#8fb0e0'
  on-primary-fixed: '#0b2f6b'
  on-primary-fixed-variant: '#144aa4'
  secondary-fixed: '#94a3b8'
  secondary-fixed-dim: '#64748b'
  on-secondary-fixed: '#334155'
  on-secondary-fixed-variant: '#475569'
  tertiary-fixed: '#ffd9df'
  tertiary-fixed-dim: '#ffb1c0'
  on-tertiary-fixed: '#390918'
  on-tertiary-fixed-variant: '#6f3442'
  background: '#f5f7fa'
  on-background: '#475569'
  surface-variant: '#e2e8f0'
  off-white: '#F5F7FA'
  pure-white: '#FFFFFF'
typography:
  display-lg:
    fontFamily: sourceSerif4
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: sourceSerif4
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: sourceSerif4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: sourceSerif4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: hankenGrotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: hankenGrotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: hankenGrotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system embodies the "Professional Intellectual" persona—authoritative, visionary, and meticulously structured. It is designed for global decision-makers who value clarity over decoration. 

The aesthetic is **Corporate Modern with Editorial influence**. It draws inspiration from high-end broadsheet journalism and luxury business publications. The style relies on high-contrast color pairings, precise typographic scales, and an expansive use of whitespace to signify prestige and focus. Visual interest is generated through the tension between a deep ICG Blue and crisp, functional layouts, rather than superfluous UI embellishments.

## Colors

The palette is anchored by **ICG Blue (#144AA4)**, representing trust and clarity. Slate neutrals (`#F5F7FA`–`#475569`) provide structure; **Success (#16A34A)** and **Error (#DC2626)** are reserved for semantic states.

- **Primary:** Use for headers, primary navigation, and core brand moments (`#144AA4` / deeper navy `#0B2F6B`).
- **Secondary:** Use slate accents for interactive states and secondary button fills (`#E2E8F0` / `#94A3B8`).
- **Backgrounds:** Use pure white for high-density information and cool off-white (`#F5F7FA`) for editorial sections and long-form thought leadership.
- **Typography:** Body text should utilize slate (`#475569`) to maintain high legibility while appearing softer than pure black.

## Typography

This design system uses a traditional serif-on-sans pairing to signal both heritage and modernity. 

**Source Serif 4** serves as the primary headline face. It provides the "institutional" voice. Use it for H1-H3 levels. Display sizes should utilize tighter letter spacing to feel more curated.

**Hanken Grotesk** is used for all functional and body elements. It is a clean, contemporary sans-serif that ensures high readability in data-heavy reports and dashboards. Labels and small metadata should be set in semi-bold with increased letter spacing and uppercase styling to provide clear hierarchy in navigation and tables.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1280px central track on desktop to maintain line-length readability for long-form reports.

- **The 8px Grid:** All internal spacing (padding, margins between elements) must be multiples of 8px.
- **Section Breathing Room:** Use generous vertical margins (80px–120px) between major content sections to create a sense of premium "breathing room."
- **Data Grids:** Use a 12-column grid. On tablet, collapse to 8 columns. On mobile, use a single column with 20px side margins. 
- **Asymmetry:** Occasionally break the grid with "Editorial Insets"—images or quotes that span 8 columns but are offset to the right—to mimic high-end magazine layouts.

## Elevation & Depth

This design system avoids heavy drop shadows and skeuomorphism. Depth is achieved through **Tonal Layering** and **Line Work**.

- **Surface Tiers:** Use the cool off-white (#F5F7FA) as a "base" layer, with pure white cards sitting on top to indicate interactivity.
- **The "Ghost Border":** Rather than shadows, use thin (1px) borders in a slightly darker version of the background color to define containers.
- **Elevation-by-Color:** Interactive states should be signaled by a color shift to Primary ICG Blue or a subtle scale-up (102%) rather than a shadow increase.
- **Glassmorphism:** Reserved exclusively for sticky navigation bars to maintain context of the content beneath, using a subtle backdrop blur (12px).

## Shapes

The design system utilizes a **Sharp (0px)** aesthetic. 

The use of 90-degree angles conveys precision, discipline, and corporate rigor. Avoid rounded corners on buttons, cards, or input fields. The only exception to the "sharp" rule is for data visualization (e.g., circular pie charts) or team headshots, which should be contained within square frames to maintain the system's structural integrity.

## Components

- **Buttons:** Primary buttons are solid ICG Blue (#144AA4) with white text, 0px radius. Secondary buttons use a light slate fill (#E2E8F0) or a 1px border. The hover state for primary buttons should reveal a thin 4px bottom-accent of slate (#94A3B8).
- **Input Fields:** Minimalist design with only a bottom border (2px) that turns ICG Blue on focus. Labels should be small-cap Hanken Grotesk.
- **Cards:** Cards should have no shadow and a 1px border. On hover, the border thickness increases to 2px or changes to the Primary Blue color.
- **Lists:** Use custom "Check" icons in Success green (#16A34A) to highlight value propositions. Bullet points are replaced with thin horizontal rules between items.
- **Breadcrumbs & Labels:** Use Hanken Grotesk in uppercase with 0.05em letter spacing for a "metadata" look.
- **Photography:** Use black-and-white or high-contrast, desaturated color photography. Subject matter should focus on global infrastructure, abstract architectural patterns, or candid "in-the-room" leadership moments.