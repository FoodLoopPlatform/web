import { Metadata } from "next";
import { SystemSettingsClientContainer } from "./components/SystemSettingsClientContainer";
import {
  initialAutomationDefaults,
  initialGuidelineDocuments,
  initialPlatformAdmins,
  initialSecuritySettings,
  initialAiObservabilitySettings,
} from "../mocks/system-settings.mock";

export const metadata: Metadata = {
  title: "System Settings | FoodLoop Admin Portal",
  description:
    "Manage FoodLoop platform-wide automation limits, RAG guideline documents, role-based access control, security policies, and AI observability.",
};

export default function SystemSettingsPage() {
  return (
    <SystemSettingsClientContainer
      initialDefaults={initialAutomationDefaults}
      initialDocuments={initialGuidelineDocuments}
      initialAdmins={initialPlatformAdmins}
      initialSecuritySettings={initialSecuritySettings}
      initialAiObservabilitySettings={initialAiObservabilitySettings}
    />
  );
}
