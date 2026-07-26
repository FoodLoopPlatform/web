import type { LocationSettingsInput } from "./schemas";

export type LocationFormProps = {
  initialData: LocationSettingsInput & { lastUpdated?: string };
  onSaveSuccess: (lastUpdated: string) => void;
  showToast: (msg: string, type: "success" | "error") => void;
};
