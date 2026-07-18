"use client";

import { cn } from "@/lib/cn";
import { useFieldContext } from "./context";

type FieldLabelProps = React.ComponentProps<"label">;

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  const { id } = useFieldContext();

  return (
    <label
      htmlFor={id}
      className={cn("text-label-md text-on-surface-variant", className)}
      {...props}
    />
  );
}
