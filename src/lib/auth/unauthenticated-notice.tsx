import { InfoCircleIcon } from "@/components/icons/info-circle-icon";
import { Text } from "@/components/ui/text";

export function UnauthenticatedNotice({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col min-h-full bg-surface items-center justify-center px-margin-mobile py-8 md:px-margin-desktop">
      <div className="max-w-3xl w-full text-center flex flex-col items-center gap-3 p-6 rounded-xl border border-error-container/40 bg-error-container/20">
        <InfoCircleIcon className="h-6 w-6 text-error" aria-hidden="true" />
        <Text variant="body-md" className="text-error font-bold">
          {message}
        </Text>
      </div>
    </div>
  );
}
