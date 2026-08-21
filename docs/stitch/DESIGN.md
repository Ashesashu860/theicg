---
name: Executive Perspective
colors:
  surface: '#f8f9fd'
  surface-dim: '#d8dade'
  surface-bright: '#f8f9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3f7'
  surface-container: '#eceef2'
  surface-container-high: '#e7e8ec'
  surface-container-highest: '#e1e2e6'
  on-surface: '#191c1f'
  on-surface-variant: '#414940'
  inverse-surface: '#2e3134'
  inverse-on-surface: '#eff1f5'
  outline: '#717970'
  outline-variant: '#c1c9be'
  surface-tint: '#386941'
  primary: '#002f10'
  on-primary: '#ffffff'
  primary-container: '#144622'
  on-primary-container: '#80b486'
  inverse-primary: '#9ed3a3'
  secondary: '#156e00'
  on-secondary: '#ffffff'
  secondary-container: '#95f777'
  on-secondary-container: '#177300'
  tertiary: '#481423'
  on-tertiary: '#ffffff'
  tertiary-container: '#632a38'
  on-tertiary-container: '#df92a1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b9f0bd'
  primary-fixed-dim: '#9ed3a3'
  on-primary-fixed: '#00210a'
  on-primary-fixed-variant: '#1f502b'
  secondary-fixed: '#98fa7a'
  secondary-fixed-dim: '#7ddd61'
  on-secondary-fixed: '#032100'
  on-secondary-fixed-variant: '#0e5300'
  tertiary-fixed: '#ffd9df'
  tertiary-fixed-dim: '#ffb1c0'
  on-tertiary-fixed: '#390918'
  on-tertiary-fixed-variant: '#6f3442'
  background: '#f8f9fd'
  on-background: '#191c1f'
  surface-variant: '#e1e2e6'
  off-white: '#F1EEEA'
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

The aesthetic is **Corporate Modern with Editorial influence**. It draws inspiration from high-end broadsheet journalism and luxury business publications. The style relies on high-contrast color pairings, precise typographic scales, and an expansive use of whitespace to signify prestige and focus. Visual interest is generated through the tension between a deep, "BCG Green" and crisp, functional layouts, rather than superfluous UI embellishments.

## Colors

The palette is anchored by **Deep Emerald (#144622)**, representing stability and growth. This is contrasted with **Neon Mint (#96F878)**, used sparingly for high-impact calls to action or to highlight key data insights.

- **Primary:** Use for headers, primary navigation, and core brand moments.
- **Secondary:** Use as a disruptive accent for interactive states or highlighting success metrics.
- **Backgrounds:** Use pure white for high-density information and the off-white "Parchment" (#F1EEEA) for editorial sections and long-form thought leadership to reduce eye strain.
- **Typography:** Body text should utilize the near-black neutral (#212427) to maintain high legibility while appearing softer than pure black.

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

- **Surface Tiers:** Use the off-white (#F1EEEA) as a "base" layer, with pure white cards sitting on top to indicate interactivity.
- **The "Ghost Border":** Rather than shadows, use thin (1px) borders in a slightly darker version of the background color to define containers.
- **Elevation-by-Color:** Interactive states should be signaled by a color shift to the Primary Deep Green or a subtle scale-up (102%) rather than a shadow increase.
- **Glassmorphism:** Reserved exclusively for sticky navigation bars to maintain context of the content beneath, using a subtle backdrop blur (12px).

## Shapes

The design system utilizes a **Sharp (0px)** aesthetic. 

The use of 90-degree angles conveys precision, discipline, and corporate rigor. Avoid rounded corners on buttons, cards, or input fields. The only exception to the "sharp" rule is for data visualization (e.g., circular pie charts) or team headshots, which should be contained within square frames to maintain the system's structural integrity.

## Components

- **Buttons:** Primary buttons are solid Deep Green (#144622) with white text, 0px radius. Secondary buttons use a 1px border. The hover state for primary buttons should reveal a thin 4px bottom-accent of Neon Mint.
- **Input Fields:** Minimalist design with only a bottom border (2px) that turns Deep Green on focus. Labels should be small-cap Hanken Grotesk.
- **Cards:** Cards should have no shadow and a 1px border. On hover, the border thickness increases to 2px or changes to the Primary Green color.
- **Lists:** Use custom "Check" icons in Neon Mint to highlight value propositions. Bullet points are replaced with thin horizontal rules between items.
- **Breadcrumbs & Labels:** Use Hanken Grotesk in uppercase with 0.05em letter spacing for a "metadata" look.
- **Photography:** Use black-and-white or high-contrast, desaturated color photography. Subject matter should focus on global infrastructure, abstract architectural patterns, or candid "in-the-room" leadership moments.