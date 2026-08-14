/**
 * Admin Portal Design Tokens System
 * Unified visual architecture for colors, severity tiers, stat treatments, and timelines.
 */

export const ADMIN_DESIGN_TOKENS = {
  // ─── Color Palette & Semantic Roles ───────────────────────────────────────
  colors: {
    brand: {
      primary: "#004d3d", // Platform Emerald/Teal Primary
      primaryContainer: "bg-primary-container text-white",
      primarySubtle: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    success: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      badge:
        "bg-emerald-100 text-emerald-800 border-emerald-300 font-extrabold",
      iconBg: "bg-emerald-500/10 text-emerald-600",
    },
    warning: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-800 border-amber-300 font-extrabold",
      iconBg: "bg-amber-500/10 text-amber-600",
    },
    danger: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      badge: "bg-red-100 text-red-800 border-red-300 font-extrabold",
      iconBg: "bg-red-500/10 text-red-600",
    },
    neutral: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      mutedText: "text-outline/70",
      emptyState: "text-outline/50 bg-slate-100/70 border-slate-200/60",
    },
  },

  // ─── Action Severity Tiers (Platform Action List) ─────────────────────────
  actionTiers: {
    DESTRUCTIVE: {
      container:
        "bg-red-50/80 hover:bg-red-100/80 border-red-200/80 text-red-800 shadow-2xs",
      iconBox: "bg-red-500/15 text-red-600 ring-2 ring-red-300/40",
      label: "text-red-900 font-black",
      sublabel: "text-red-700/80 font-medium",
      badge:
        "bg-red-600 text-white text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded",
    },
    WARNING: {
      container:
        "bg-amber-50/70 hover:bg-amber-100/80 border-amber-200/80 text-amber-900",
      iconBox: "bg-amber-500/15 text-amber-600 ring-1 ring-amber-300/40",
      label: "text-amber-950 font-bold",
      sublabel: "text-amber-800/80 font-medium",
    },
    ROUTINE_POSITIVE: {
      container:
        "bg-emerald-50/70 hover:bg-emerald-100/80 border-emerald-200/80 text-emerald-900",
      iconBox: "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-300/40",
      label: "text-emerald-950 font-bold",
      sublabel: "text-emerald-800/80 font-medium",
    },
    ROUTINE_NEUTRAL: {
      container:
        "bg-white hover:bg-slate-50 border-card-border text-on-surface",
      iconBox: "bg-surface-container text-outline",
      label: "text-on-surface font-bold",
      sublabel: "text-outline font-medium",
    },
    MUTED: {
      container:
        "bg-slate-50/60 border-slate-200/50 text-outline/50 cursor-not-allowed",
      iconBox: "bg-slate-200/50 text-outline/40",
      label: "text-outline/60 font-semibold",
      sublabel: "text-outline/40 font-normal",
    },
  },

  // ─── Stat Card Treatments ──────────────────────────────────────────────────
  statCard: {
    active: {
      container:
        "bg-white border-card-border shadow-sm hover:shadow-md transition-all",
      value: "text-on-surface font-black text-xl sm:text-2xl tracking-tight",
      label: "text-on-surface-variant font-bold text-xs",
      iconBox: "bg-primary-container/10 text-primary-container",
    },
    empty: {
      container: "bg-slate-50/60 border-slate-200/80 shadow-2xs opacity-80",
      value: "text-outline/50 font-semibold text-lg italic",
      label: "text-outline/70 font-medium text-xs",
      iconBox: "bg-slate-200/50 text-outline/40",
    },
  },

  // ─── Timeline Nodes & Badges ──────────────────────────────────────────────
  timeline: {
    connectorLine: "border-s-2 border-emerald-200/70 dark:border-emerald-950",
    timestamp:
      "text-[10px] font-mono font-medium text-outline bg-surface-container/60 px-2 py-0.5 rounded-md border border-outline-variant/30",
  },
} as const;

/**
 * Checks whether a given stat value represents an empty or zero state
 */
export function isStatEmpty(
  value: string | number | null | undefined,
): boolean {
  if (value === null || value === undefined) return true;
  const str = String(value).trim();
  return (
    str === "0" ||
    str === "0.00" ||
    str === "0%" ||
    str === "—" ||
    str === "-" ||
    str === "EGP 0" ||
    str === "EGP 0.00" ||
    str === ""
  );
}
