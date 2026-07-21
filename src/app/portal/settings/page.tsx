import {
  getStoreProfile,
  getLocationSettings,
} from "./services/settings-service";
import { SettingsContent } from "./components/settings-content";

export default async function SettingsPage() {
  const [profileRes, locationRes] = await Promise.all([
    getStoreProfile(),
    getLocationSettings(),
  ]);

  return (
    <SettingsContent
      initialProfile={profileRes.data}
      initialLocation={locationRes.data}
    />
  );
}
