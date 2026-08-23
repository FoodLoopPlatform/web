import { Suspense } from "react";
import { DisputesShell, DisputesSkeleton } from "../components";
import {
  getDisputesServer,
  getSupportTicketsServer,
  getAdminReviewsServer,
} from "../api/server-admin-api";
import { getAuditLogsServer } from "../api/server-audit-log-api";

export const metadata = {
  title: "النزاعات والتظلمات | Disputes & Support",
  description:
    "FoodLoop Admin Portal - Dispute Resolution, Customer Support Tickets, and Review Moderation",
};

export default async function DisputesPage() {
  const [disputesRes, ticketsRes, reviewsRes, auditRes] = await Promise.all([
    getDisputesServer(),
    getSupportTicketsServer(),
    getAdminReviewsServer(),
    getAuditLogsServer({ pageSize: 5 }),
  ]);

  return (
    <Suspense fallback={<DisputesSkeleton />}>
      <DisputesShell
        initialDisputes={disputesRes.data ?? []}
        initialTickets={ticketsRes.data ?? []}
        initialReviews={reviewsRes.data ?? []}
        initialAuditLogs={auditRes.items ?? []}
      />
    </Suspense>
  );
}
