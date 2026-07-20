import { RegisterProgress } from "./components/register-progress";
import { BusinessSignupForm } from "./components/business-signup-form";
import { RegisterDivider } from "./components/register-divider";

export default function BusinessSignupPage() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-2 pb-2">
      <RegisterProgress step={1} label="التسجيل" variant="linear" />
      <BusinessSignupForm />
      <RegisterDivider />
    </div>
  );
}
