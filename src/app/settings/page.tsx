import { getStoreProfile } from "./services/settings-service";
import { emptyLocationSettings } from "./lib/constants";
import { SettingsContent } from "./components/settings-content";

// Per-user dashboard page backed by client-only session state — there's no
// meaningful static version of it, so opt out of prerendering entirely.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const profileRes = await getStoreProfile();

  return (
    <SettingsContent
      initialProfile={profileRes.data}
      initialLocation={emptyLocationSettings}
    />
  );
}
