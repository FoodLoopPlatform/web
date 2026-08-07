/**
 * FoodLoop Admin Portal Design System & Color Tokens
 */

export const ADMIN_COLORS = {
  // Brand Greens (linked to global theme)
  primary: "var(--color-primary-container)",
  primaryHover: "var(--color-on-primary-fixed-variant)",
  primaryDark: "var(--color-primary)",
  primaryLightBg: "var(--color-light-green)",

  // Backgrounds & Surfaces
  bgMain: "var(--color-surface)",
  bgCard: "var(--color-surface-container-lowest)",
  bgSubtle: "var(--color-surface-container)",
  bgHover: "var(--color-surface-container-low)",

  // Borders
  borderLight: "var(--color-card-border)",
  borderMedium: "var(--color-outline-variant)",

  // Typography
  textHeading: "var(--color-on-surface)",
  textBody: "var(--color-on-surface-variant)",
  textMuted: "var(--color-outline)",

  // Status Colors
  activeBg: "bg-green-100",
  activeText: "text-green-800",
  activeBorder: "border-green-200",

  pendingBg: "bg-amber-100",
  pendingText: "text-amber-800",
  pendingBorder: "border-amber-200",

  suspendedBg: "bg-red-100",
  suspendedText: "text-red-800",
  suspendedBorder: "border-red-200",
} as const;
