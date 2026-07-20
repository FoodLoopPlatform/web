"use client";

import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { useFieldContext } from "./context";

type FieldSelectProps = React.ComponentProps<"select">;

export function FieldSelect({
  className,
  children,
  ...props
}: FieldSelectProps) {
  const { id, invalid, describedBy } = useFieldContext();

  return (
    <div className="relative w-full">
      <select
        id={id}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={cn(
          "h-11 w-full appearance-none rounded-md border bg-surface-container-lowest ps-4 pe-9 text-body-md text-on-surface outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          invalid
            ? "border-error focus-visible:border-error focus-visible:ring-error/20"
            : "border-outline-variant",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
    </div>
  );
}
