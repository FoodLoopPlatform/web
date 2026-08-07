/**
 * TEMPORARY MOCK DATA
 * This file contains mock data used for Admin Portal User Detail View & Activity Logs while real backend endpoints are pending.
 * Remove this file once corresponding backend endpoints are fully live.
 */

import { UserDetail, UserActivityEntry } from "../types/admin.types";

export const MOCK_NOTES: Record<string, string> = {};

export const MOCK_USER_DETAILS: Record<string, UserDetail> = {
  "C-88219": {
    id: "C-88219",
    name: "Benjamin Thorne",
    email: "b.thorne@example.com",
    phone: "+20 (055) 062-6493",
    location: "Portland, OR – Zone 4A",
    joinedDate: "Oct 13, 2023",
    lastActive: "2 mins ago",
    status: "ACTIVE",
    role: "Consumer",
    avatar: undefined,
    stats: { totalOrders: 47, savedAmount: "EGP 2,340", activeDisputes: 0 },
  },
  "S-50192": {
    id: "S-50192",
    name: "El Abd Bakery",
    email: "ops@elabd.com",
    phone: "+20 (011) 123-4567",
    location: "Downtown, Cairo",
    joinedDate: "Mar 02, 2024",
    lastActive: "Just now",
    status: "ACTIVE",
    role: "Store",
    stats: { totalSales: "EGP 42,390", fulfillmentRate: 94, activeDisputes: 1 },
  },
  "CH-55122": {
    id: "CH-55122",
    name: "Resala Charity",
    email: "info@resala.org",
    phone: "+20 (02) 2606-5700",
    location: "Nasr City, Cairo",
    joinedDate: "Dec 20, 2023",
    lastActive: "1 day ago",
    status: "ACTIVE",
    role: "Charity",
    stats: {
      donationsReceived: 318,
      savedAmount: "EGP 18,450",
      activeDisputes: 0,
    },
  },
};

export const MOCK_ACTIVITY: Record<string, UserActivityEntry[]> = {
  "S-50192": [
    {
      id: "A1",
      type: "order",
      title: "Order Completed",
      description:
        "Order #ORD-88219 (Artisan Sourdough Batch) successfully delivered and confirmed by buyer.",
      timestamp: "2025-11-28 14:22",
    },
    {
      id: "A2",
      type: "dispute",
      title: "Dispute Raised",
      description:
        "Logistics delay reported on Order #ORD-87720. Admin review completed, dispute closed in favor of seller.",
      timestamp: "2025-11-15 09:18",
    },
    {
      id: "A3",
      type: "listing",
      title: "Listing Published",
      description:
        "Added new product listing 'Seasonal Heirloom Tomato Crate'.",
      timestamp: "2025-10-26 16:45",
    },
    {
      id: "A4",
      type: "verified",
      title: "Document Verified",
      description:
        "Business tax ID and health certificates verified by Admin Sarah Jenkins.",
      timestamp: "2025-10-15 11:38",
    },
    {
      id: "A5",
      type: "created",
      title: "Account Created",
      description: "New store owner registration from Downtown, Cairo.",
      timestamp: "2025-10-12 08:05",
    },
  ],
  "C-88219": [
    {
      id: "B1",
      type: "order",
      title: "Order Completed",
      description:
        "Purchased 'Mixed Donuts Box' from El Abd Bakery — saved EGP 100.",
      timestamp: "2025-11-30 10:10",
    },
    {
      id: "B2",
      type: "dispute",
      title: "Dispute Opened",
      description:
        "Raised a dispute for order #ORD-88100 — item not matching description.",
      timestamp: "2025-11-10 14:55",
    },
    {
      id: "B3",
      type: "created",
      title: "Account Created",
      description: "Consumer account registered from Zamalek, Cairo.",
      timestamp: "2025-10-13 09:00",
    },
  ],
};
