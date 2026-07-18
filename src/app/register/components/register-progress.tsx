import { cn } from "@/lib/cn";

type RegisterProgressProps = {
  step: number;
  totalSteps?: number;
  label: string;
  labelClassName?: string;
  variant: "linear" | "segmented";
  className?: string;
};

export function RegisterProgress({
  step,
  totalSteps = 3,
  label,
  labelClassName,
  variant,
  className,
}: RegisterProgressProps) {
  if (variant === "segmented") {
    return (
      <div className={cn("flex w-full flex-col items-center gap-2", className)}>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <span
              key={index}
              className={cn(
                "h-2 w-12 rounded-full",
                index < step ? "bg-primary" : "bg-outline-variant",
              )}
            />
          ))}
        </div>
        <p className="text-label-md tracking-wide text-link uppercase">
          {label}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div className="flex items-end justify-between">
        <p
          className={cn(
            "text-label-md",
            labelClassName ?? "text-on-surface-variant",
          )}
        >
          {label}
        </p>
        <p className="text-label-md text-link">
          الخطوة {step} من {totalSteps}
        </p>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
