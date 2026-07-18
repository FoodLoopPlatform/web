"use client";

import { cn } from "@/lib/cn";
import { useFieldContext } from "./context";

type FieldHelperTextProps = React.ComponentProps<"p">;

export function FieldHelperText({ className, ...props }: FieldHelperTextProps) {
  const { id, invalid } = useFieldContext();

  if (invalid) return null;

  return (
    <p
      id={`${id}-helper`}
      className={cn("text-label-md text-on-surface-variant", className)}
      {...props}
    />
  );
}
