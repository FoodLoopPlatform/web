import { getServerAccessToken } from "@/utils/server-api-client";
import { getOrders } from "./api/orders-api";
import { OrdersPageContainer } from "./OrdersPageContainer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Orders Dashboard | FoodLoop Merchant Portal",
  description:
    "Real-time active order management and fulfillment tracking for FoodLoop merchant central.",
};

export default async function OrdersPage() {
  const token = await getServerAccessToken();
  const { data: initialOrders } = await getOrders("ar", token);

  return <OrdersPageContainer initialOrders={initialOrders || []} />;
}
