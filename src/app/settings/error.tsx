"use client";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { InfoCircleIcon } from "@/components/icons/info-circle-icon";
import { invalidateStoreResource } from "./api/store-resource";

export default function SettingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col min-h-full bg-surface items-center justify-center px-margin-mobile py-8 md:px-margin-desktop">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-3 p-6 rounded-xl border border-error-container/40 bg-error-container/20">
        <InfoCircleIcon className="h-6 w-6 text-error" aria-hidden="true" />
        <Text variant="body-md" className="text-error font-bold">
          {error.message || "تعذر تحميل بيانات المتجر"}
        </Text>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            invalidateStoreResource();
            reset();
          }}
        >
          إعادة المحاولة
        </Button>
      </div>
    </div>
  );
}
