import { AdminNoteItem } from "../types/admin.types";

/**
 * Fixture data for local development & storybook testing of administrative notes.
 */
export const DEFAULT_INITIAL_NOTES: AdminNoteItem[] = [
  {
    id: "note-1",
    recipientId: "usr-101",
    recipientName: "Ahmed Hassan",
    recipientRole: "Consumer",
    title: "Account Loyalty Bonus",
    content:
      "Customer reached 10 completed surplus bag orders. Sent digital thank-you voucher.",
    category: "INFO",
    isInternal: false,
    createdAt: "2026-08-14 11:30",
    createdBy: "Admin Moderation",
  },
  {
    id: "note-2",
    recipientId: "str-202",
    recipientName: "El Abd Bakery",
    recipientRole: "Store",
    title: "Commercial License Verification Request",
    content:
      "Store updated commercial tax certificate. Pending document review for re-verification.",
    category: "WARNING",
    isInternal: true,
    createdAt: "2026-08-13 16:45",
    createdBy: "System Compliance",
  },
  {
    id: "note-3",
    recipientId: "chr-303",
    recipientName: "Resala Charity Org",
    recipientRole: "Charity",
    title: "Urgent Food Surplus Distribution Alert",
    content:
      "Notified charity coordinator regarding 50kg fresh produce available from Giza Hub.",
    category: "URGENT",
    isInternal: false,
    createdAt: "2026-08-12 09:15",
    createdBy: "Admin Logistics",
  },
];
