import type { SupportTicket, TicketReply, TicketStatus } from "../api/types";

export const STATUS_LABELS: Record<TicketStatus, string> = {
  Open: "بانتظار الرد",
  Pending: "قيد المراجعة",
  Closed: "تم الحل",
};

export const STATUS_BADGE_CLASSES: Record<TicketStatus, string> = {
  Open: "bg-error-container text-on-error-container",
  Pending: "bg-tertiary-container text-on-tertiary-container",
  Closed: "bg-primary-fixed text-primary",
};

export const PRIORITY_LABELS: Record<SupportTicket["priority"], string> = {
  High: "أولوية عالية",
  Medium: "أولوية متوسطة",
  Low: "أولوية منخفضة",
};

export const PRIORITY_BADGE_CLASSES: Record<SupportTicket["priority"], string> =
  {
    High: "bg-error-container text-on-error-container",
    Medium: "bg-tertiary-container text-on-tertiary-container",
    Low: "bg-secondary-container text-on-secondary-container",
  };

export const USER_TYPE_LABELS: Record<SupportTicket["userType"], string> = {
  Consumer: "مستهلك",
  Store: "متجر شريك",
  Charity: "جمعية خيرية",
};

export const REPLY_SENDER_LABELS: Record<TicketReply["sender"], string> = {
  User: "العميل",
  Store: "أنت (المتجر)",
  Admin: "فريق الدعم",
  System: "النظام",
};

export function formatDisputeDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDisputeDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return initials.toUpperCase();
}
