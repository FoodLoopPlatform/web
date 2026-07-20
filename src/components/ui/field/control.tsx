"use client";

import { cn } from "@/lib/cn";
import { useFieldContext } from "./context";

type FieldControlProps = React.ComponentProps<"input">;

export function FieldControl({ className, ...props }: FieldControlProps) {
  const { id, invalid, describedBy } = useFieldContext();

  return (
    <input
      id={id}
      aria-invalid={invalid}
      aria-describedby={describedBy}
      className={cn(
        "h-11 w-full rounded-md border bg-surface-container-lowest ps-4 pe-3 text-body-md text-on-surface shadow-[inset_0_1px_2px_rgb(0_0_0_/_0.04)] outline-none placeholder:text-on-surface-variant focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        invalid
          ? "border-error focus-visible:border-error focus-visible:ring-error/20"
          : "border-outline-variant",
        className,
      )}
      {...props}
    />
  );
}
