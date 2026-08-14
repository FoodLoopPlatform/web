import { Metadata } from "next";
import { SystemSettingsClientContainer } from "./components/SystemSettingsClientContainer";
import {
  initialAutomationDefaults,
  initialGuidelineDocuments,
} from "../mocks/system-settings.mock";

export const metadata: Metadata = {
  title: "System Settings | FoodLoop Admin Portal",
  description:
    "Manage FoodLoop platform-wide automation limits and RAG guideline documents.",
};

export default function SystemSettingsPage() {
  return (
    <SystemSettingsClientContainer
      initialDefaults={initialAutomationDefaults}
      initialDocuments={initialGuidelineDocuments}
    />
  );
}
