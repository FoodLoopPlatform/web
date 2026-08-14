"use client";

import { useState } from "react";
import { Text } from "@/components/ui/text";
import { RefreshIcon } from "@/components/icons/refresh-icon";
import { resendVerification } from "@/app/register/api/auth-api";
import { useAppStore, useHasHydrated } from "@/store/use-app-store";

export function ResendVerificationButton() {
  const hasHydrated = useHasHydrated();
  const email = useAppStore((state) => state.user?.email);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!hasHydrated || !email) return null;

  async function handleResend() {
    setSubmitting(true);
    setStatus("idle");
    const res = await resendVerification({ email: email! });
    setSubmitting(false);

    if (res.error) {
      setMessage(res.error);
      setStatus("error");
      return;
    }

    setMessage(`تم إرسال بريد التحقق مرة أخرى إلى ${email}`);
    setStatus("sent");
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 border-t border-outline-variant pt-4">
      <Text variant="body-md" className="text-on-surface-variant">
        لم يصلك بريد التحقق؟
      </Text>
      <button
        type="button"
        onClick={handleResend}
        disabled={submitting}
        className="inline-flex items-center gap-2 text-body-md font-medium text-link opacity-80 transition-opacity hover:opacity-100 disabled:pointer-events-none disabled:opacity-40"
      >
        <RefreshIcon className="h-5 w-5" />
        {submitting ? "جارٍ الإرسال..." : "إعادة إرسال بريد التحقق"}
      </button>
      {message && (
        <Text
          variant="body-md"
          className={
            status === "error" ? "text-error" : "text-on-surface-variant"
          }
        >
          {message}
        </Text>
      )}
    </div>
  );
}
