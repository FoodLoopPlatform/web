import React from "react";
import Link from "next/link";
import { getServerAccessToken } from "@/utils/server-api-client";
import { getOrderById } from "../api/orders-api";
import { OrderDetailPageContainer } from "./OrderDetailPageContainer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const VALID_ORDER_ID_REGEX = /^[A-Za-z0-9_-]{3,64}$/;

export async function generateMetadata({ params }: OrderDetailPageProps) {
  const { id } = await params;
  return {
    title: `Order #${id} Details | FoodLoop Merchant Portal`,
    description: `Fulfillment control and order details for order #${id}.`,
  };
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;

  // Validate order ID route param before fetching
  if (!id || !VALID_ORDER_ID_REGEX.test(id)) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 text-center font-sans select-none">
        <h2 className="text-xl font-bold text-on-surface mb-2">
          Invalid Order ID
        </h2>
        <p className="text-xs text-outline mb-4">
          The requested order ID format is invalid.
        </p>
        <Link
          href="/orders"
          className="bg-[#0B3C26] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs hover:bg-primary transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const token = await getServerAccessToken();
  const { data: order } = await getOrderById(id, "ar", token);

  return <OrderDetailPageContainer initialOrder={order} orderId={id} />;
}
