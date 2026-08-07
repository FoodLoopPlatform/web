// TEMPORARY mock data for System Settings until production API endpoints are finalized.

import {
  GlobalAutomationDefaults,
  GuidelineDocument,
  PlatformAdmin,
  SecuritySettings,
  AiObservabilitySettings,
} from "../types/admin.types";

export const initialAutomationDefaults: GlobalAutomationDefaults = {
  maxDiscountPerCycle: 10, // Hard-clamped 1-15% per proposal spec
  defaultPriceFloorPolicy: "DYNAMIC_AI",
  newBusinessDefaultMode: "Assisted",
  autoVerifyStores: false,
  bulkUploads: true,
};

export const initialGuidelineDocuments: GuidelineDocument[] = [
  {
    id: "DOC-101",
    name: "Egyptian Food Safety Standards (NFSA Law No. 1/2017)",
    category: "Egyptian Food Safety & Regulations",
    version: "v2.4",
    lastUpdated: "2026-07-28",
    fileSize: "2.4 MB",
    status: "Published",
    lastRagIndexedAt: "2026-07-28 14:30",
  },
  {
    id: "DOC-102",
    name: "Perishable Surplus Donation Eligibility Criteria",
    category: "Food Handling & Eligibility",
    version: "v1.8",
    lastUpdated: "2026-08-01",
    fileSize: "1.1 MB",
    status: "Published",
    lastRagIndexedAt: "2026-08-01 09:15",
  },
  {
    id: "DOC-103",
    name: "Historical Seasonal Surplus & Demand Index (Cairo & Giza)",
    category: "Sales & Demand Patterns",
    version: "v3.0",
    lastUpdated: "2026-08-03",
    fileSize: "4.5 MB",
    status: "Published",
    lastRagIndexedAt: "2026-08-03 16:45",
  },
  {
    id: "DOC-104",
    name: "Partner Store Inventory Taxonomy & Shelf-Life Matrix",
    category: "Partner Inventory Info",
    version: "v1.2",
    lastUpdated: "2026-08-04",
    fileSize: "3.2 MB",
    status: "Draft",
    lastRagIndexedAt: undefined,
  },
];

export const initialPlatformAdmins: PlatformAdmin[] = [
  {
    id: "ADM-001",
    name: "Main Controller",
    email: "admin@foodloop.eg",
    roleTitle: "Platform Controller",
    status: "ACTIVE",
    lastActive: "Just now",
    permissions: [
      "can_resolve_disputes",
      "can_edit_system_caps",
      "can_ban_users",
      "can_manage_roles",
      "can_manage_rag_docs",
      "can_view_analytics",
    ],
  },
  {
    id: "ADM-002",
    name: "Sarah Ahmed",
    email: "sarah@foodloop.eg",
    roleTitle: "Compliance Manager",
    status: "ACTIVE",
    lastActive: "15 mins ago",
    permissions: [
      "can_resolve_disputes",
      "can_ban_users",
      "can_manage_rag_docs",
      "can_view_analytics",
    ],
  },
  {
    id: "ADM-003",
    name: "Mike Hassan",
    email: "mike@foodloop.eg",
    roleTitle: "Support Analyst",
    status: "ACTIVE",
    lastActive: "2 hours ago",
    permissions: ["can_resolve_disputes"],
  },
  {
    id: "ADM-004",
    name: "Karim Ibrahim",
    email: "karim@foodloop.eg",
    roleTitle: "Operations Specialist",
    status: "INACTIVE",
    lastActive: "3 days ago",
    permissions: ["can_view_analytics"],
  },
];

export const initialSecuritySettings: SecuritySettings = {
  auditLogRetentionDays: 180,
  sessionTimeoutMinutes: 30,
};

export const initialAiObservabilitySettings: AiObservabilitySettings = {
  promptCacheTtlMinutes: 60,
  requestBatchingWindowMs: 250,
  sentryAlertThresholdLatencyMs: 1200,
  sentryErrorRateThresholdPercent: 2.5,
  monthlyApiCostCapEgp: 15000,
  sentryStatus: "Healthy",
};
