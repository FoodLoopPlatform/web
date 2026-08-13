import { Suspense } from "react";
import { DisputesShell, DisputesSkeleton } from "../components";
import {
  getDisputesServer,
  getSupportTicketsServer,
  getAdminReviewsServer,
} from "../api/server-admin-api";

export default async function DisputesPage() {
  const [disputesRes, ticketsRes, reviewsRes] = await Promise.all([
    getDisputesServer(),
    getSupportTicketsServer(),
    getAdminReviewsServer(),
  ]);

  return (
    <Suspense fallback={<DisputesSkeleton />}>
      <DisputesShell
        initialDisputes={disputesRes.data ?? []}
        initialTickets={ticketsRes.data ?? []}
        initialReviews={reviewsRes.data ?? []}
      />
    </Suspense>
  );
}
