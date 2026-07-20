---
name: FoodLoop RTL
colors:
  surface: "#fafaf4"
  surface-dim: "#dadad5"
  surface-bright: "#fafaf4"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f4f4ee"
  surface-container: "#eeeee9"
  surface-container-high: "#e8e8e3"
  surface-container-highest: "#e3e3de"
  on-surface: "#1a1c19"
  on-surface-variant: "#404941"
  inverse-surface: "#2f312e"
  inverse-on-surface: "#f1f1ec"
  outline: "#707a70"
  outline-variant: "#bfc9be"
  surface-tint: "#266b40"
  primary: "#00381a"
  on-primary: "#ffffff"
  primary-container: "#005129"
  on-primary-container: "#7dc390"
  inverse-primary: "#90d6a2"
  secondary: "#5a605a"
  on-secondary: "#ffffff"
  secondary-container: "#dfe4dc"
  on-secondary-container: "#606660"
  tertiary: "#402c00"
  on-tertiary: "#ffffff"
  tertiary-container: "#5c4100"
  on-tertiary-container: "#e3aa2b"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#abf3bc"
  primary-fixed-dim: "#90d6a2"
  on-primary-fixed: "#00210d"
  on-primary-fixed-variant: "#02522a"
  secondary-fixed: "#dfe4dc"
  secondary-fixed-dim: "#c3c8c1"
  on-secondary-fixed: "#181d18"
  on-secondary-fixed-variant: "#434843"
  tertiary-fixed: "#ffdea4"
  tertiary-fixed-dim: "#f8bd3e"
  on-tertiary-fixed: "#261900"
  on-tertiary-fixed-variant: "#5d4200"
  background: "#fafaf4"
  on-background: "#1a1c19"
  surface-variant: "#e3e3de"
typography:
  headline-lg:
    fontFamily: Cairo
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Cairo
    fontSize: 26px
    fontWeight: "700"
    lineHeight: 40px
  headline-md:
    fontFamily: Cairo
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 36px
  body-lg:
    fontFamily: Cairo
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Cairo
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 26px
  label-md:
    fontFamily: Cairo
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 22px
  brand-mark:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: "700"
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system embodies "Warm-Tech Organic," a personality that balances high-efficiency logistics with the tactile, approachable nature of sustainability. It targets urban professionals and eco-conscious businesses, evoking a sense of growth, trust, and community stewardship.

The design style utilizes a refined **Minimalism** blended with **Tactile** elements. We use generous white space to allow the Arabic script to breathe, paired with soft, organic card structures that feel substantial yet approachable. The interface avoids cold, clinical tech tropes in favor of soft-focus backgrounds and high-quality photography of natural produce, creating a sense of "digital earthiness."

## Colors

The palette is rooted in a deep, forest-toned primary green (#005129), representing the "Organic" pillar of the brand. This is supported by a secondary mint-wash neutral (#F4F9F1) used for large surface areas to reduce visual fatigue.

A tertiary "Sunlight" gold (#E8AF30) is reserved for interactive highlights and status indicators. Neutrals are slightly warmed, avoiding pure blacks to maintain the soft-tech aesthetic. Color application follows an 60-30-10 distribution to ensure the brand's primary green remains the dominant anchor without overwhelming the content.

## Typography

For this design system, **Cairo** is the primary typeface for its exceptional legibility in Arabic and its geometric modernism that aligns with the brand's tech-forward nature.

Key Typography Rules:

- **Directionality:** Default layout is Right-to-Left (RTL).
- **Alignment:** All text defaults to right-aligned.
- **Line Heights:** Increased by ~15% compared to standard Latin presets to prevent clipping of Arabic diacritics and ascenders/descenders.
- **Brand Name:** "FoodLoop" remains in Latin script (Plus Jakarta Sans) to maintain global brand equity, but is contextually embedded within the RTL flow.
- **Contrast:** Headlines use a heavier weight (Bold/600+) to provide a strong visual anchor against the more delicate body text.

## Layout & Spacing

This design system utilizes a **Fluid Grid** model optimized for RTL reading patterns. The eye scans from top-right to bottom-left.

- **Grid:** A 12-column grid on desktop, scaling to 4 columns on mobile.
- **Mirroring:** All horizontal spacing and layout structures are mirrored. Navigation icons that indicate direction (like arrows) must be flipped.
- **Rhythm:** An 8px base unit (the "Warm-Tech 8") governs all padding and margins.
- **Safe Zones:** Generous right-side margins ensure that primary navigation anchors are prominent and easily accessible for thumb-driven mobile interaction.

## Elevation & Depth

Depth is created through **Tonal Layers** and extremely soft **Ambient Shadows**. We avoid heavy dropshadows in favor of subtle "lift."

- **Level 1 (Base):** The mint-wash neutral background.
- **Level 2 (Cards):** Pure white surfaces with a 1px stroke (#E0E6DF) and a 15% opacity primary-tinted shadow.
- **Level 3 (Interactive):** Elevated state for hovered cards or active modals, using a more pronounced, diffused shadow to signal clickability.
- **Micro-Depth:** Inset shadows are used sparingly for form inputs to create a tactile, "etched" feeling into the organic surface.

## Shapes

In line with the "Warm-Tech" narrative, the shape language is intentionally soft.

- **Primary Radius:** 0.5rem (8px) is the standard for most components.
- **Large Components:** Cards and major containers utilize `rounded-lg` (16px) to emphasize the organic, non-industrial feel.
- **Iconography:** Icons should feature rounded caps and corners. Sharp 90-degree angles are prohibited in the UI to maintain the approachable brand personality.

## Components

Consistent RTL styling for core elements:

- **Buttons:** High-contrast primary green with white text. Icons within buttons are placed to the left of the text (mirrored from LTR).
- **Cards:** The foundational element. Cards feature 16px padding and `rounded-lg` corners. Content inside mirrors the RTL flow—images on the left, text on the right (or stacked).
- **Inputs:** Labels are right-aligned above the field. Right-side padding is increased to accommodate the start of the Arabic character string.
- **Chips/Badges:** Small, `rounded-xl` (pill-shaped) elements using the tertiary gold for status (e.g., "Organic", "Nearby").
- **Lists:** Bullet points or icons appear on the right side of the list item text.
- **Navigation:** Bottom navigation on mobile uses clear, mirrored iconography with labels in Cairo Medium.
