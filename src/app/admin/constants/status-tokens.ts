export interface StatusBadgeToken {
  textKey: "active" | "pending" | "suspended" | "open" | "closed";
  classes: string;
  accentBarClass: string;
}

export const statusBadgeTokens: Record<string, StatusBadgeToken> = {
  ACTIVE: {
    textKey: "active",
    classes: "bg-green-100 text-green-800 border border-green-200",
    accentBarClass: "bg-green-500/20",
  },
  PENDING: {
    textKey: "pending",
    classes: "bg-amber-100 text-amber-800 border border-amber-200",
    accentBarClass: "bg-amber-500/20",
  },
  SUSPENDED: {
    textKey: "suspended",
    classes: "bg-red-100 text-red-800 border border-red-200",
    accentBarClass: "bg-red-500/20",
  },
  Open: {
    textKey: "open",
    classes: "bg-red-100 text-red-800 border border-red-200",
    accentBarClass: "bg-red-500/20",
  },
  Pending: {
    textKey: "pending",
    classes: "bg-amber-100 text-amber-800 border border-amber-200",
    accentBarClass: "bg-amber-500/20",
  },
  Closed: {
    textKey: "closed",
    classes: "bg-gray-100 text-gray-800 border border-gray-200",
    accentBarClass: "bg-gray-500/20",
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
