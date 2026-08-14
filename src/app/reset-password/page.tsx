import { Suspense } from "react";
import { ResetPasswordForm } from "./components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-2 pb-2">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
