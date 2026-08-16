import { Metadata } from "next";
import { SystemSettingsClientContainer } from "./components/SystemSettingsClientContainer";
import { getAutomationDefaultsServer } from "../api/server-admin-api";

export const metadata: Metadata = {
  title: "System Settings | FoodLoop Admin Portal",
  description:
    "Manage FoodLoop platform-wide automation limits and RAG guideline documents.",
};

export default async function SystemSettingsPage() {
  const res = await getAutomationDefaultsServer();
  // If fetching fails, we provide a safe fallback for the UI to still render
  const safeDefaults = res.data || {
    maxDiscountPerCycle: 15,
    defaultPriceFloorPolicy: "DYNAMIC_AI",
    newBusinessDefaultMode: "Manual",
    autoVerifyStores: false,
    bulkUploads: false,
  };

  return <SystemSettingsClientContainer initialDefaults={safeDefaults} />;
}
