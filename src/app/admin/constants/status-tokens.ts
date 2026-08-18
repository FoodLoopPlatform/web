export interface StatusBadgeToken {
  textKey: "active" | "pending" | "suspended" | "open" | "closed" | "banned";
  classes: string;
  accentBarClass: string;
}

export const statusBadgeTokens: Record<string, StatusBadgeToken> = {
  ACTIVE: {
    textKey: "active",
    classes:
      "bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold shadow-2xs",
    accentBarClass: "bg-emerald-500/20",
  },
  Active: {
    textKey: "active",
    classes:
      "bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold shadow-2xs",
    accentBarClass: "bg-emerald-500/20",
  },
  APPROVED: {
    textKey: "active",
    classes:
      "bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold shadow-2xs",
    accentBarClass: "bg-emerald-500/20",
  },
  VERIFIED: {
    textKey: "active",
    classes:
      "bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold shadow-2xs",
    accentBarClass: "bg-emerald-500/20",
  },
  PENDING: {
    textKey: "pending",
    classes:
      "bg-amber-100 text-amber-800 border border-amber-300 font-extrabold shadow-2xs",
    accentBarClass: "bg-amber-500/20",
  },
  Pending: {
    textKey: "pending",
    classes:
      "bg-amber-100 text-amber-800 border border-amber-300 font-extrabold shadow-2xs",
    accentBarClass: "bg-amber-500/20",
  },
  SUSPENDED: {
    textKey: "suspended",
    classes:
      "bg-rose-100 text-rose-800 border border-rose-300 font-extrabold shadow-2xs",
    accentBarClass: "bg-rose-500/20",
  },
  Suspended: {
    textKey: "suspended",
    classes:
      "bg-rose-100 text-rose-800 border border-rose-300 font-extrabold shadow-2xs",
    accentBarClass: "bg-rose-500/20",
  },
  Open: {
    textKey: "open",
    classes:
      "bg-rose-100 text-rose-800 border border-rose-300 font-extrabold shadow-2xs",
    accentBarClass: "bg-rose-500/20",
  },
  Closed: {
    textKey: "closed",
    classes:
      "bg-slate-100 text-slate-800 border border-slate-300 font-extrabold shadow-2xs",
    accentBarClass: "bg-slate-500/20",
  },
  BANNED: {
    textKey: "banned",
    classes:
      "bg-red-700 text-white border border-red-900 font-extrabold shadow-2xs",
    accentBarClass: "bg-red-900/40",
  },
  Banned: {
    textKey: "banned",
    classes:
      "bg-red-700 text-white border border-red-900 font-extrabold shadow-2xs",
    accentBarClass: "bg-red-900/40",
  },
};

export const getPriorityBadgeClasses = (priority: string): string => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 border-red-200";
    case "Medium":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "Low":
    default:
      return "bg-green-100 text-green-800 border-green-200";
  }
};
